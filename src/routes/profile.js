const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const {validateUpdateData} = require('../utils/validation');
const bcrypt = require('bcrypt');


profileRouter.get('/profile/view',userAuth,async(req,res) => {
  try{
  const user = req.user;
  console.log("cookies = ",user);
  res.send(user);
  } catch(err) {
    throw new Error("ERROR: " + err.message);
  }
});

profileRouter.patch('/profile/edit',userAuth,async(req,res) => {
  try{    
    if(!validateUpdateData(req)){
      throw new Error("invalid update value");
    };
    let loggedinUser = req.user;
    console.log("user = ",req.user);

    Object.keys(req.body) .forEach((key)=>loggedinUser[key] = req.body[key]);
    console.log("user = ",req.user);
    await loggedinUser.save();

    res.json({
      message:(`${loggedinUser.firstName}, your profile was updated!`),
      data:loggedinUser});

  } catch(err){
    res.status(400).send(err.message);
  }
});

profileRouter.patch('/profile/forgotpassword',userAuth,async(req,res)=> {
  try{
    let loggedinUser = req.user;
    console.log("user = ",loggedinUser);
    let {oldPass} = req.body;
    const checkPassword = await loggedinUser.validatePassword(oldPass);
    console.log("checkPassword = ",checkPassword);
    
    if(!checkPassword) throw new Error("Password mismatched!");
      let {newPass} = req.body;
      let hashedPassword = await bcrypt.hash(newPass,10);
      loggedinUser.password = hashedPassword;
      loggedinUser.save();
      res.send("password updated successfully");
    

  } catch(err){
    res.status(400).send("failed to update password: " + err.message);
  }

});

module.exports = profileRouter;