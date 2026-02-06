import imagekit from "../config/imagekit.js";
import fs from "fs/promises";
import { Handelerror } from "../helpers/Handelerror.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"

export const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;

    const user = await User.findById(userid).lean();
    if (!user) {
      return next(Handelerror(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: "User found",
      user,
    });
  } catch (error) {
    next(Handelerror(500, error.message));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    const { userid } = req.params;

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = data.name;
    user.email = data.email;
    user.bio = data.bio;

    if (data.password && data.password.length >= 8) {
      const hashedpassword = bcrypt.hashSync(data.password);
      user.password = hashedpassword;
    }

    if (req.file) {
      try {
        const uploadResult = await imagekit.upload({
          file: await fs.readFile(req.file.path),
          fileName: req.file.originalname,
          folder: 'codetales'
        });
        user.avatar = uploadResult.url;

        // Clean up temp file
        await fs.unlink(req.file.path).catch(err => console.log("Temp file cleanup error:", err));
      } catch (error) {
        console.error("ImageKit upload error:", error);
        // Clean up temp file even on error
        await fs.unlink(req.file.path).catch(err => console.log("Temp file cleanup error:", err));
        return next(Handelerror(500, "Failed to upload image."));
      }
    }

    await user.save(); // Save the updated user in the database

    res.status(200).json({
      success: true,
      message: "User data updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error)
    next(Handelerror(500, error.message));
  }
};

export const getAlluser = async(req,res,next)=>{
  try {
    const user = await User.find().sort({createdAt:-1})
    res.status(200).json({
      success:true,
      message:"User found",
      user
    })
  } catch (error) {
    next(Handelerror(500,error.message))
  }
}

export const deleteuser = async(req,res,next)=>{
  try {
    const {id} = req.params
    const user = await User.findByIdAndDelete(id)
    res.status(200).json({
      success:true,
      message:"User deleted successfully",
      user
    })
  } catch (error) {
    next(Handelerror(500,error.message))
  }
}