const express = require('express');
const authRouter = express.Router();
const User = require("../models/user");
const {validationOnSignUp} = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {

    try{
        // validation
        validationOnSignUp(req);

        const {firstName, lastName, emailId, password} = req.body;

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({firstName, lastName, emailId, password: hashedPassword});

        // save the user
        await user.save();
        res.status(200).send("User signed up successfully");
    } catch(err){
        res.status(400).send("ERROR : " + err.message); 
    }
});

authRouter.post("/login", async (req, res) => {
    const {emailId, password} = req.body;
    try{
        if(!emailId || !password){
            throw new Error("Email and password are required");
        }

        if(!validator.isEmail(emailId)) {
            throw new Error("Email is not valid");
        }

        // check if user exists
        const existingUser = await User.findOne({emailId: emailId});
        if(!existingUser){
            throw new Error("Invalid email credentials");
        } 

        // compare the password
        const isPasswordMatch = await existingUser.validatePassword(password);
        if(!isPasswordMatch){   
            throw new Error("Invalid password credentials");
        }

        // generate JWT token
        const token = await existingUser.getJWT();

        //set cookie
        res.cookie("token", token, {
           expires: new Date(Date.now() + 7*24*60*60*1000)
        });

        res.status(200).send("User logged in successfully");
    } catch(err){
        return res.status(400).send("Error : " + err.message);
    }
    
});

module.exports = authRouter;