const path = require('path');

const express = require('express');
const axios = require('axios').default;
const _ = require('lodash');
const ejs = require('ejs')

const app = express();
require("./db/conn");
const Register = require('./models/registers');

const signupPath = path.join(__dirname, "../public", "signup.html");
// middlewares
app.use(express.json()); // This will parse json payload.
app.use(express.urlencoded({ extended: true })); // This will parse urlencoded payload.
app.use(express.static(path.join(__dirname, '../public'))); // This will serve public directory on our server.
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs'); // So express uses ejs as its templating engine.

let image_meme; // variable for storing image urls

app.get("/signup", (req, res) => {
  res.sendFile(signupPath);
});

app.post("/signup", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password === cpassword) {
      const registerEmployee = new Register({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,

      })
      const registered = await registerEmployee.save();
      res.status(201).send("Registered ");

    } else {
      res.send("Passwords are not matching")
    }

  } catch (error) {
    res.status(404).send(error)
  }
});
app.get("/", (req, res) => {
  axios.get("https://api.imgflip.com/get_memes")
    .then((memes) => {
      return res.render("generate", {
        memes: _.sampleSize(memes.data.data.memes, 10)
      });
    })
    .catch((e) => {
      return res.status(500).send("500 Internal Server Error");
    });
});

app.post("/generate", (req, res) => {
  axios.post(
    "https://api.imgflip.com/caption_image",
    {},
    {
      params: {
        template_id: req.body.template_id,
        username: "priyapac26",
        password: "E@glecrow8",
        text0: req.body.text0,
        text1: req.body.text1,
      },

    }
  )
    .then(async (response) => {
      image_meme = response.data.data.url;
      try {
        const email = req.body.email;
        const password = req.body.password;
      const userdata =  await Register.findOne({email : email});
      if(userdata.password===password) {
          
      }else{
        res.status(404).send("Password is not matching");
      }

    } catch (error) {
       res.status(400).send("Invalid Credentials");
    }
      console.log(image_meme);
      return res.send(`<img src=${image_meme}>
           <p> Successfully generated </p>
          `);
    }).catch((e) => {
      return res.status(403).send("403 Client Error")
    });
});



app.listen(8000, () => {
  console.log("Listening....");

})