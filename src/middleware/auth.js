const jwt = require("jsonwebtoken");
const user = require("../models/user");

const userAuth = async (req, res,next) => {
    const token = req.cookies.token;

    if(!token){
       return res.status(401).send("Please login to access this resource");
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const userData = await user.findById(userId);
        if(!userData){
            throw new Error("User not found");
        }

        req.user = userData;
        next();
    } catch(err){
        return res.status(401).send("ERROR : " + err.message);
    }
};

module.exports = {userAuth};