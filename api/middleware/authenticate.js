import jwt from "jsonwebtoken";

export const authenticate = async(req, res, next) => {
    try {
         const token = req.cookies.access_token;
    if(!token) {
        next(403, 'unauthorized')
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
    } catch (error) {
        next(403, error.message)
    }
   
}