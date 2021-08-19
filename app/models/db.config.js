const sql = require("mysql");


// const connection = sql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "alldb",
// });

// const connection = sql.createPool({
//   host: "us-cdbr-east-02.cleardb.com",
//   user: "bb8ef33c9ae33e",
//   password: "c568b81f",
//   database: "heroku_b311741948eae95",
// });

connection.query(
  "CREATE TABLE IF NOT EXISTS miningusers(id int(11) AUTO_INCREMENT NOT NULL, fullname TEXT(1000) NOT NULL, username TEXT(1000) NULL, phone TEXT(1000) NOT NULL, email TEXT(1000) NOT NULL, bonus TEXT(1000) NULL, password TEXT(1000) NOT NULL, repeat_password TEXT(1000) NOT NULL, PRIMARY KEY(id))",
  (err, result) => {
    if (err) console.log(err);
  }
);

connection.query(
  "CREATE TABLE IF NOT EXISTS contact(id int(11) AUTO_INCREMENT NOT NULL, name TEXT(1000) NOT NULL, phone TEXT(1000) NOT NULL, email TEXT(1000) NOT NULL, subject TEXT(1000) NOT NULL, message TEXT(1000) NOT NULL, PRIMARY KEY(id))",
  (err, result) => {
    if (err) console.log(err);
  }
);

connection.query(
  "create table if not exists receipts(id int(11) auto_increment not null, user_id int(11) not null, receiptImg text(1000) not null, status text(1000) not null, package text(1000) not null, depositdate date null, duedate date null, reference text(1000) null, primary key(id), FOREIGN KEY(user_id) REFERENCES miningusers(id) ON DELETE CASCADE ON UPDATE CASCADE)",
  (err, result) => {
    if (err) console.log(err);
  }
  );

  connection.query(
  "create table if not exists withdrawal(id int(11) auto_increment not null, user_id int(11) not null, wallet text(1000) not null, primary key(id), FOREIGN KEY(user_id) REFERENCES miningusers(id) ON DELETE CASCADE ON UPDATE CASCADE)",
  (err, result) => {
    if (err) console.log(err);
  }
  );
  
  connection.query(
    "CREATE TABLE IF NOT EXISTS miningadmin(id int(11) AUTO_INCREMENT NOT NULL, fullname TEXT(1000)  NULL, username TEXT(1000)  NULL, phone TEXT(1000)  NULL, email TEXT(1000) NOT NULL, password TEXT(1000) NULL, repeat_password TEXT(1000) NULL, PRIMARY KEY(id))",
    (err, result) => {
      if (err) console.log(err); 
    }
  );

  module.exports = connection;
