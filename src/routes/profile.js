const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const bycrpt = require("bcrypt");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
       const userProfile = req.user;
        res.status(200).json(userProfile);
    } catch(err){
        return res.status(401).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{

        const user = req.user;
        const allowedUpdates = ['firstName', 'lastName', 'age', 'photoUrl', 'about','skills'];
        const isValidUPdate = Object.keys(req.body).every((field) => allowedUpdates.includes(field));

        if(!isValidUPdate){
            throw new Error("Invalid updates!");
        }

        Object.keys(req.body).forEach((field) => user[field] = req.body[field]);
        await user.save();
        res.status(200).send({message: "Profile updated successfully", data: user});
    } catch(err){
        return res.status(401).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/change-password", userAuth, async (req, res) => {
    try{
        const user = req.user;
        const {oldPassword, newPassword} = req.body;    
        if(!oldPassword || !newPassword){
            throw new Error("Both old and new passwords are required");
        }

        const isPasswordMatch = await user.validatePassword(oldPassword);
        if(!isPasswordMatch){
            throw new Error("Old password is incorrect");
        }
        user.password = await bycrpt.hash(newPassword, 10);
        console.log(user);
        await user.save();
        res.status(200).send("Password changed successfully");
    } catch(err){
        return res.status(401).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/forgot-password", async (req, res) => {
    try{
        const {emailId, newPassword} = req.body;
        if(!emailId || !newPassword){
            throw new Error("Both email and new password are required");
        }

        const newPasswordHash = await bycrpt.hash(newPassword, 10);
        const user = await User.findOneAndUpdate({emailId: emailId}, {password: newPasswordHash});
        if(!user){
            throw new Error("User with this email does not exist");
        }
        res.status(200).send("Password reset successfully");
    } catch(err){
        return res.status(401).send("ERROR : " + err.message);
    }   
});

module.exports = profileRouter;