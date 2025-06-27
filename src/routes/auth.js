const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const {validateSignupData} = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


authRouter.post('/signup', async (req, res) => {
  try {
    validateSignupData(req);
    const {password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    req.body.password = hashedPassword;
    const user = new User(req.body);

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 + 3600000),
    });

    res.json({message: "User added sucessfully", data: savedUser});
  } catch (err) {
    res.status(400).send("failed to add data!" + err);
  }
});

authRouter.post('/login',async(req,res) => {
  try{    
    const {password,email} = req.body;
    const user = await User.findOne({email:email});
    
    if(!user) throw new Error("no user found");
    else{
      const checkPassword = await user.validatePassword(password);
      if(checkPassword){

        const token = await user.getJWT();

        res.cookie("token",token);
        res.send(user);
      }
      else throw new Error("Invalid email or password");
    }

  } catch(err){
    res.status(400).send("err - " +err);
  }

});

authRouter.post('/logout', async (req,res)=>{

  res.cookie("token",null,{expires: new Date(Date.now())});
  res.send("logout successful!");

})


module.exports = authRouter;