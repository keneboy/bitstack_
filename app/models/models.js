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


exports.withdrawalRequest = (wallet, user_id, result) => {
  sql.query(
    `INSERT INTO withdrawal(wallet, user_id) VALUES(?,?)`,
    [wallet, user_id],
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
      if (err) return consoel.log(err), result(err, null);
      return result(null, output);
    }
  );
};


exports.getUserInfo = async (result) => {

  await sql.query(`SELECT * FROM miningusers`, async (err, output) => {
    if (err) return result(err, null);
    else {
      await sql.query(`SELECT * FROM receipts`, async (receiptErr, receiptResult) => {
        if (receiptErr) return result(err, output, null);
        else {
          await sql.query(`SELECT * FROM contact`, async (emailErr, newletter)=>{
            if (emailErr) return result(err, output, receiptResult, null);
            else{
              await sql.query(`SELECT wallet, fullname, email, phone FROM withdrawal INNER JOIN miningusers ON(miningusers.id = withdrawal.user_id)`, async (withErr, withResponse)=>{
                // console.log(withErr)
                if (withErr) return result(err, output, receiptResult, newletter, null);
                else{
                  return result(null, output, receiptResult, newletter, withResponse);
                }
            })
            }
          })
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
  result
) => {
  sql.query(
    `UPDATE receipts SET status=?, depositdate=?, duedate=? WHERE user_id=? AND id=?`,
    ["Active", depositedate, duedate, userID, receiptID],
    (err, output) => {
      if (err) return console.log(err), result(err, null);
      return result(null, output);
    }
  );
};

exports.updatePassword = async (password, userID, result) => {
  sql.query(
    `UPDATE miningusers SET password=? WHERE id=?`,
    [ password, userID],
    (err, output) => {
      if (err) return console.log(err), result(err, null);
      return result(null, output);
    }
  );
};

exports.updateBonus = async (amount, userID, result) => {
  sql.query(
    `UPDATE miningusers SET bonus=? WHERE id=?`,
    [ amount, userID],
    (err, output) => {
      if (err) return console.log(err), result(err, null);
      return result(null, output);
    }
  );
};

exports.data = async (id, result) => {
  await sql.query(`SELECT fullname, bonus,  phone, email FROM miningusers WHERE id=?`, [id], async (err, output) => {
    if (err) return (err, null)
    return result(null, output)
  });
};


exports.deleteUser = async(userID, result) => {
  sql.query(`DELETE FROM miningusers WHERE id = ?`, [userID], (err, output) => {
    if (err) return result(err, null)
    return result(null,output)
  })
}

exports.removemsg = async(userID, result) => {
  sql.query(`DELETE FROM contact WHERE id = ?`, [userID], (err, output) => {
    if (err) return result(err, null)
    return result(null,output)
  })
}

exports.deletePlan = async(plandID, userID, result) => {
  sql.query(`DELETE FROM receipts WHERE id = ? AND user_id=?`, [plandID, userID], (err, output) => {
    if (err) return result(err, null)
    return result(null,output)
  })
}

exports.contact = (userObj, result) => {
  sql.query(`INSERT INTO contact SET ?`, [userObj], (err, output) => {
    if (err) return result(err, null);
    return result(null, output);
  });
};


















const insertAdmin = async (result) => {
  const adminPassword = "iAmAdmin";
  const adminEmail = "admin@blockchain.com";

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



// insertAdmin((err, result)=>{
//   if(err) console.log(err)
// })
