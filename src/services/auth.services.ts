import { UserRepository } from "../repositories/user.repository";
import { generateToken } from "../utils/jwt";

const userRepository = new UserRepository();

export const createUser = async (userData: any) => {
  return await userRepository.createUser(userData);
};

export const loginUser = async (email: string) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id!);

  return { user, token };
};
