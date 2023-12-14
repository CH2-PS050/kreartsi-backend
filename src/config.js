import dotenv from "dotenv";

dotenv.config();

const config = {
  database: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || "3306",
  },
  storage: {
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEY_FILE_PATH,
    bucketName: process.env.GCP_BUCKET_NAME,
  },
};

module.exports = config;
