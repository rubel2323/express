import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
const app: Application = express();
const port = 3000;
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_WhITQRUbz19C@ep-silent-surf-atgbsf0j-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require",
});

// creating table
const initDB = async () => {
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
initDB();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  // res.send("Hello World!");
  res.status(200).json({
    message: "This is Express server",
    author: "Next Level",
    version: "2.0.12",
  });
});

app.post("/", async (req: Request, res: Response) => {
  // console.log(req.body);

  const { name, email, password, age } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4) RETURNING *
   `,
      [name, email, password, age],
    );
    console.log(result.rows[0]);
    res.status(201).json({
      message: "data created",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(505).json({
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
