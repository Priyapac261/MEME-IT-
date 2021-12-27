const mongoose = require('mongoose');
//defining schema for user details
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    confirmpassword : {
        type : String,
        required : true,
    }
});

// Creating collection
const Register = new mongoose.model("Register", userSchema);

module.exports = Register;