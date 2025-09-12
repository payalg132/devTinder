const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: (value) => {
            if(!validator.isEmail(value)) {
                throw new error("Email is not valid");
            }   
        }
    },
    password: {
        type: String,
        required: true,
        validate: (value) => {
            if(value.length < 8) {
                throw new error("Password must be at least 8 characters long");
            }   
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate: (value) => {
            const allowedGenders = ['male', 'female', 'other'];
            if(!( allowedGenders.includes(value))) {
                throw new error("Gender data is not valid");
            }
        }   
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        validate: (value) => {
            if(!validator.isURL(value)) {
                throw new error("Photo URL is not valid");
            }   
        }
    },
    about: {
        type: String,
        default: "This is default about us"
    },
    skills: {
        type: [String] 
    }
},
{
    timestamps: true
});

userSchema.methods.getJWT = async function() {
    
    const user = this;
    const token = await jwt.sign( {userId: user._id},"devTinder@2025",{expiresIn: "7d"});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);