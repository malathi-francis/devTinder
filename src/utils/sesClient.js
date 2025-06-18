const  {SESClient} = require("@aws-sdk/client-ses");
require('dotenv').config();

//set the aws region
const REGION = "ap-south-1";
//create ses service object
const sesClient = new SESClient({ region : REGION, credentials: {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
},

});
module.exports =  {sesClient};
