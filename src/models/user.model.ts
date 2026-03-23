import mongoose, {Schema } from "mongoose";
import {IUserDocument} from "../types/user.types";
import bcrypt from 'bcryptjs';

const UserSchema: Schema<IUserDocument> = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  avatar: {type: String},
  bio: {type: String},
  location: {type: String},
  website: {type: String},
}, {
  timestamps: true,
});


UserSchema.pre<IUserDocument>('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
}


const User = mongoose.model<IUserDocument>('User', UserSchema);
export default User;