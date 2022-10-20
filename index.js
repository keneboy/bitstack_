const express = require("express");
const app = express();
const dotenv = require("dotenv");
const request = require("request");
// environment configuration
dotenv.config();


// body parser configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.post("/subscribe", (req, res) => {
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
        console.log(body);
        // if not successful
        if (body.success !== undefined && !body.success) {
            return res.json({ success: false, msg: "failed captcha verification" })
        }
        // if successfull
        return res.json({ success: true, msg: "captcha passed" })
    })
})
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`connecting at ${port}`))