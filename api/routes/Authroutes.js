import express from "express";
import { Googlelogin, login, register, Logout } from "../controllers/Authcontroller.js";
import { authenticate } from "../middleware/authenticate.js";

const Authroute = express.Router();

Authroute.post("/register", register)
Authroute.post("/login", login) 
Authroute.post('/google-login', Googlelogin)
Authroute.get('/logout',authenticate, Logout)

export default Authroute
