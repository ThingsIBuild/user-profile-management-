import User from "../models/user.model";
import {IUser, IUserDocument} from "../types/user.types";

export class UserRepository {
  async createUser(userData: IUser): Promise<IUserDocument> {
    const user = new User(userData);
    return await user.save();
  }

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return await User.findOne({email});
  }

  async findUserById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-password');
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, {new: true});
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}