
 // imports
 const express = require('express');
 const path = require('path');
 const axios = require('axios').default;
 const _ = require('lodash');
 const ejs = require('ejs')
 // constant
 const app = express();
 
 // middlewares
 app.use(express.json()); // This will parse json payload.
 app.use(express.urlencoded({extended: true})); // This will parse urlencoded payload.
 app.use(express.static(path.join(__dirname,'../public'))); // This will serve public directory on our server.
 app.set('views', path.join(__dirname, '../views'));
 app.set('view engine', 'ejs'); // So express uses ejs as its templating engine.
 
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
         .then((response) => {
             const image_meme  = response.data.data.url;
            //  console.log(image_meme);
             return res.send(`<img src=${image_meme}>
              <p> Successfully generated </p>
             `);
         }).catch((e) => {
             return res.status(403).send("403 Client Error")
         });
 });
 
 app.listen(3000,()=>{
     console.log("Listening....");
 })
 