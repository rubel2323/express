import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool, Query } from "pg";
const app: Application = express();

//information from config files
import config from "./config/config";
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.router";

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

//middleware with neonDb and server
app.use("/api/users/", userRoute);

// app.get for all user

//app.get for single users

app.get("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("The id is", id);
    const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with id ${id} not found `,
      });
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(505).json({
      success: false,
      message: "Failed to fetch user",
      Error: error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const query = `UPDATE users 
      SET name=COALESCE($1,name),
      email=COALESCE($2,email),
      password=COALESCE($3,password),
      age=COALESCE($4,age),
      is_active=COALESCE($5,is_active),
      updated_at=NOW()
      WHERE id=$6
      RETURNING *`;

  try {
    const { id } = req.params;
    const { name, email, password, age, is_active } = req.body;
    const result = await pool.query(query, [
      name,
      email,
      password,
      age,
      is_active,
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with id ${id} not found `,
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    if (error.position) {
      const pos = parseInt(error.position, 10);
      const start = Math.max(0, pos - 20);
      const end = pos + 20;
      console.error("❌ SQL Error near:", query.slice(start, end));
      console.error("👉 Exact character:", query[pos - 1]);
    }
    console.error("Full error:", error.message, "| Code:", error.code);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      Error: error.detail || error.code,
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM users WHERE id=$1 RETURNING * `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with id ${id} not found `,
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      Error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default app;
