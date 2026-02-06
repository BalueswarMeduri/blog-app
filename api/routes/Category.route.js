import express from "express";
import { addCategory, deleteCategory, getAllCategories, showCategory, updateCategory } from "../controllers/Category.controllers.js";
import { onlyadmins } from "../middleware/onlyadmins.js";

const CategoryRoute = express.Router();

CategoryRoute.post("/add",onlyadmins, addCategory)
CategoryRoute.put('/update/:categoryid', onlyadmins, updateCategory)
CategoryRoute.get('/show/:categoryid', onlyadmins, showCategory)
CategoryRoute.delete('/delete/:categoryid', onlyadmins, deleteCategory)

CategoryRoute.get('/all-categories', getAllCategories)

export default CategoryRoute
