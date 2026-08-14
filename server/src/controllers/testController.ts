import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

export const driverTest = (req: AuthRequest, res: Response) => {
  res.json({
    message: "Driver access successful",
    user: req.user,
  });
};

export const adminTest = (req: AuthRequest, res: Response) => {
  res.json({
    message: "Admin access successful",
    user: req.user,
  });
};