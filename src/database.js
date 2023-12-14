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

module.exports = pool;
