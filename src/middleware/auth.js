const jwt = require("jsonwebtoken");
const user = require("../models/user");

const userAuth = async (req, res,next) => {
    const token = req.cookies.token;

    if(!token){
       throw new Error("No token found");
    }

    try{
        const decoded = jwt.verify(token, "devTinder@2025");
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