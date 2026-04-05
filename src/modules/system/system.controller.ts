import { Request, Response } from "express";
import * as systemService from "./system.service";

export const getSystemInfo = async (req: Request, res: Response) => {
  try {
    const data = await systemService.getSystemInfo();

    res.render('system',{data})
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch system info",
    });
  }
};
