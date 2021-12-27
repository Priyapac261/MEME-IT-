const express = require('express');
const path = require('path');
const axios = require('axios').default;
const _ = require('lodash');
const ejs = require('ejs')
const app = express();
const hbs = require('hbs');
const cookieParser = require('cookie-parser')

require("./src/db/conn");
const Register = require('./src/models/registers');
// console.log(Register);
// giving absolute path
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const staticPath = path.join(__dirname, "../public");

// express.static is a builtin middleware
app.use(express.static(staticPath));
app.set('views', path.join(__dirname, '../views'));
app.set("view engine", "hbs");

//Google Auth
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '450398354464-buu9un9pm3m8v4j7mfb5scpl8pk7m3pc.apps.googleusercontent.com';

const client = new OAuth2Client(CLIENT_ID);

const PORT = process.env.PORT || 5000;

//Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.get('/index', (req, res) => {
    res.render(path.join(__dirname, '/views/index'))
})

app.get("/register", (req, res) => {
    res.render(path.join(__dirname, '/views/register'));
});
app.post("/register", async (req, res) => {
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
            console.log(registerEmployee);

            const registered = await registerEmployee.save();
            
            console.log(registered);
            res.status(201).render(path.join(__dirname, '/views/login'));

        } else {
            res.send("Passwords are not matching")
        }
    } catch (error) {
        res.status(404).send(error)
    }
});
app.get('/login', (req, res) => {
    res.render(path.join(__dirname, '/views/login'))
})

app.post('/login', (req, res) => {
    let token = req.body.token;
    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload)
    }
    verify()
        .then(() => {
            res.cookie('session-token', token);
            res.send('success');
            res.render(path.join(__dirname, '/views/generate'));
        }).
        catch(console.error);
})
app.get("/generate", (req, res) => {
    axios.get("https://api.imgflip.com/get_memes")
        .then((memes) => {
            return res.render(path.join(__dirname, '/views/generate'), {
                memes: _.sampleSize(memes.data.data.memes, 100)
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
            const image_meme = response.data.data.url;
            //  console.log(image_meme);
            return res.send(`<img src=${image_meme}>
              <p> Successfully generated </p>
             `);
        }).catch((e) => {
            return res.status(403).send("403 Client Error")
        });
});

app.post("/memeCreated", (req, res) => {
    axios.post(
        "https://api.imgflip.com/caption_image",
        {},
        {
            params: {
                template_id: req.body.template_id,
                username: req.body.username,
                password: req.body.password,
                text0: req.body.text0,
                text1: req.body.text1,
            },
        }
    )
        .then((response) => {
            return res.send(`<img src=${response.data.data.url}>`);
        }).catch((e) => {
            return res.status(403).send("403 Client Error")
        });
});
app.get('/generate', (req, res) => {
    let user = req.user;
    res.render(path.join(__dirname, '/views/generate'), { user });
})
app.get('/protectedroute', checkAuthenticated, (req, res) => {
    res.send('This route is protected.');
})
app.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    let token = req.cookies['session-token'];
    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID, //Specify the CLIENT_ID of the app that access the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.redirect('/login')
        })
}

// app.listen(PORT, () => {
//     console.log('Server running on port ${PORT}');
// })  
app.listen(5000, () => {
    console.log("Listening.... to http://localhost:5000/index");
})