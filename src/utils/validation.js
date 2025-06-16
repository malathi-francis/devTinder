const validator = require('validator')
const validateSignupData = (req)=>{
  const {firstName,email,password} = req.body;

  if(!firstName){
    throw new Error("Enter first name");
  }
  else if(firstName.length <= 4 || firstName .length >= 20 ){
    throw new Error("firstName should be 4-20 characters");   
  }
  else if(!email){
    throw new Error()
  }
  else if(!validator.isEmail(email)){
    throw new Error("email id invalid");
  }

  else if(!validator.isStrongPassword(password)){
    throw new Error("Enter strong password ")
  }
};

const validateUpdateData = (req) =>{
  console.log("validate called!!");
  
  let allowedUpdateKeys = ['firstName','lastName','email','age','gender','photoUrl','about','skills']

  const isAllowedKeys = Object.keys(req.body).every((field)=> allowedUpdateKeys.includes(field));

  return isAllowedKeys;
};

module.exports = {validateSignupData,validateUpdateData};