import express from "express";
import { addBlog, deleteBlog, editBlog, getAllBlogs, getBlog, getBlogByCategoryBlogs, getRelatedBlogs, search, showallBlog, updateBlog } from "../controllers/Blogcontroller.js";
import upload from "../config/multer.js";
import { authenticate } from "../middleware/authenticate.js";

const BlogRoute = express.Router();

BlogRoute.post("/add", authenticate, upload.single("file"), addBlog)
BlogRoute.get("/edit/:blogid", authenticate, editBlog)
BlogRoute.put("/update/:blogid", authenticate, upload.single("file"), updateBlog)
BlogRoute.delete("/delete/:blogid", authenticate, deleteBlog)
BlogRoute.get("/get-all",authenticate, showallBlog) 

BlogRoute.get("/get-blog/:slug", getBlog) 
BlogRoute.get("/get-related-blogs/:category/:blog", getRelatedBlogs)
BlogRoute.get("/get-blog-by-category/:category", getBlogByCategoryBlogs)
BlogRoute.get("/search", search)

BlogRoute.get("/blogs", getAllBlogs) 

export default BlogRoute
