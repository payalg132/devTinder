const validator = require("validator");

const validationOnSignUp = (req) => {

    const {firstName, lastName, emailId, password} = req.body;

    if(firstName.length < 2 || firstName.length > 30){
        throw new Error("First name must be between 2 and 30 characters");
    }
    if(lastName.length < 2 || lastName.length > 30){
        throw new Error("Last name must be between 2 and 30 characters");
    }   
    if(!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
}

module.exports = {validationOnSignUp};