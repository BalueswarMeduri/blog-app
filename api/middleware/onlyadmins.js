import jwt from "jsonwebtoken";

export const onlyadmins = async(req, res, next) => {
    try {
         const token = req.cookies.access_token;
    if(!token) {
        next(403, 'unauthorized')
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if(decodedToken.role === 'admin') {
        req.user = decodedToken;
        next();
    }else{
        return next(403, 'unauthorized')
    }
   
    } catch (error) {
        next(403, error.message)
    }
   
}