import { Handelerror } from "../helpers/Handelerror.js";
import User from "../models/user.model.js";
import bcryptjs from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie-parser'

export const register = async(req, res, next) => {
    try {
        const {name, email, password} = req.body;
        const checkuser = await User.findOne({email});
        if(checkuser){
            return next(Handelerror(400, "User already registered."));
        }

        const hashedPassword =  bcryptjs.hashSync(password, 10);
        const user = new User({
            name, email, password : hashedPassword
        })
        await user.save();
        res.status(201).json({
            success : true,
            message : "User registered successfully",
            user
        })
       
    } catch (error) {
        next(Handelerror(500, error.message));
    }
}

export const login = async(req, res,next)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email});
        if(!user){
            next(Handelerror(404, "User Not Found."));
        }
        const hashedPassword = user.password

        const comaprePassword = bcryptjs.compare(password, hashedPassword);
        if(!comaprePassword){
             next(Handelerror(404, "Invalid login Credentials."));
        }

        const token = jwt.sign({
            _id : user._id,
            name : user.name,
            email : user.email,
            avatar : user.avatar
        }, process.env.JWT_SECRET)

        res.cookie('access_token', token,{
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path : '/',
        })
        const newuser = user.toObject({getters : true})
        delete newuser.password
        res.status(200).json({
            success : true,
            message : "User logged in successfully",
            user : newuser
        })
    } catch (error) {
        next(Handelerror(500, error.message));
    }
}

export const Googlelogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const password = Math.round(Math.random() * 1000000).toString();
      const hashedPassword = bcryptjs.hashSync(password, 10);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar,
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    const newuser = user.toObject();
    delete newuser.password;

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      newuser,
    });

  } catch (error) {
    next(Handelerror(500, error.message));
  }
};

export const Logout = async (req, res, next) => {
  try {
    
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });

  } catch (error) {
    next(Handelerror(500, error.message));
  }
};
