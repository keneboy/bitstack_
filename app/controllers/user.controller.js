const db = require("../models/models");
const bcrypt = require("bcryptjs");
const { Register } = require("../utils/registerValidate");
const { Packages, imageParams } = require("../utils/packages");
const { packagesPlans, validateWithdrawalRequest } = require("../utils/runningPlans");
const { data } = require("../models/models");
const saltRounds = 10;

exports.RegisterUser = async (req, res) => {
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds);

  let userInfo = {
    email: req.body.email,
    fullname: req.body.fullname,
    phone: req.body.phone,
    password: encryptedPassword,
    repeat_password: encryptedPassword,
  };

  req.body.fullname.split(" ").join("");
  let { error } = Register(req.body);
  if (error) {
    req.flash("error", error.details[0]["message"]);
    res.redirect("back");
  } else {
    await db.emailValidate(userInfo.email, async (err, result) => {
      if (err) {
        req.flash("error", "Network Error");
        res.redirect("back");
      } else if (!Object.entries(result).length == 0) {
        req.flash("error", "Email Already Exist");
        res.redirect("back");
      } else {
        await db.insertUsers(userInfo, (err, result) => {
          if (err) {
            console.log(err);
            req.flash("error", "Network Error");
            res.redirect("back");
          } else {
            req.flash("success", "You can now login");
            res.redirect("/login");
          }
        });
      }
    }); 
  }
};

exports.dashboard = async (req, res) => {
  let pending = [];
  let running = [];
  const { user_id } = req.user;
  // console.log("sssssssssssssssssss, THIS IS THE USER ID", user_id)
  let referalID = user_id+'rID'+user_id

  await db.userPackage(user_id, async (err, result) => {
    // console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwww", result)
    if (err) {
      req.flash("error", "network error");
      res.redirect("back");
    } else {
      await data(req.user.user_id, (err, userDataInput) => {
        if (err) {
          req.flash("error", "network error");
          res.redirect("back");
        } else {
          let { runningCounter, pendingCounter, completedCounter, runningTotalAmt} = packagesPlans(result);
          res.render("dashboard", {
            error: req.flash("error"),
            referalID,
            runningCounter,
            pendingCounter, completedCounter, 
            userDataInput, runningTotalAmt
          });
        }
      });
    }
  });
};

exports.mining = async (req, res) => {
  let userDataInput;

  res.render("mining", { error: req.flash("error"), userDataInput });
};

exports.MiningPlans = (req, res) => {
  let img = ""
  let address = ""
  let userDataInput;
  let miningCoin = req.params.id.split("$")[0];
  let miningPackage = req.params.id.split("$")[1];
  miningCoin == "btc" ? (address ="1CjmscjQ3bwrJ3N2JvpyyTQ7dpgHnz6nUD", img = "/images/btc.jpeg") : (address = "0x38eD20fe105750EBc2a0bb8a9366f9C540857a25", img = "/images/eth.jpeg")
  Packages[miningCoin] === undefined
    ? res.redirect("back")
    : Packages[miningCoin][miningPackage] === undefined
    ? res.redirect("back")
    : res.render("payment", { 
        data: Packages[miningCoin][miningPackage],
        miningCoin,
        miningPackage,
        error: req.flash("error"),
        userDataInput,
        address, 
        img
      });
};

exports.MiningReceipts = (req, res) => {
  let { name, mimetype, mv } = req.files.receipt;
  let { package } = req.body;
  let { user_id } = req.user;
  let imagePath = "receiptImg/" + name;
  let userDataInput;
 
  imageParams.includes(mimetype)
    ? (mv("public/receiptImg/" + name),
      db.userReceipts(imagePath, "pending", package, user_id, (err, result) => {
        err
          ? (req.flash("error", "network error"), res.redirect("back"))
          : (req.flash(
              "error",
              "Your transaction is under review and will be updated within 24 hrs"
            ),
            res.redirect("/runningPlans"));
      }))
    : (req.flash("error", "kindly select valid image format"),
      res.redirect("back"));
};

exports.runningPlans = async (req, res) => {
  let userDataInput;
  await db.userPackage(req.user.user_id, (err, result) => {
    if (err) {
      req.flash("error", "network error");
      res.redirect("back");
    } else {
      let { running, pending } = packagesPlans(result);
      res.render("tables", { error: req.flash("error"), running, pending, userDataInput });
    }
  });
};

exports.withdrawal = async (req, res) => {
  await db.userPackage(req.user.user_id, (err, result) => {
    if (err) {
      req.flash("error", "network error");
      res.redirect("back");
    } else {

      let { running } = packagesPlans(result);
      let {outPut}  = validateWithdrawalRequest(running);
      
      res.render("withdrawal", {outPut, error: req.flash("error")})
    }
  });
};

exports.withdrawalRequest= async(req, res)=>{
  // console.log(req.body)
  let { wallet } = req.body
  await db.withdrawalRequest(wallet, req.user.user_id, (err, result) => {
    if (err) {
      req.flash("error", "network error");
      res.redirect("back");
    } else {
      req.flash("error", "Your request has been receive, it will be processed within 24hrs")
      res.redirect("back")
    }
  });
}

exports.DeletePlan = (req, res) => {
  const { id } = req.params;
  db.deletePlan(id, req.user.user_id, (err, output) => {
    err
      ? (req.flash("error", "network error"), res.redirect("back"))
      : (req.flash("error", "Plan Deleted Successfully"), res.redirect("back"));
  });
};

exports.setting = (req, res) => {
  res.render("setting", {error: req.flash("error"), success: req.flash("success")})
};

exports.changePassword= async(req, res)=>{
  let {user_id} = req.user;
  let {email, password, newPassword} = req.body;

  const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);
   await db.emailPasswordValidate(email, user_id, async (err, result)=>{
     if(err) return (req.flash("error", "Incorrect details"), res.redirect("back"))
     else{
       if(result.length > 0){
        const hash = result[0].password.toString();
        bcrypt.compare(password, hash, async function (err, response) {
            if (response === true) {
               await db.updatePassword(encryptedPassword, user_id, (err, outcome)=>{
                 err ? (req.flash("error", "Network Error"), res.redirect("back")) : (req.flash("success", "Password changed successfuly"), res.redirect("back"))
               })
            }
            else { return (req.flash("error", "Incorrect Password" ), res.redirect("back")) }
        })
       }else return (req.flash("error", "Incorrect Email"), res.redirect("back"))
     }
   })
}



exports.contactSubmit= async(req, res)=>{
  await db.contact(req.body, (err, result)=>{
    // console.log(req.body)
    err ? (req.flash("error", "Network Error"), res.redirect("back")) : (req.flash("error", "Message sent successfuly"), res.redirect("back"));  

  })

}

exports.logout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
};
