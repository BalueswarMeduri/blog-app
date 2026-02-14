import imagekit from "../config/imagekit.js";
import { Handelerror } from "../helpers/Handelerror.js";
import Blog from "../models/blog.model.js";
import { encode } from "entities";
import fs from "fs/promises";
import Category from "../models/category.model.js";
import client from "../redis/redisClient.js";

export const addBlog = async (req, res, next) => {
  try {
    // Parse the JSON data
    const data = JSON.parse(req.body.data);

    let featuredImage = "";

    if (req.file) {
      try {
        const uploadResult = await imagekit.upload({
          file: await fs.readFile(req.file.path),
          fileName: req.file.originalname,
          folder: "codetales",
        });

        featuredImage = uploadResult.url;

        // Clean up temp file after successful upload
        await fs
          .unlink(req.file.path)
          .catch((err) => console.log("Temp file cleanup error:", err));
      } catch (uploadError) {
        console.error("ImageKit upload error:", uploadError);
        // Clean up temp file even on error
        await fs
          .unlink(req.file.path)
          .catch((err) => console.log("Temp file cleanup error:", err));
        return next(
          Handelerror(500, "Failed to upload image. Please try again."),
        );
      }
    } else {
      return next(Handelerror(400, "Featured image is required"));
    }

    const blog = new Blog({
      category: data.category,
      title: data.title,
      slug: data.slug,
      featuredImage: featuredImage,
      blogContent: encode(data.blogContent),
      author: data.author,
    });

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog added successfully",
      blog,
    });
  } catch (error) {
    console.error("Blog creation error:", error);
    next(Handelerror(500, error.message));
  }
};

export const editBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const blog = await Blog.findById(blogid).populate('category', 'name')
    if (!blog) {
      return next(Handelerror(404, "Category not found"));
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(Handelerror(500, error.message));
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    // Parse the JSON data
    const { blogid } = req.params;
    const data = JSON.parse(req.body.data);

    const blog = await Blog.findById(blogid);
    if (!blog) {
      return next(Handelerror(404, "Blog not found"));
    }

    blog.category = data.category;
    blog.title = data.title;
    blog.slug = data.slug;
    blog.blogContent = encode(data.blogContent);

    if (req.file) {
      try {
        const uploadResult = await imagekit.upload({
          file: await fs.readFile(req.file.path),
          fileName: req.file.originalname,
          folder: "codetales",
        });

        blog.featuredImage = uploadResult.url;

        // Clean up temp file after successful upload
        await fs
          .unlink(req.file.path)
          .catch((err) => console.log("Temp file cleanup error:", err));
      } catch (uploadError) {
        console.error("ImageKit upload error:", uploadError);
        // Clean up temp file even on error
        await fs
          .unlink(req.file.path)
          .catch((err) => console.log("Temp file cleanup error:", err));
        return next(
          Handelerror(500, "Failed to upload image. Please try again."),
        );
      }
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Blog update error:", error);
    next(Handelerror(500, error.message));
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    await Blog.findByIdAndDelete(blogid);
    res.status(201).json({
      success: true,
      message: "Category Deleted successfully",
    });
  } catch (error) {
    next(Handelerror(500, error.message));
  }
};

export const showallBlog = async (req, res, next) => {

  try {
     const cachedBlogs = await client.get("blogs:all")
    if(cachedBlogs){
       return res.status(200).json({
        success: true,
        blog: JSON.parse(cachedBlogs),
      })
    }
    const user = req.user
    let blog;
    if(user.role === 'admin'){
      blog = await Blog.find()
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    }else{
       blog = await Blog.find({author : user._id})
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    }
    

    res.status(200).json({
      success: true,
      blog,
    });
    client.set("blogs:all", JSON.stringify(blog));
    client.expire("blogs:all", 5 * 60);
  } catch (error) {
    next(Handelerror(500, error.message));
  }
};

export const getBlog = async (req, res, next)=>{
  try {
    const cachedBlog = await client.get(`blog:${req.params.slug}`)
    if(cachedBlog){
      return res.status(200).json({
        success: true,
        blog: JSON.parse(cachedBlog),
      })
    }
    const {slug} = req.params;
    const blog = await Blog.findOne({slug})
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      blog,
    });
    client.set(`blog:${slug}`, JSON.stringify(blog));
    client.expire(`blog:${slug}`, 5 * 60);  
  } catch (error) {
    next(Handelerror(500, error.message));
  }
}

export const getRelatedBlogs = async (req, res, next)=>{
  try {
    const {category, blog} = req.params;
    const categoryData = await Category.findOne({slug: category});
    if(!categoryData){
        return next(Handelerror(404, 'category data not found.'));
    }
    const categoryId = categoryData._id;
    const relatedblog = await Blog.find({category: categoryId, slug : {$ne : blog}})
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      relatedblog,
    });
  } catch (error) {
    next(Handelerror(500, error.message));
  }
}

export const getBlogByCategoryBlogs = async (req, res, next)=>{
  try {
    const {category} = req.params;
    const categoryData = await Category.findOne({slug: category});
    if(!categoryData){
        return next(Handelerror(404, 'category data not found.'));
    }
    const categoryId = categoryData._id;
    const blog = await Blog.find({category: categoryId})
    .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      blog,
      categoryData
    });
  } catch (error) {
    next(Handelerror(500, error.message));
  }
}


export const search = async (req, res, next)=>{
  try {
    const {q} = req.query;
    const blog = await Blog.find({title: {$regex: q, $options: 'i'}})
    .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(Handelerror(500, error.message));
  }
}

export const getAllBlogs = async (req, res, next) => {
  try {
    const cachedBlogs = await client.get("blogs:all")
    if(cachedBlogs){
       return res.status(200).json({
        success: true,
        blog: JSON.parse(cachedBlogs),
      })
    }
    const blog = await Blog.find()
      .populate("author", "name avatar role")
      .populate("category", "name slug") 
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      blog,
    });
    client.set("blogs:all", JSON.stringify(blog));
    client.expire("blogs:all", 5 * 60); 
  } catch (error) {
    next(Handelerror(500, error.message));
  }
};