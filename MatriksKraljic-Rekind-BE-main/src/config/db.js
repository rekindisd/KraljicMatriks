import fs from "fs";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,

  //For Development
  // ssl: {
  //   rejectUnauthorized: true,
  //   ca: fs.readFileSync(process.env.DB_SSL_CA_PATH).toString(),
  // },

  //For Prod
  ssl: {
    ca: process.env.CA_PEM,
  },
});

export default pool;
