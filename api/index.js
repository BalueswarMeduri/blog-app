import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Authroute from './routes/Authroutes.js'
import UserRoute from './routes/userroute.js'
import CategoryRoute from './routes/Category.route.js'
import BlogRoute from './routes/Blog.route.js'
import CommentRoute from './routes/Commentroute.js'
import BloglikeRoute from './routes/Bloglike.route.js'


dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin : ture,
    credentials : true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'],
    methods: ['GET', 'POST','PUT', 'PATCH', 'DELETE', 'OPTIONS']
}))

//route setups
app.use('/api/auth', Authroute)
app.use('/api/user', UserRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/blog', BlogRoute)
app.use('/api/comment', CommentRoute)
app.use('/api/blog-like', BloglikeRoute)

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("MongoDB connected.");
}).catch((err)=>{
    console.log(err.message);
})


app.listen(port, ()=>{
    console.log(`server is running on port : ${port}`);
})

// Error handling middleware (should be after routes)
app.use((err, req, res, next)=>{
    const statuscode = err.statuscode || 500
    const message = err.message || "internal server error"
    res.status(statuscode).json({
        success : false, 
        statuscode,
        message
    })
})