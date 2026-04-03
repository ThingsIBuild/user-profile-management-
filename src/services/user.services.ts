import { UserRepository } from "../repositories/user.repository"

const userRepository = new UserRepository();

export const getAllUsers = async () => {
    return await userRepository.findAllUsers();
};

export const getUserProfile = async (userId: string) => {
    return await userRepository.findUserById(userId)
};

export const updateUserProfile = async (userId: string, updateData: any) => {
    return await userRepository.updateUser(userId, updateData)
};

export const deleteUserProfile = async (userId: string) => {
    return await userRepository.deleteUser(userId)
};