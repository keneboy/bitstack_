const sql = require("./db.config");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

exports.emailValidate = (email, result) => {
  sql.query(`SELECT * FROM miningusers WHERE email = ?`, [email], (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  });
};

exports.emailPasswordValidate = (email, userId, result) => {
  sql.query(`SELECT * FROM miningusers WHERE email = ? AND id=?`, [email, userId], (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  });
};
exports.existingUser = (userId, result) => {
  sql.query(`SELECT * FROM miningusers WHERE  id=?`, [userId], (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  });
};

// update the miningusers.......
exports.updateOtp = (otp, email, result) => {
  sql.query(`UPDATE miningusers SET username=? WHERE email=?`, [otp, email], (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  })
}


exports.forgetPassword = (email, result) => {
  sql.query(`SELECT email FROM miningusers WHERE email=?`, [email], (err, output) => {
    console.log(output)
    if (err) return result(err, null);
    return result(null, output);
  })
}

exports.checkVerification = (email, otp, result) => {
  sql.query(`SELECT username FROM miningusers WHERE email=? AND username=?`, [email, otp], (err, output) => {
    console.log("otp..", output)
    if (err) return result(err, null);
    return result(null, output);
  })
}

exports.confirmpasswordVerification = (email, password, repeat_password, result) => {
  sql.query(`UPDATE miningusers SET password=?, repeat_password=? WHERE email=?`, [password, repeat_password, email], (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  })
}



exports.updateMiningUsers = (userId, column, value, result) => {
  sql.query(`UPDATE miningusers SET ${column} = ${value} WHERE id=${userId}`, (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  })
}

exports.insertUsers = (userObj, result) => {
  sql.query(`INSERT INTO miningusers SET ?`, [userObj], (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  });
};


exports.userReceipts = (receiptImg, status, package, user_id, result) => {
  sql.query(
    `INSERT INTO receipts(receiptImg, status, package, user_id) VALUES(?,?,?,?)`,
    [receiptImg, status, package, user_id],
    async (err, output) => {
      if (err) return result(err, null);
      return result(null, output);
    }
  );
};
exports.checkExistingReceipt = (user_id, product_id, result) => {
  sql.query(`SELECT * FROM receipts WHERE product_id=? AND user_id=? `, [product_id, user_id], async (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  })
}
exports.checkExistingWithdrawal = (user_id, product_id, result) => {
  sql.query(`SELECT * FROM withdrawal WHERE product_id=? AND user_id=? `, [product_id, user_id], async (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  })
}
exports.checkIfAlreadyApproved = (user_id, product_id, result) => {
  sql.query(`SELECT * FROM paymenthistory  WHERE user_id=? AND product_id=? AND status=?`, [user_id, product_id, "paid"], async (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  })
}
// handle inserting into the paymenthistory  table...
exports.createPaymentHistoryLog = (approvedDate, user_id, product_id, amount, crypto, status, result) => {
  sql.query(`INSERT INTO paymenthistory (approvedDate,	user_id, product_id,	amount,	crypto, status	) VALUES(?,?,?,?,?,?)`, [approvedDate, user_id, product_id, amount, crypto, status], async (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  });
};

exports.userUpdatedReceipts = (receiptImg, status, package, depositdate, due_date, due_Date_converter, product_id, compoundProfit, user_id, result) => {
  sql.query(
    `INSERT INTO receipts(receiptImg, status, package, depositdate, duedate, countDownDate,  product_id, accumulatedBalance,  user_id) VALUES(?,?,?,?,?,?,?,?,?)`,
    [receiptImg, status, package, depositdate, due_date, due_Date_converter, product_id, compoundProfit, user_id],
    async (err, output) => {
      if (err) { return result(err, null) }
      return result(null, output);
    }
  );
};

exports.coinAccount = (table, receiptImg, status, amt, date, user_id, result) => {
  sql.query(
    `INSERT INTO ${table}(receiptImg, status, amt, depositdate, user_id) VALUES(?,?,?,?,?)`,
    [receiptImg, status, amt, date, user_id],
    async (err, output) => {
      if (err) return console.log(err), result(err, null);
      return result(null, output);
    }
  );
};


exports.withdrawalRequest = (wallet, amount, user_id, status, crypto, product_id, result,) => {
  sql.query(
    `INSERT INTO withdrawal(wallet, amount, user_id, status, crypto, product_id) VALUES(?,?,?,?,?,?)`,
    [wallet, amount, user_id, status, crypto, product_id],
    async (err, output) => {
      if (err) return result(err, null);
      return result(null, output);
    }
  );
};

exports.userPackage = (userID, result) => {
  sql.query(
    `SELECT * FROM receipts WHERE user_id=?`,
    [userID],
    (err, output) => {
      if (err) return result(err, null);
      return result(null, output);
    }
  );
};

exports.checkAdmin = (adminObj, result) => {
  sql.query(
    `SELECT * FROM miningadmin WHERE email = ?`,
    [adminObj.email],
    async (err, output) => {
      if (err) return console.log(err), result(err, null);
      return result(null, output);
    }
  );
};
exports.deleteMiningReceipts = async (product_id, result) => {
  sql.query(`DELETE FROM receipts WHERE id = ?`, [product_id], (err, output) => {
    if (err) return result(err, null)
    return result(null, output)
  })
}

exports.getUserInfo = async (result) => {
  await sql.query(`SELECT * FROM miningusers`, async (err, output) => {
    if (err) return result(err, null);
    else {
      await sql.query(`SELECT * FROM receipts`, async (receiptErr, receiptResult) => {
        if (receiptErr) return result(err, output, null);
        else {
          await sql.query(`SELECT * FROM contact`, async (emailErr, newletter) => {
            if (emailErr) return result(err, output, receiptResult, null);
            else {
              await sql.query(`SELECT wallet, fullname, email, phone, amount, crypto, status, user_id, product_id, withdrawal.id as withId FROM withdrawal LEFT JOIN miningusers ON(miningusers.id = withdrawal.user_id)`, async (withErr, withResponse) => {
                if (withErr) return result(err, output, receiptResult, newletter, null);
                else {
                  await sql.query(`SELECT * FROM btcacc`, async (btcErr, btcRes) => {
                    if (btcErr) return result(null, output, receiptResult, newletter, withResponse)
                    else {
                      await sql.query(`SELECT * FROM ethacc`, async (ethErr, ethRes) => {
                        if (ethErr) return result(null, output, receiptResult, newletter, withResponse, btcRes)
                        else {
                          await sql.query(`SELECT * FROM dogeacc`, async (dogeErr, dogeRes) => {
                            if (dogeErr) return result(null, output, receiptResult, newletter, withResponse, btcRes, ethRes)
                            else {
                              await sql.query(`SELECT * FROM cadacc`, async (cadErr, cadRes) => {
                                if (cadErr) return result(null, output, receiptResult, newletter, withResponse, btcRes, ethRes, dogeRes)
                                else {
                                  await sql.query(`SELECT * FROM trxacc`, async (trxErr, trxRes) => {
                                    if (trxErr) return result(null, output, receiptResult, newletter, withResponse, btcRes, ethRes, dogeRes, cadRes);
                                    else {
                                      await sql.query(`SELECT * FROM usdtacc`, async (usdtErr, usdtRes) => {
                                        if (usdtErr) return result(null, output, receiptResult, newletter, withResponse, btcRes, ethRes, dogeRes, cadRes, trxRes);
                                        else {
                                          await sql.query('SELECT * FROM paymenthistory  ', async (paymentHistoryErr, paymentHistoryRes) => {
                                            if (paymentHistoryErr) return result(null, output, receiptResult, newletter, withResponse, btcRes, ethRes, dogeRes, cadRes, trxRes, usdtRes);
                                            return result(null, output, receiptResult, newletter, withResponse, btcRes, ethRes, dogeRes, cadRes, trxRes, usdtRes, paymentHistoryRes)
                                          })
                                        }
                                      })
                                    }
                                  })


                                }
                              })

                            }
                          })
                        }
                      })
                    }
                  })

                }
              });
            }
          });
        }
      });
    }
  });
};



exports.planStatusUpdate = async (
  userID,
  receiptID,
  depositedate,
  duedate,
  countDownDate,
  result
) => {
  sql.query(
    `UPDATE receipts SET status=?, depositdate=?, duedate=?, countDownDate=? WHERE user_id=? AND id=?`,
    ["Active", depositedate, duedate, countDownDate, userID, receiptID],
    (err, output) => {
      if (err) return console.log(err), result(err, null);
      return result(null, output);
    }
  );
};
exports.updateUserWithdrawal = async (
  withID,
  userID,
  result
) => {
  sql.query(
    `UPDATE withdrawal SET status=? WHERE user_id=? AND id=?`,
    ["paid", userID, withID],
    (err, output) => {
      if (err) return console.log(err), result(err, null);
      return result(null, output);
    }
  );
};

// exports.approvedeposit = async (
//   table,
//   userID,
//   receiptID,
//   result
// ) => {

//   await sql.query(
//     `UPDATE ${table} SET status=? WHERE user_id=? AND id=?`,
//     ["Active", userID, receiptID], async(err, output) => {
//       if (err) return console.log(err), result(err, null)
//       else{
//         sql.query(`SELECT SUM(amt) as balance FROM ${table} WHERE user_id=?`, [userID], async(err, res)=>{
//           if(err) return result(err, null)
//           else{

//             var balance;
//             for(var bal of res) balance = bal.balance;
//             await sql.query(`UPDATE miningusers SET ${table}=${balance} WHERE id=${userID}`, async(tabErr, tabRes)=>{
//               if(err) return result(err, null) 
//               return result(null, res)
//             })
//           }
//         })
//       }
//     }
//   );
// };

// reImburse user with the actual figure..... 
exports.reImburseFund = async (table, userID, val, result) => {
  await sql.query(`SELECT  ${table} FROM miningusers WHERE id=?`, [userID], async (err, resultRes) => {
    let balance = resultRes[0][`${table}`] + val;
    console.log(balance)
    if (err) return result(err, null);
    await sql.query(`UPDATE miningusers SET ${table}=${balance} WHERE id=${userID}`, async (tabErr, tabRes) => {
      if (tabErr) return result(tabErr, null)
      return result(null, tabRes)
    })
  })
}


exports.approvedeposit = async (
  table,
  userID,
  receiptID,
  result
) => {

  await sql.query(
    `UPDATE ${table} SET status=? WHERE user_id=? AND id=?`,
    ["Active", userID, receiptID], async (err, output) => {
      if (err) return console.log(err), result(err, null)
      else {
        sql.query(`SELECT amt  FROM ${table} WHERE user_id=? AND  id=?`, [userID, receiptID], async (err, res) => {
          if (err) return result(err, null);

          else {
            let val = Object.values(res)[0].amt;
            await sql.query(`SELECT  ${table} FROM miningusers WHERE id=?`, [userID], async (err, resultRes) => {
              let balance = resultRes[0][`${table}`] + val;
              if (err) return result(err, null);
              await sql.query(`UPDATE miningusers SET ${table}=${balance} WHERE id=${userID}`, async (tabErr, tabRes) => {
                if (tabErr) return result(tabErr, null)
                return result(null, tabRes)
              })
            })


          }
        })
      }
    }
  );
};

exports.updatePassword = async (password, userID, result) => {
  sql.query(
    `UPDATE miningusers SET password=? WHERE id=?`,
    [password, userID],
    (err, output) => {
      if (err) return console.log(err), result(err, null);
      return result(null, output);
    }
  );
};

exports.updateBonus = async (amount, userID, result) => {
  await sql.query('SELECT bonus FROM miningusers WHERE id=?', [userID], async (bonusErr, bonusRes) => {
    if (bonusErr) return console.log(bonusErr), result(bonusErr, null);
    else {
      let value = bonusRes.length > 0 ? parseFloat(bonusRes[0]['bonus']) + parseFloat(amount) : parseFloat(amount);
      await sql.query(
        `UPDATE miningusers SET bonus=? WHERE id=?`,
        [amount, userID],
        (err, output) => {
          if (err) return console.log(err), result(err, null);
          return result(null, output);
        }
      );
    }
  })

};

exports.data = async (id, result) => {
  await sql.query(`SELECT fullname, bonus,  phone, btcacc, ethacc, cadacc, dogeacc,trxacc,usdtacc, email FROM miningusers WHERE id=?`, [id], async (err, output) => {
    if (err) return result(err, null)
    else {
      await sql.query(`SELECT * FROM btcacc WHERE user_id=?`, [id], async (btcErr, btcRes) => {
        if (btcErr) return console.log("outtttttttttt", btcErr), result(null, output)
        //.................          ............//
        else {

          await sql.query('select * from ethacc where user_id=?', [id], async (ethErr, ethRes) => {
            if (ethErr) return console.log("outtttttttttt", ethErr), result(null, output, btcRes)
            else {
              await sql.query(`select * from dogeacc where user_id=?`, [id], async (dogeErr, dogeRes) => {
                if (dogeErr) return result(null, output, btcRes, ethRes)
                else {
                  await sql.query('select * from cadacc where user_id=?', [id], async (cadErr, cadRes) => {
                    if (cadErr) return console.log("outtttttttttt", cadErr), result(null, output, btcRes, ethRes, dogeRes);
                    else {

                      await sql.query('select * from trxacc where user_id=?', [id], async (trxErr, trxRes) => {
                        if (trxErr) return console.log("outtttttttttt", trxErr), result(null, output, btcRes, ethRes, dogeRes, cadRes);
                        else {
                          await sql.query('select * from usdtacc where user_id=?', [id], async (usdtErr, usdtRes) => {
                            if (usdtErr) return console.log("outtttttttttt", usdtErr), result(null, output, btcRes, ethRes, dogeRes, cadRes, trxRes);
                            else {
                              await sql.query('SELECT * FROM paymenthistory  WHERE user_id=?', [id], async (paymentHistoryErr, paymentHistoryRes) => {
                                if (paymentHistoryErr) return console.log("outtttttttttt", paymentHistoryErr), result(null, output, btcRes, ethRes, dogeRes, cadRes, trxRes, usdtRes)
                                return result(null, output, btcRes, ethRes, dogeRes, cadRes, trxRes, usdtRes, paymentHistoryRes)

                              })
                            }
                          })
                        }
                      })




                    }

                  })
                }

              })
            }
          })
        }
      })
    }
    //
  });
};


exports.deleteUser = async (userID, result) => {
  sql.query(`DELETE FROM miningusers WHERE id = ?`, [userID], (err, output) => {
    if (err) return result(err, null)
    return result(null, output)
  })
}

exports.removemsg = async (userID, result) => {
  sql.query(`DELETE FROM contact WHERE id = ?`, [userID], (err, output) => {
    if (err) return result(err, null)
    return result(null, output)
  })
}

exports.deletePlan = async (plandID, userID, result) => {
  sql.query(`DELETE FROM receipts WHERE id = ? AND user_id=?`, [plandID, userID], (err, output) => {
    if (err) return result(err, null)
    return result(null, output)
  })
}

exports.contact = (userObj, result) => {
  sql.query(`INSERT INTO contact SET ?`, [userObj], (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  });
};




exports.checkCompletedTaskFromHistory = async (user_id, result) => {
  sql.query(`SELECT * FROM paymenthistory  WHERE user_id=? AND status=?`, [user_id, "paid"], (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  })
}













const insertAdmin = async (result) => {
  const adminPassword = "1234";
  const adminEmail = "admin@gmail.com";

  const encryptedAdminPass = await bcrypt.hash(adminPassword, saltRounds);
  adminObj = {
    email: adminEmail,
    password: encryptedAdminPass,
  };

  sql.query(`INSERT INTO miningadmin SET ?`, [adminObj], async (err, output) => {
    if (err) {
      return result(err, null);
    } else {
      return result(null, output);
    }
  });
};

// insertAdmin((err, result) => {
//   if (err) console.log(err)

// })
