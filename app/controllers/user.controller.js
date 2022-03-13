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

// exports.dashboard = async (req, res) => {
//   let pending = [];
//   let running = [];
//   const { user_id } = req.user;
//   let bitcoinImg = "/images/btc.jpeg";
//   let bitcoinAdrr = "1CjmscjQ3bwrJ3N2JvpyyTQ7dpgHnz6nUD";
//   let ethImg = "/images/eth.jpeg";
//   let cadImg = "/images/carda_qr.JPG";
//   let ethAdrr = "0x38eD20fe105750EBc2a0bb8a9366f9C540857a25";
//   let dogeAdrr = "D7zHaxFRUWUsBx37V77nht8UdgGNK2a7Md"
//   let cadAdrr ="addr1q9zgsdh48f2xekshs58xqxc3fwfruypf0wwt3yxnuwvux0zy3qm02wj5dndp0pgwvqd3zjuj8cgzj7uuhzgd8cuecv7qkv6kla"
//   let dogeImg;

//   let referalID = "sfh43Q"+user_id+"dsAQ"

//   await db.userPackage(user_id, async (err, result) => {
//     if (err) {
//       req.flash("error", "network error");
//       res.redirect("back");

//     } else {
//       await data(req.user.user_id, async (err, userDataInput, btcRes, ethRes, dogeRes, cadRes) => {
//         // console.log(cadRes)
//         if (err) { 
//          req.flash("error", "network error");
//           res.redirect("back");
//         } else {
//           let { runningCounter, pendingCounter, completedCounter, runningTotalAmt} = await packagesPlans(result);
//          await db.checkCompletedTaskFromHistory(req.user.user_id, async(err, completedTask)=>{
//             if(err) {
//               return ( req.flash("error", "network error"), res.redirect("back"))
//             };
//             res.render("dashboard", {
//               error: req.flash("error"),
//               referalID,
//               runningCounter,
//               pendingCounter, completedCounter, 
//               userDataInput, runningTotalAmt, 
//               bitcoinImg, bitcoinAdrr, ethImg,
//               ethAdrr, btcRes, ethRes, dogeRes, cadRes, dogeAdrr, cadAdrr,cadImg,
//               completedTask:completedTask.length
//             });
            
//           })     
        
          
//         }
//       });
//     }
//   });
// };


exports.dashboard = async (req, res) => {
  let pending = [];
  let running = [];
  const { user_id } = req.user;
  let bitcoinImg = "/images/btc.jpeg";
  let bitcoinAdrr = "1CjmscjQ3bwrJ3N2JvpyyTQ7dpgHnz6nUD";
  let ethImg = "/images/eth.jpeg";
  let ethAdrr = "0x38eD20fe105750EBc2a0bb8a9366f9C540857a25";
  let dogeAdrr = "D7zHaxFRUWUsBx37V77nht8UdgGNK2a7Md"
  let dogeImg;
  let cadImg = "/images/carda_qr.JPG";
  let cadAdrr ="addr1q9zgsdh48f2xekshs58xqxc3fwfruypf0wwt3yxnuwvux0zy3qm02wj5dndp0pgwvqd3zjuj8cgzj7uuhzgd8cuecv7qkv6kla"

  let referalID = "sfh43Q"+user_id+"dsAQ"

  await db.userPackage(user_id, async (err, result) => {
    if (err) {
      req.flash("error", "network error");
      res.redirect("back");
    } else {
      await data(req.user.user_id, async (err, userDataInput, btcRes, ethRes, dogeRes, cadRes) => {
        
        if (err) {
          req.flash("error", "network error");
          res.redirect("back");
        } else {
          // let { runningCounter, pendingCounter, completedCounter, runningTotalAmt} = await packagesPlans(result);


          // res.render("dashboard", {
          //   error: req.flash("error"),
          //   referalID,
          //   runningCounter,
          //   pendingCounter, completedCounter, 
          //   userDataInput, runningTotalAmt, 
          //   bitcoinImg, bitcoinAdrr, ethImg,
          //   ethAdrr, btcRes, ethRes, dogeRes, dogeAdrr,cadAdrr,cadImg,cadRes
          // });
          await db.checkCompletedTaskFromHistory(req.user.user_id, async(err, completedTask)=>{
            if(err) return (req.flash("error", "network error"), res.redirect("back"))
            else{
               let { runningCounter, pendingCounter, completedCounter, runningTotalAmt} = await packagesPlans(result);
              res.render("dashboard", {
            error: req.flash("error"),
            referalID,
            runningCounter,
            pendingCounter, completedCounter, 
            userDataInput, runningTotalAmt, 
            bitcoinImg, bitcoinAdrr, ethImg,
            ethAdrr, btcRes, ethRes, dogeRes, dogeAdrr,cadAdrr,cadImg,cadRes,completedTask:completedTask.length
          });
            }
          })
        }
      });
    }
  });
};




















exports.history = async (req, res) => {
  let pending = [];
  let running = [];
  const { user_id } = req.user;
  let bitcoinImg = "/images/btc.jpeg";
  let bitcoinAdrr = "1CjmscjQ3bwrJ3N2JvpyyTQ7dpgHnz6nUD";
  let ethImg = "/images/eth.jpeg";
  let ethAdrr = "0x38eD20fe105750EBc2a0bb8a9366f9C540857a25";
  let dogeAdrr = "D7zHaxFRUWUsBx37V77nht8UdgGNK2a7Md"
  let cadAdrr ="addr1q9zgsdh48f2xekshs58xqxc3fwfruypf0wwt3yxnuwvux0zy3qm02wj5dndp0pgwvqd3zjuj8cgzj7uuhzgd8cuecv7qkv6kla"
  let dogeImg;

  let referalID = "sfh43Q"+user_id+"dsAQ"

  await db.userPackage(user_id, async (err, result) => {
    if (err) {
      req.flash("error", "network error");
      res.redirect("back");
    } else {
      await data(req.user.user_id, async (err, userDataInput, btcRes, ethRes, dogeRes, cadRes,paymentHistoryRes) => {
        
        if (err) {
          req.flash("error", "network error");
          res.redirect("back");
        } else {

          let { runningCounter, pendingCounter, completedCounter, runningTotalAmt} = await packagesPlans(result);

          res.render("history", {
            error: req.flash("error"),
            referalID,
            runningCounter,
            pendingCounter, completedCounter, 
            userDataInput, runningTotalAmt, 
            bitcoinImg, bitcoinAdrr,
            ethImg, ethAdrr, btcRes,
            ethRes, dogeRes, cadRes, dogeAdrr, cadAdrr,paymentHistoryRes
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
// added by Samuel Ekene
exports.invest = async (req, res) => {
  let userDataInput;

  res.render("invest", { error: req.flash("error"), success:req.flash("success"), userDataInput });
};


// invest into the respective platform...
exports.investPlan = async(req,res) => {
  let { user_id } = req.user;
  let miningCoin = req.params.id.split(/[$&]/ig)[0]
  let miningPackage = req.params.id.split(/[$&]/ig)[1]
  let miningvalue = req.params.id.split(/[$&]/ig)[2]
  // check if the user exist and have data...
  await db.existingUser(user_id, async (err, result)=>{
    if(err) console.log(err);
    else{
      for(var items of result ) {
        
        // check if the balance is less than the required balance
        let balance = miningvalue > items[`${miningCoin}acc`];
        if(balance){
          req.flash("error", "insufficient balance please top up");
          res.redirect("back")

        }
        else{
          let remainder =  items[`${miningCoin}acc`] - miningvalue;
          let deposit_date = new Date();
          let now = new Date();
          let due_Date_converter = now.setTime(
            now.getTime() + 30 * 24 * 60 * 60 * 1000
          );
          // 30 * 24 * 60 * 60 * 1000
          let due_date = new Date(due_Date_converter);

          await db.updateMiningUsers(user_id, `${miningCoin}acc`, remainder, async (err, result)=>{
            if(err) {
              console.log('the code is getting here.....3444')
              console.log("err---------second", err)
              console.log('the code is getting here.....34346g44')
            }
            
            else{
              let proInv = `${miningCoin}$${miningPackage}`  
              await db.userUpdatedReceipts("null","Active", proInv, deposit_date, due_date, due_Date_converter,null,null, user_id, async (err, result)=>{
                console.log('the code is getting here.....1')
                if(err){
                  console.log('the code is getting here.....1')
                  req.flash("error", "error inserting receipts");
                  res.redirect("back")
                }
                req.flash("error", "plan successfully added");
                res.redirect("back")
              } )
            }

          })
        }
      }
    }
   
  })
}




exports.MiningPlans = (req, res) => {
  let img = ""
  let address = ""
  let userDataInput;
  let miningCoin = req.params.id.split("$")[0];
  let miningPackage = req.params.id.split("$")[1];
  miningCoin == "btc" ? (address ="1CjmscjQ3bwrJ3N2JvpyyTQ7dpgHnz6nUD", img = "/images/btc.jpeg")
  : miningCoin == "eth" ? (address = "0x38eD20fe105750EBc2a0bb8a9366f9C540857a25", img = "/images/eth.jpeg")
  : miningCoin == "cad" ? (address = "addr1q9zgsdh48f2xekshs58xqxc3fwfruypf0wwt3yxnuwvux0zy3qm02wj5dndp0pgwvqd3zjuj8cgzj7uuhzgd8cuecv7qkv6kla", img = "/images/carda_qr.JPG")
  : (address = "D7zHaxFRUWUsBx37V77nht8UdgGNK2a7Md", img = "/images/eth.jpeg")
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

exports.accountdeposit = async (req, res) => {
  let { user_id } = req.user;
  let { amt, account } = req.body;
  let { name, mimetype, mv } = req.files.receipt;
  let imagePath = "receiptImg/" + name;
  let todayDate = new Date();

  imageParams.includes(mimetype)
    ? (mv("public/receiptImg/" + name),
      db.coinAccount(account, imagePath, "pending", amt, todayDate, user_id, (err, result) => {
        err
          ? (req.flash("error", "network error"), res.redirect("back"))
          : (req.flash("error", "Your deposit is under review, check back within 24 hrs"),
            res.redirect("back"));
      }))
    : (req.flash("error", "kindly select valid image format"),
      res.redirect("back"));
};


exports.runningPlans = async (req, res) => {
  let userDataInput;
  await db.userPackage(req.user.user_id, async (err, result) => {
    if (err) {
      req.flash("error", "network error");
      res.redirect("back");
    } else {
      let { running, pending } = await packagesPlans(result);
      // console.log(running)
      // console.log(pending)
      res.render("tables", { error: req.flash("error"), running, pending, userDataInput });
    }
  });
};

exports.withdrawal = async (req, res) => {
  await db.userPackage(req.user.user_id, async (err, result) => {
    if (err) {
      req.flash("error", "network error");
      res.redirect("back");
    } else {

      let { running } = await packagesPlans(result);
      let {outPut}  = await validateWithdrawalRequest(running);
      res.render("withdrawal", {outPut, error: req.flash("error")})
    }
  });
};



exports.withdrawalRequest= async(req, res)=>{
  let deposit_date = new Date();
  let { user_id } = req.user;
  let { wallet } = req.body;
  let {amount, coin, product_id } = req.params;
await db.checkExistingReceipt(user_id, product_id, async(err,result)=>{
  if(err) return (req.flash("error", "Network error"), res.redirect("back"));
  if(result && result?.length > 0 ) return (req.flash("error", "this plan is already  withdrawn or currently mining"), res.redirect("back"));
  else{
    await db.checkExistingWithdrawal(user_id, product_id, async(err, result)=>{
      if(err) if(err) return (req.flash("error", "Network error"), res.redirect("back"));
      if(result && result?.length > 0 ) return (req.flash("error", "Already initiated withdrawals"), res.redirect("back"));
      else{
        await db.withdrawalRequest(wallet, amount, user_id, "pending", coin, product_id, async(err, result) => {
          if (err) {
            req.flash("error", "network error");
            res.redirect("back");
          } else {
          await db.createPaymentHistoryLog(deposit_date, user_id, product_id, amount, coin, "pending", async(err, result)=>{
            if(err) return ( req.flash("error", "network error"), res.redirect("back"))
            req.flash("error", "Your request has been receive, it will be processed within 24hrs")
            res.redirect("back")
          })    
          }
        });
      }
    })

  }
})

}



exports.reInvestRequest = async(req,res)=>{
  let { user_id } = req.user;
  
  let now = new Date();
  let due_Date_converter = now.setTime(
    now.getTime() + 30 * 24 * 60 * 60 * 1000
  );
  // 30 * 24 * 60 * 60 * 1000
  let due_date = new Date(due_Date_converter);
  let deposit_date = new Date();
  let {packageDetails}= req.body;
  let stringPackage  = packageDetails.split("-")
  let miningCoin = stringPackage[0].trim()
  let miningPackage = stringPackage[1].trim()
  // let miningValue = parseInt(stringPackage[2].trim())
  // let miningDuration = stringPackage[3];
  await db.userUpdatedReceipts("null","Active", `${miningCoin}$${miningPackage}`, deposit_date, due_date, due_Date_converter, user_id, async (err, result)=>{
    if(err)console.log("error inserting receipts", err)
    req.flash("error", "plan successfully added");
    res.redirect("back")
  } )
}
exports.investPackage = async(req,res)=>{
  let { user_id } = req.user;
  const {product_id, package, compoundProfit} = req.params;
  console.log(product_id, package,compoundProfit)
  
  
  let now = new Date();
  let due_Date_converter = now.setTime(
    now.getTime() + 30 * 24 * 60 * 60 * 1000
  );
  let due_date = new Date(due_Date_converter);
  let deposit_date = new Date();
  // let {packageDetails}= req.body;
  let stringPackage  =  package.split("$")
  let miningCoin = stringPackage[0].trim().toLowerCase();
  let miningPackage = stringPackage[1].trim()

await db.checkExistingReceipt( parseFloat(user_id), parseFloat(product_id), async(err, result)=>{
  if(err) return (req.flash("error", "Network error"), res.redirect("back"));
  if(result && result?.length > 0 ) return (req.flash("error", "plan already added"), res.redirect("back")),console.log(result)
  
  else{
    await db.checkExistingWithdrawal(user_id, product_id, async(err, result)=>{
      if(err) return (req.flash("error", "Network error"), res.redirect("back"));
      if(result && result?.length > 0 ) return (req.flash("error", "Already withdrawn "), res.redirect("back"));
      else{
        await db.userUpdatedReceipts("null","Active", `${miningCoin}$${miningPackage}`, deposit_date, due_date, due_Date_converter, parseFloat(product_id), parseFloat(compoundProfit), user_id, async (err, result)=>{
          if(err) return (req.flash("error", "Network error"), res.redirect("back"));
          else{
            req.flash("error", "plan successfully added to the mining session");
            res.redirect("back")
          }
         
        } )
      }
    })

  }
  
})
  // let miningValue = parseInt(stringPackage[2].trim())
  // let miningDuration = stringPackage[3];

  // req.flash("error", "plan successfully added");
  // res.redirect("back")
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
