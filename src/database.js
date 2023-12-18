const mysql = require("mysql");
const config = require("./config");

const pool = mysql.createPool({
  connectionLimit: 100,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  host: config.database.host,
  port: config.database.port,
});

pool.getConnection((error, connection) => {
  if (error) {
    console.error("Error connecting to the database: ", error.message);
  } else {
    console.log("Connected to the database!");
    connection.release();
  }
});

module.exports = pool;
