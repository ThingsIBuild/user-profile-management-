import { UserRepository } from "../repositories/user.repository"

const userRepository = new UserRepository();

export const getUserProfile = async (userId: string) => {
  // Implement logic to fetch user profile by userId
    return await userRepository.findUserById(userId)
};