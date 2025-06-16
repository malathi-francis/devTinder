const jwt = require('jsonwebtoken');
const User = require('../models/user');


// to validate the token from cookies and get user
const userAuth = async (req,res,next) => {
  try{
  const {token} = req.cookies;
  if(!token) return res.status(401).send("Please login")
  const decodedToken  = await jwt.verify(token,'DEV@TINDER#980') 
  const {_id} = decodedToken;
  if(_id){
  const user = await User.findById(_id);
  if(!user) throw new Error("user not found");
  req.user = user;
  next();
  }
} catch (err){
  res.status(400).send("ERROR: " + err.message);
}
};

module.exports = {
  userAuth
};