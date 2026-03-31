import { UserRepository } from "../repositories/user.repository";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import crypto from "crypto";

const userRepository = new UserRepository();

export const createUser = async (userData: any) => {
  return await userRepository.createUser(userData);
};

export const loginUser = async (email: string) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user._id!);
  const refreshToken = generateRefreshToken(user._id!);

  await userRepository.saveRefreshToken(user._id!, refreshToken);

  return { user, accessToken, refreshToken };
};

export const getUserById = async (id: string) => {
  return await userRepository.findUserById(id);
};

export const createRefreshToken = async (userId: string) => {
  const newRefreshToken = generateRefreshToken(userId);
  const newAccessToken = generateAccessToken(userId);

  await userRepository.saveRefreshToken(userId, newRefreshToken);

  return { refreshToken: newRefreshToken, accessToken: newAccessToken };
};

export const logoutUser = async (token: string) => {
  if (!token) return;
  await userRepository.clearRefreshToken(token);
};

// forgot password related services

export const forgotPassword = async (email: string) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("No user found with that email");
  }

  // hash the token before saving to database for security
  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // set token and expiry (1 hour)
  const expires = new Date(Date.now() + 3600000); // 1 hour from now

  await userRepository.setResetPasswordToken(email, hashedToken, expires);

  // send email (later)

  const resetLink = `http://localhost:5000/api/auth/reset-password?token=${resetToken}`;

  // send the reset link via email (implementation for sending email would go here)

  return resetLink;
};

// reset password service
export const resetPassword = async (token: string, newPassword: string) => {
  // hash the incoming token to compare with database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userRepository.findUserByResetToken(hashedToken);

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  await userRepository.updatePassword(user._id!, newPassword);
  return;
};
