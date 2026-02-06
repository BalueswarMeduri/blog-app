import { Handelerror } from "../helpers/Handelerror.js"
import Category from "../models/category.model.js"

export const addCategory = async (req, res,next) => {
    try {
        const {name, slug} = req.body
        const category = new Category({
            name, slug 
        })
        await category.save()

        res.status(201).json({
            success : true,
            message : "Category added successfully",
        })
    } catch (error) {
        next(Handelerror(500, error.message))
    }
}

export const showCategory = async (req, res, next) => {
  try {
    const { categoryid } = req.params;
    const category = await Category.findById(categoryid);
    if (!category) {
      return next(Handelerror(404, "Category not found"));
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(Handelerror(500, error.message));
  }
};

export const updateCategory = async (req, res,next) => {
    try {
        const {name, slug} = req.body
        const { categoryid } = req.params;
        const category = await Category.findByIdAndUpdate(categoryid,{
            name, slug
        },{new : true});
        
        res.status(201).json({
            success : true,
            message : "Category updated successfully",
            category
        })
    } catch (error) {
        next(Handelerror(500, error.message))
    }
}

export const deleteCategory = async (req, res,next) => {
    try {
         const { categoryid } = req.params;
         await Category.findByIdAndDelete(categoryid)
        res.status(201).json({
            success : true,
            message : "Category Deleted successfully",
        })
    } catch (error) {
        next(Handelerror(500, error.message))
    }
}

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .sort({ name: 1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(Handelerror(500, error.message));
  }
};

