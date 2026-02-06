import express from "express";
import { addcomment, commentCount, getAllComments, getComments, deleteComment } from "../controllers/CommentsController.js";
import { authenticate } from "../middleware/authenticate.js";

const CommentRoute = express.Router();

CommentRoute.post("/add", authenticate, addcomment)
CommentRoute.get("/get/:blogid", getComments)
CommentRoute.get("/get-count/:blogid", commentCount)
CommentRoute.get("/get-all-comments", authenticate, getAllComments)
CommentRoute.delete("/delete/:id", authenticate, deleteComment)

export default CommentRoute
