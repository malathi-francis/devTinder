const { validate } = require('express-validators');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required:true,
    trim: true,
    minLength:4
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required:true,
    unique:true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)){
        throw new Error("invlid email!");
      };
    }
  },
  password: {
    type: String,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Enter a strong password" + value);
      }
    }
  },
  age:{
    type: Number,
    min:18
  },
  gender: {
    type: String,
    validate(value){
      if(!['Male','Female','Others'].includes(value)){
        throw new error("Not a valid gender!"); //vlaidators given here will only work while creating data not while updating, for update make changes to your update code 
      }
    }
  },
  photoUrl: {
    type: String,
    default:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1745498006~exp=1745501606~hmac=9769a7bbc3a690b139016fb9d03f65b133877f1af633a209d0f6744aa51244fd&w=740",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid photo URL! " + value);
      }
    }
  },
  about: {
    type: String,
    default: "default value"
  },
  skills: {
    type: [String]
  }
},{
    timestamps:true
  }
);
userSchema.methods.getJWT = async function() {
  const user = this;
  const token = await jwt.sign({_id:user._id},"DEV@TINDER#980",{expiresIn: '7d'});
  return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {

  const user = this;
  const hashedPass = user.password;

  const isValidPassword = await bcrypt.compare(passwordInputByUser,hashedPass);
  return isValidPassword;
};
module.exports = mongoose.model("User",userSchema);