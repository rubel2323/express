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

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id as string);

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
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const { name, email, password, age, is_active } = req.body;
    const result = await userService.updateUserFromDb(req.body, id as string);
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
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      Error: error.detail || error.code,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.deleteUserFromDb(id as string);

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
};

export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
