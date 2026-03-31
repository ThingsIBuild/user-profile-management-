import mongoose from "mongoose";
import { MONGO_URI} from "./env";

export const connectDB = async () => {
  try {
   const conn =  await mongoose.connect(MONGO_URI,{dbName: "user-profile-management-db"});
    console.log("MongoDB connected successfully", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};