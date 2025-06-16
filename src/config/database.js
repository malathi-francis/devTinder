const mongoose = require('mongoose');

const connectDb = async ()=>{
  await mongoose.connect("mongodb+srv://root:root@malfran.bsegv.mongodb.net/devTinder"
  )};

module.exports  = connectDb;