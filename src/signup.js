const path = require('path');

const express = require('express');

const app = express();
require("./db/conn");
const Register = require('./models/registers');

const signupPath = path.join(__dirname, "../public", "signup.html");

app.get("/signup", (req, res) => {
    res.sendFile(signupPath);
  });

app.post("/signup", async (req, res) => {
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
           const registerEmployee = new Register({
               name : req.body.name,
               email : req.body.email,
               password : req.body.password,
               confirmpassword : req.body.confirmpassword,

           })    
          const registered = await registerEmployee.save();
          res.status(201).send("Registered ❤🎉💋");

        }else{
            res.send("Passwords are not matching")
        }

    }catch(error){
        res.status(404).send(error)
    }
  });



  app.listen(8000, () => {
    console.log("Listening....");
  
  })