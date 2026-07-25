import { Pool } from "pg";
import config from "../config/config";

export const pool = new Pool({
  connectionString: config.db_url,
});

// creating table
export const initDB = async () => {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users(
      id SERIAL   PRIMARY KEY,
      name VARCHAR(20),
      email VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      ) 
    `,
    );
  } catch (error) {
    console.log("Database created successfully");
  }
};
