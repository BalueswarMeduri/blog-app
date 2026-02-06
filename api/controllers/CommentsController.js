import { Handelerror } from "../helpers/Handelerror.js";
import Comment from "../models/comment.model.js";

export const addcomment = async(req, res,next)=>{
    try {
        const {user, blogid, comment} = req.body;
        const newcomment = new Comment({
            user : user,
            blogid : blogid,
            comment : comment
        })
        await newcomment.save();
        res.status(200).json({
            success : true,
            message : "Comment added successfully",
            newcomment
        })
    } catch (error) {
        next(Handelerror(500, error.message));
    }
}

export const getComments = async(req, res,next)=>{
    try {
        const {blogid} = req.params;
        const comments = await Comment.find({blogid}).populate("user", 'name avatar').sort({createdAt : -1}).lean().exec();
        res.status(200).json({
            success : true,
            comments
        })
    } catch (error) {
        next(Handelerror(500, error.message));
    }
}
export const commentCount = async(req, res,next)=>{
    try {
        const {blogid} = req.params;
        const commentCount = await Comment.countDocuments({blogid})
        res.status(200).json({
            success : true,
            commentCount
        })
    } catch (error) {
        next(Handelerror(500, error.message));
    }
}

export const getAllComments = async(req, res,next)=>{
    try {
        const user = req.user
        let comments;
        if(user.role == 'admin'){
            comments = await Comment.find().populate('blogid', 'title').populate('user', 'name').sort({createdAt : -1}).lean().exec();
        }else{
            comments = await Comment.find({user : user._id}).populate('blogid', 'title').populate('user', 'name').sort({createdAt : -1}).lean().exec();
        }
        
        res.status(200).json({
            success : true,
            comments
        })
    } catch (error) {
        next(Handelerror(500, error.message));
    }
}

export const deleteComment = async(req, res,next)=>{
    try {
        const {id} = req.params;
        const comment = await Comment.findByIdAndDelete(id);
        if(!comment){
            return next(Handelerror(404, "Comment not found"));
        }
        res.status(200).json({
            success : true,
            message : "Comment deleted successfully"
        })
    } catch (error) {
        next(Handelerror(500, error.message));
    }
}