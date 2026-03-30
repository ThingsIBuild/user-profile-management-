import { Request, Response } from "express";
import {
  createUser,
  loginUser,
  getUserById,
  createRefreshToken,
} from "../services/auth.services";
import { verifyRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    await createUser(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { accessToken, user, refreshToken } = await loginUser(email);

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message: errorMessage });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.body.refreshToken;

  // Validate the refresh token and get the user ID from it
  const userId = verifyRefreshToken(token);

  // find the user by ID
  const user = await getUserById(userId!);

  // Check if the token is valid and matches the one stored for the user
  if (!token || !user || user.refreshToken !== token) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }

  const { refreshToken, accessToken } = await createRefreshToken(userId!);


  res
    .status(200)
    .json({
      message: "Token refreshed successfully",
      refreshToken,
      accessToken
    });
};
