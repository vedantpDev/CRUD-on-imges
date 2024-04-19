const mysql = require("mysql");

const connect = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "user's images",
});

const connectDB = () => {
  connect.connect((err) => {
    if (err) throw err;
    console.log("Database Connected");
  });
  return connect;
};

module.exports = connectDB;
