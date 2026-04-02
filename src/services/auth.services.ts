import { UserRepository } from "../repositories/user.repository";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { sendEmail } from "../utils/email";
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

  const accessToken = generateAccessToken(user._id!, user.role!);
  const refreshToken = generateRefreshToken(user._id!, user.role!);

  await userRepository.saveRefreshToken(user._id!, refreshToken);

  return { user, accessToken, refreshToken };
};

export const getUserById = async (id: string) => {
  return await userRepository.findUserById(id);
};

export const createRefreshToken = async (userId: string) => {
  const newRefreshToken = generateRefreshToken(userId, "user");
  const newAccessToken = generateAccessToken(userId, "user");

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

  const resetLink = `http://localhost:5000/api/auth/reset-password?token=${resetToken}`;

  await sendEmail(
    email,
    "Password Reset Request",
    `You requested a password reset. Click the link to reset your password: ${resetLink}`,
  );

  return;
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

export const sendOTP = async (email: string) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("No user found with that email");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generate 6 digit OTP
  const expires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  await userRepository.saveOTP(email, hashedOTP, expires);

  await sendEmail(
    email,
    "Your OTP Code",
    `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  );

  return;
};

export const verifyOTP = async (email: string, otp: string) => {
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await userRepository.findUserByOTP(email, hashedOTP);
  if (!user) {
    throw new Error("Invalid or expired OTP");
  }

  await userRepository.verifyUser(email);
  return;
};
