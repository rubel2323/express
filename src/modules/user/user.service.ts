import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs";

const createUserIntoDb = async (payload: IUser) => {
  const { name, email, password, age } = payload;

  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4) RETURNING *
   `,
    [name, email, hash, age],
  );
  delete result.rows[0].password;
  return result;
};

const getAllUserFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  result.rows.forEach((row) => delete row.password);
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  result.rows.forEach((row) => delete row.password);
  return result;
};

const updateUserFromDb = async (payload: IUser, id: string) => {
  const { name, email, password, age, is_active } = payload;
  const query = `UPDATE users 
      SET name=COALESCE($1,name),
      email=COALESCE($2,email),
      password=COALESCE($3,password),
      age=COALESCE($4,age),
      is_active=COALESCE($5,is_active),
      updated_at=NOW()
      WHERE id=$6
      RETURNING *`;
  const result = await pool.query(query, [
    name,
    email,
    password,
    age,
    is_active,
    id,
  ]);
  result.rows.forEach((row) => delete row.password);
  return result;
};

const deleteUserFromDb = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id=$1 RETURNING * `,
    [id],
  );
  result.rows.forEach((row) => delete row.password);
  return result;
};
export const userService = {
  createUserIntoDb,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserFromDb,
  deleteUserFromDb,
};
