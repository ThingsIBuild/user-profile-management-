import { refresh } from "../controllers/auth.controller";
import { UserRepository } from "../repositories/user.repository";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

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
