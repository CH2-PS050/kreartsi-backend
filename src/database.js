const mysql = require('mysql');

const pool = mysql.createPool({
  user: '',
  password: '',
  database: '',
  host: '',
  port: ''
});

module.exports = pool;