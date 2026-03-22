import mongoose, {Schema} from "mongoose";
import {IUserDocument} from "../types/user.types";

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




const User = mongoose.model<IUserDocument>('User', UserSchema);
export default User;