import dotenv from 'dotenv';
dotenv.config({ path: ['.env'] });


export const JWT_SECRET = process.env.JWT_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string || "15m";
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN as string || "7d";
export const MONGO_URI = process.env.MONGO_URI as string;
export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
