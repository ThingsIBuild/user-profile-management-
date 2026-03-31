import User from "../models/user.model";
import { IUser, IUserDocument } from "../types/user.types";

export class UserRepository {
  async createUser(userData: IUser): Promise<IUserDocument> {
    const user = new User(userData);
    return await user.save();
  }

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return await User.findOne({ email });
  }

  async findUserById(id: string): Promise<IUser | null> {
    return await User.findById(id).select("-password");
  }

  async updateUser(
    id: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
  async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<IUserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      { refreshToken },
      { returnDocument: "after" },
    );
  }

  async findUserByRefreshToken(
    refreshToken: string,
  ): Promise<IUserDocument | null> {
    return await User.findOne({ refreshToken });
  }

  async clearRefreshToken(refreshToken: string): Promise<IUserDocument | null> {
    return await User.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null },
      { returnDocument: "after" },
    );
  }

  // forgot password related methods
  async setResetPasswordToken(
    email: string,
    token: string,
    expires: Date,
  ): Promise<IUserDocument | null> {
    return await User.findOneAndUpdate(
      { email },
      { resetPasswordToken: token, resetPasswordExpires: expires },
      { returnDocument: "after" },
    );
  }

  async findUserByResetToken(token: string): Promise<IUserDocument | null> {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
  }

  async updatePassword(userId: string, newPassword: string): Promise<IUserDocument | null> {
    const user = await User.findById(userId);
    if (!user) return null;
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    return await user.save();
  }
}
