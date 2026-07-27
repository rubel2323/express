import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  // console.log(req.body);

  // const { name, email, password, age } = req.body;
  try {
    const result = await userService.createUserIntoDb(req.body);
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
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};
export const userController = { createUser, getAllUser };
