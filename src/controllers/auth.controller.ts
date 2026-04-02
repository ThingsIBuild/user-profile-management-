import { Request, Response } from "express";
import {
  createUser,
  loginUser,
  getUserById,
  createRefreshToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
} from "../services/auth.services";
import { verifyRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    await createUser(req.body);
    res
      .status(201)
      .json({ message: "User registered successfully, Please login now" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await loginUser(email, password);

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .json({
        message: "Login successful",
      });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message: errorMessage });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

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
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .json({
      message: "Token refreshed successfully",
    });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  try {
    if (token) {
      await logoutUser(token);
    }

    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .json({
        message: "Logged out successfully",
      });
  } catch (error) {
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .json({ message: "An error occurred during logout" });
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log("email", email);
  try {
    await forgotPassword(email);
    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message: errorMessage });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  // implementation for resetting password would go here
  const { token } = req.query;
  const { password } = req.body;

  console.log("reset token ", token);
  console.log("password ", password);

  try {
    if (!token || typeof token !== "string") {
      return res
        .status(400)
        .json({ message: "Invalid or missing reset token" });
    }

    await resetPassword(token, password);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message: errorMessage });
  }
};

export const sendOTPController = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    await sendOTP(email);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message: errorMessage });
  }
};

export const verifyOTPController = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    await verifyOTP(email, otp);
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message: errorMessage });
  }
};
