import express from "express";
import { dolike, likecount } from "../controllers/Bloglike.js";
import { authenticate } from "../middleware/authenticate.js";

const BloglikeRoute = express.Router();

BloglikeRoute.post("/like", authenticate, dolike)

BloglikeRoute.get('/get-like/:blogid/:userid', likecount)

export default BloglikeRoute
