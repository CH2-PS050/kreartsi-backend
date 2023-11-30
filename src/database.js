const mysql = require('mysql');

const pool = mysql.createPool({
  user: 'root',
  password: 'KreartsiBangkit2023',
  database: 'kreartsidb',
  host: '127.0.0.1',
  port: '3306'
});

module.exports = pool;