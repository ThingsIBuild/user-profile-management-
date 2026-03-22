import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();


export const createUser = async (userData: any) => {
  return await userRepository.createUser(userData);
};

export const loginUser = async (email: string, password: string) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  return user;
};