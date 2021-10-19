const path = require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');

require("./db/conn");
const Register = require('./models/registers');
// console.log(Register);
// giving absolute path
app.use(express.json());
app.use(express.urlencoded({extended : false}));
const staticPath = path.join(__dirname, "../public");

// express.static is a builtin middleware
app.use(express.static(staticPath));
app.set('views', path.join(__dirname, '../views'));
app.set("view engine","hbs");

app.get('/', (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
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
        res.status(201).render("login");

      }else{
          res.send("Passwords are not matching")
      }
      

  }catch(error){
      res.status(404).send(error)
  }
});

 // Fetching login data and validation of login data
app.post("/login",async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
      const userdata =  await Register.findOne({email : email});
      if(userdata.password===password) {
        res.status(200).render("index");
      }else{
        res.status(404).send("Password is not matching");
      }

    } catch (error) {
       res.status(400).send("Invalid Credentials");
    }
});




app.listen(8000, () => {
  console.log("Listening....");

})