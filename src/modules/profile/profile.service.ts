import { pool } from "../../db";

const createProfileIntoDb = async (payload: any) => {
  const { user_id, gender, phone, address, bio } = payload;

  //   first check when user exists
  const user = await pool.query(`SELECT * user WHERE id=$id`, [user_id]);

  //if user does not exist in DB
  if (user.rows.length === 0) {
    throw new Error("User not exists");
  }
  // Db creation for the first time
  const result = await pool.query(
    `INSERT INTO profile(user_id,gender,phone,address,bio) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [user_id, gender, phone, address, bio],
  );
  return result;
};

export const profileService = { createProfileIntoDb };
