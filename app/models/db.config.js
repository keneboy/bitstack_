const sql = require("mysql");


const connection = sql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "hood",
});

// const connection = sql.createPool({
//   host: "us-cdbr-east-02.cleardb.com",
//   user: "bb8ef33c9ae33e",
//   password: "c568b81f",
//   database: "heroku_b311741948eae95",
// });

connection.query(
  "CREATE TABLE IF NOT EXISTS miningusers(id int(11) AUTO_INCREMENT NOT NULL,  fullname TEXT(1000) NOT NULL, username TEXT(1000) NULL, phone TEXT(1000) NOT NULL, email TEXT(1000) NOT NULL, bonus TEXT(1000) NULL, password TEXT(1000) NOT NULL, repeat_password TEXT(1000) NOT NULL, btcacc int(11) null default(0), ethacc int(11) null default(0), dogeacc int(11) null default(0), cadacc int(11) null default(0), trxacc int(11) null default(0),usdtacc int(11) null default(0), PRIMARY KEY(id))",
  (err, result) => {
    if (err) console.log(err);
    else {

      connection.query(
        "create table if not exists receipts(id int(11) auto_increment not null, user_id int(11) not null, receiptImg text(1000) not null, status text(1000) not null, package text(1000) not null, depositdate date null, duedate date null, countDownDate text(1000) not null, product_id int(11) null, accumulatedBalance int(11) null,  reference text(1000) null, primary key(id), FOREIGN KEY(user_id) REFERENCES miningusers(id) ON DELETE CASCADE ON UPDATE CASCADE)",
        (err, result) => {
          if (err) console.log(err);
        }
      );
      // connection.query(
      //   "DROP  TABLE receipts",
      //   (err, result) => {
      //     if (err) console.log(err);
      //   }
      //   );


      connection.query(
        "create table if not exists btcacc(id int(11) auto_increment not null, user_id int(11) not null, receiptImg text(1000) not null, status text(1000) not null, depositdate date null, amt int(11) null default(0), reference text(1000) null, primary key(id), FOREIGN KEY(user_id) REFERENCES miningusers(id) ON DELETE CASCADE ON UPDATE CASCADE)",
        (err, result) => {
          if (err) console.log(err);
        }
      );

      connection.query(
        "create table if not exists ethacc(id int(11) auto_increment not null, user_id int(11) not null, receiptImg text(1000) not null, status text(1000) not null, depositdate date null, amt int(11) null default(0), reference text(1000) null, primary key(id), FOREIGN KEY(user_id) REFERENCES miningusers(id) ON DELETE CASCADE ON UPDATE CASCADE)",
        (err, result) => {
          if (err) console.log(err);
        }
      );

      connection.query(
        "create table if not exists dogeacc(id int(11) auto_increment not null, user_id int(11) not null, receiptImg text(1000) not null, status text(1000) not null, depositdate date null, amt int(11) null default(0), reference text(1000) null, primary key(id), FOREIGN KEY(user_id) REFERENCES miningusers(id) ON DELETE CASCADE ON UPDATE CASCADE)",
        (err, result) => {
          if (err) console.log(err);
        }
      );
      connection.query(
        "create table if not exists cadacc(id int(11) auto_increment not null, user_id int(11) not null, receiptImg text(1000) not null, status text(1000) not null, depositdate date null, amt int(11) null default(0), reference text(1000) null, primary key(id), FOREIGN KEY(user_id) REFERENCES miningusers(id) ON DELETE CASCADE ON UPDATE CASCADE)",
        (err, result) => {
          if (err) console.log(err);
        }
      );
      connection.query(
        "create table if not exists trxacc(id int(11) auto_increment not null, user_id int(11) not null, receiptImg text(1000) not null, status text(1000) not null, depositdate date null, amt int(11) null default(0), reference text(1000) null, primary key(id), FOREIGN KEY(user_id) REFERENCES miningusers(id) ON DELETE CASCADE ON UPDATE CASCADE)",
        (err, result) => {
          if (err) console.log(err);
        }
      );
      connection.query(
        "create table if not exists usdtacc(id int(11) auto_increment not null, user_id int(11) not null, receiptImg text(1000) not null, status text(1000) not null, depositdate date null, amt int(11) null default(0), reference text(1000) null, primary key(id), FOREIGN KEY(user_id) REFERENCES miningusers(id) ON DELETE CASCADE ON UPDATE CASCADE)",
        (err, result) => {
          if (err) console.log(err);
        }
      );

      connection.query(
        "create table if not exists withdrawal(id int(11) auto_increment not null, user_id int(11) not null, wallet text(1000) not null, status ENUM('pending', 'verified') not null, crypto TEXT(1000) not null, product_id int(11), amount int(11) not null, primary key(id), FOREIGN KEY(user_id) REFERENCES miningusers(id) ON DELETE CASCADE ON UPDATE CASCADE)",
        (err, result) => {
          if (err) console.log(err);
        }
      );
      connection.query(
        "create table if not exists paymenthistory(id int(11) auto_increment not null, approvedDate timestamp default current_timestamp, user_id int(11) not null,  product_id int(11) not null, amount int(11) not null, crypto text(1000) not null, status ENUM('pending', 'paid') not null, primary key(id),  FOREIGN KEY(user_id) REFERENCES miningusers(id) ON DELETE CASCADE ON UPDATE CASCADE)",
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
    }


  }
);

connection.query(
  "CREATE TABLE IF NOT EXISTS contact(id int(11) AUTO_INCREMENT NOT NULL, name TEXT(1000) NOT NULL, phone TEXT(1000) NOT NULL, email TEXT(1000) NOT NULL, subject TEXT(1000) NOT NULL, message TEXT(1000) NOT NULL, PRIMARY KEY(id))",
  (err, result) => {
    if (err) console.log(err);
  }
);


module.exports = connection;
