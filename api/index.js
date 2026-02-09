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
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost", 
  "http://localhost:5173",
  "https://blog-app-balu.vercel.app",
  "https://blog-app-blond-sigma-83.vercel.app",
  "https://blog-app-xj7v-ldx0ms583-balueswarmeduris-projects.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"]
  })
);

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