const express = require('express');
const path = require('path')
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("passport")
const MySQLStore = require("express-mysql-session")(session);
const request = require("request");
const options = { host: "localhost", user: "root", database: 'hood', password: '' }
// var options = { host: 'us-cdbr-east-02.cleardb.com', user: 'bb8ef33c9ae33e', database: 'heroku_b311741948eae95', password: 'c568b81f' } // production database

const sessionStore = new MySQLStore(options);
const fileupload = require("express-fileupload");
const app = express();
require("dotenv").config();
app.use(fileupload({ createParentPath: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.use(flash());
app.use(session({ secret: "fgnodsfighosfighoghvu", store: sessionStore, resave: false, saveUninitialized: false }))
app.use(passport.initialize());
app.use(passport.session());
app.post("/subscribe", (req, res) => {
    console.log(req.body);
    if (req.body.captcha === undefined || req.body.captcha === null || req.body.captcha === "") {
        return res.json({ success: false, msg: "please select captcha" })

    }

    // secret key
    const secretKey = "6LcjqYUiAAAAAG-CiUkMQeduVBSndcpD20Pv7aT9"
    // verifyUrl
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.socket.remoteAddress}`
    // make request to verifyUrl
    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);
        console.log('>>>>>.', body);
        // if not successful
        if (body.success !== undefined && !body.success) {
            return res.json({ success: false, msg: "failed captcha verification" })
        }
        // if successfull
        return res.render('login', {capture: false, success: true, error: false})
    })
})
require("./app/routers/routers")(app);
require('./app/models/db.config');
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => { console.log('server started successfully') });


