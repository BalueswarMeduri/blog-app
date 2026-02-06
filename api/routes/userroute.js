import express from "express";
import { deleteuser, getAlluser, getUser, updateUser } from "../controllers/usercontroller.js";
import upload from "../config/multer.js";
import { authenticate } from "../middleware/authenticate.js";

const UserRoute = express.Router();

UserRoute.use(authenticate)
UserRoute.get("/get-user/:userid", getUser)
UserRoute.put('/update-user/:userid',upload.single('file'), updateUser)
UserRoute.get("/get-all-user", getAlluser)
UserRoute.delete("/delete/:id", deleteuser)

export default UserRoute
