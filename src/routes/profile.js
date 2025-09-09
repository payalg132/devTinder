const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try{
       const userProfile = req.user;
        res.status(200).json(userProfile);
    } catch(err){
        return res.status(401).send("ERROR : " + err.message);
    }
});

module.exports = profileRouter;