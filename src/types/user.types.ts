import { HydratedDocument } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  otp?: string;
  otpExpires?: Date;
  isVerified?: boolean;
  role?: "user" | "admin";
}


  
export type IUserDocument = HydratedDocument<IUser> & {
  comparePassword(candidatePassword: string): Promise<boolean>;
  role: "user" | "admin";
};