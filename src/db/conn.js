
const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
  // connecting mongoose to mongodb
  mongoose.connect("mongodb://localhost:27017/mydatabase").then(()=> console.log("Connection successful..")).catch((err)=>console.log(err));