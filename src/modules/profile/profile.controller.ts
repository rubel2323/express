import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const profileCreate = async (req: Request, res: Response) => {
  try {
    const result = await profileService.createProfileIntoDb(req.body);

    res.status(200).json({
      success: true,
      message: "Profile created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      Error: error instanceof Error ? error.message : String(error),
    });
  }
};
export const profileController = { profileCreate };
