const nodemailer = require("nodemailer");
const sql = require("../models/models");
let count = Math.round(Math.random() * 100000);

// FOR SENDING RECEIPTS TO CLIENTS ON SUCESSFUL PAYMENT
var today = new Date();
var date =
    +today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();


exports.sendOtp = async (email, otp, result) => {
    let message =
        `<center>` +
        `<img src="https://bitstackx.com/images/Favicon_new.PNG" height="100px" style="margin-bottom: -35px; height:100px; width:100px;" />` +
        `<div style="border-top-color: #26a69a; width: 100%; margin: 20; padding: 10; border-width: thick; border-style: outset;">` +
        `<h1 style="font-family:Arial, Helvetica, sans-serif ;">` +
        " Verification needed" +
        `</h1>` +
        `<div style="text-align: left; padding: 20px;">` +
        `<p>` +
        `<b>` +
        "Please confirm your reset password code request" +
        `</b>` +
        `</p>` +
        ` <p>` +
        "We have detected an account password request from a device about your bitstackx account." +
        ` </p>` +
        `<p>` +
        "To update your account safely, please use the following code to enable you reset your password:" +
        `</p>` +
        `</div>` +
        `<div style="background-color: #f2f2f2; height: 40px; text-align: center;">` +
        `<p style="padding: 10px;">` +
        otp +
        `</p>` +
        `</div>` +
        `<div style="text-align: left; padding: 20px;">` +
        `<h3>` +
        "That wasn't me ?" +
        `</h3>` +
        "If the above sign-in attempt wasn't you, please quickly login to your bitstackx account and change your password." +
        `</div>` +
        `</div>` +
        `</center>`;

    var mailOption = {
        from: `no-reply@bitstackx.com`,
        to: `${email}`,
        subject: `RESET PASSWORD OTP CODE`,
        html: message,
        // attachments: [
        //     {
        //         filename: `invoice${id}.pdf`,
        //         contentType: `application/pdf`,
        //         encoding: `base64`,
        //         content: fs.createReadStream(pathToFile),
        //         path: `${pathToFile}`,

        //     }
        // ]
    };
    var transporter = nodemailer.createTransport({
        host: `bitstackx.com`,
        port: 465,
        secure: true,
        auth: {
            user: `no-reply@bitstackx.com`,
            pass: `Tampico123#`,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    transporter.sendMail(mailOption, (error, info) => {
        if (!error) {
            // console.log(error)
            console.log("otp code  receiptssssss. SENT");
            return result(null, info);
        } else {
            console.log("Error occured while sending otp code");
            return result(error, null);
        }
    });
};
