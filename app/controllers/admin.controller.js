const { parse } = require("dotenv");
const db = require("../models/models");
const { Packages, imageParams } = require("../utils/packages");


exports.adminDashboard = async (req, res) => {
  await db.getUserInfo((err, users, receipts, newletter, withResponse, btcRes, ethRes, dogeRes, cadRes, paymentHistoryRes) => {
    if (err) return res.render("admin", { err, error: req.flash("error") });
    else {
      // console.log(withResponse)
      res.render("admin", {
        result: users,
        receipts, btcRes, ethRes, dogeRes, cadRes,
        newletter, withResponse, paymentHistoryRes,
        error: req.flash("error"),
        emailDel: req.flash("error")
      })
    }
  })
}



exports.approveplan = async (req, res) => {
  let { receiptID, userID, packageplan } = req.params;
  let duration = parseInt(
    Packages[packageplan.split("$")[0]][
      packageplan.split("$")[1]
    ].Duration.split(" ")[0]
  );
  let deposit_date = new Date();
  let now = new Date();
  let due_Date_converter = now.setTime(
    now.getTime() + duration * 24 * 60 * 60 * 1000
  );
  let due_date = new Date(due_Date_converter);

  await db.planStatusUpdate(
    userID,
    receiptID,
    deposit_date,
    due_date,
    due_Date_converter,
    (err, result) => {
      if (err) return req.flash("error", "network error"), res.redirect("back");
      return req.flash("error", "Approved Successfuly"), res.redirect("back");
    }
  );
};

exports.approvedeposit = async (req, res) => {
  let { receiptID, userID, table } = req.params;

  await db.approvedeposit(
    table,
    userID,
    receiptID,
    (err, result) => {
      if (err) return req.flash("error", "network error"), res.redirect("back");
      return req.flash("error", "Approved Successfully"), res.redirect("back");
    }
  )

}

exports.removeUser = async (req, res) => {
  let { id } = req.params;
  await db.deleteUser(parseInt(id), (err, output) => {
    if (err) return req.flash("error", "network error"), res.redirect("back");
    return (
      req.flash("error", "User Successfully Deleted"), res.redirect("back")
    );
  });
};


exports.removemsg = async (req, res) => {
  let { id } = req.params;
  await db.removemsg(parseInt(id), (err, output) => {
    if (err) return req.flash("error", "network error"), res.redirect("back");
    return (
      req.flash("error", "Email Successfully Deleted"), res.redirect("back")
    );
  });
};

exports.approvedUserWithdrawal = async (req, res) => {
  let { withdrawalID, email, userID, crypto, amount, product_id } = req.params;
  let deposit_date = new Date();
await db.checkIfAlreadyApproved(userID,product_id, async(err, result)=>{
  if (err) return req.flash("error", "network error"), res.redirect("back");
  if(result && result.length > 0){
    req.flash("error", "already verified");
    res.redirect("back")
  }
  else{
    await db.createPaymentHistoryLog(deposit_date, userID, product_id, amount, crypto, "paid", async (err, result) => {
      if (err) return req.flash("error", "network error"), res.redirect("back");
      await db.updateUserWithdrawal(parseFloat(withdrawalID), parseFloat(userID), async (err, result) => {
        if (err) return req.flash("error", "network error"), res.redirect("back");
        await db.deleteMiningReceipts(product_id, async (err, result) => {
          if (err) return req.flash("error", "network error"), res.redirect("back");
          req.flash("error", "withdrawal is approved");
          res.redirect("back");
        })
      })
  
    })
  
  }
})

};

// exports.updatePaymentHistory = async(req,res) = >{
// }

exports.deletePlans = async (req, res) => {
  let { planID, userID } = req.params;
  // console.log("PLAN ID AND USER ID", planID, userID);
  await db.deletePlan(parseInt(planID), parseInt(userID), (err, output) => {
    if (err) return req.flash("error", "network error"), res.redirect("back");
    return req.flash("error", "Successfully Deleted"), res.redirect("back");
  });
};

exports.topup = (req, res) => {
  // let { name, mimetype, mv } = req.files.receipt;
  // let { packages, user_id } = req.body;
  // let imagePath = "receiptImg/" + name;
  // let userDataInput;

  let { amt, user_id } = req.body;


  db.updateBonus(amt, parseInt(user_id), (err, result) => {
    err
      ? (req.flash("error", "network error"), res.redirect("back"))
      : (req.flash("error", "Users Account Top Up Successfully"),
        res.redirect("back"));
  })

  // imageParams.includes(mimetype)
  //   ? (mv("public/receiptImg/" + name),
  //     db.userReceipts(imagePath, "pending", packages, parseInt(user_id), (err, result) => {
  //       err
  //         ? (req.flash("error", "network error"), res.redirect("back"))
  //         : (req.flash(
  //             "error",
  //             "Users Account Top Up Successfully"
  //           ),
  //           res.redirect("back"));
  //     }))
  //   : (req.flash("error", "kindly select valid image format"),
  //     res.redirect("back"));
};


exports.logout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
};