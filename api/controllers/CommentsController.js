import { Handelerror } from "../helpers/Handelerror.js";
import Comment from "../models/comment.model.js";
import client from "../redis/redisClient.js";

export const addcomment = async(req, res,next)=>{
    try {
        const {user, blogid, comment} = req.body;
        const newcomment = new Comment({
            user : user,
            blogid : blogid,
            comment : comment
        });
        await newcomment.save();
        
        // Clear the comment count cache for this blog
        try {
            await client.del(`commentcount:${blogid}`);
        } catch (redisError) {
            console.log('Redis cache clear error:', redisError.message);
            // Ignore cache errors
        }
        
        res.status(200).json({
            success : true,
            message : "Comment added successfully",
            newcomment
        });
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
        try {
            const cachedCommentCount = await client.get(`commentcount:${blogid}`);
            if(cachedCommentCount){
                return res.status(200).json({
                    success: true,
                    commentCount: JSON.parse(cachedCommentCount)
                });
            }
        } catch (redisError) {
            console.log('Redis cache error:', redisError.message);
        }
        
        const commentCount = await Comment.countDocuments({blogid});
        
        const response = {
            success: true,
            commentCount
        };
        
        res.status(200).json(response);
        try {
            await client.set(`commentcount:${blogid}`, JSON.stringify(commentCount));
            await client.expire(`commentcount:${blogid}`, 24 * 60 * 60);
        } catch (cacheError) {
            console.log('Redis cache set error:', cacheError.message);
            // Ignore cache errors
        }
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
        
        // Clear the comment count cache for this blog
        try {
            await client.del(`commentcount:${comment.blogid}`);
        } catch (redisError) {
            console.log('Redis cache clear error:', redisError.message);
            // Ignore cache errors
        }
        
        res.status(200).json({
            success : true,
            message : "Comment deleted successfully"
        });
    } catch (error) {
        next(Handelerror(500, error.message));
    }
}