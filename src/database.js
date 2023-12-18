const mysql = require("mysql");
const config = require("./config");

const pool = mysql.createPool({
  connectionLimit: 100,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  // host: config.database.host,
  // port: config.database.port,
  socketPath: config.database.host,
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

// const pool2 = async (config) => {
//   // Note: Saving credentials in environment variables is convenient, but not
//   // secure - consider a more secure solution such as
//   // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
//   // keep secrets safe.
//   return mysql.createPool({
//     user: config.database.user, // e.g. 'my-db-user'
//     password: config.database.password, // e.g. 'my-db-password'
//     database: config.database.database, // e.g. 'my-database'
//     socketPath: config.database.host, // e.g. '/cloudsql/project:region:instance'
//     // Specify additional properties here.
//     // ...config,
//   });
// };
// // [END cloud_sql_mysql_mysql_connect_unix]
// // module.exports = createUnixSocketPool;
