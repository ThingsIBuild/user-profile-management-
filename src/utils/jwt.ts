import jwt, { SignOptions } from "jsonwebtoken";
import {
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../config/env";


export const generateAccessToken = (userId: string) => {
  const payload = { userId };
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (userId: string) => {
  const payload = { userId };
  const options: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as {
      userId: string;
    };
    return decoded.userId;
  } catch (error) {
    return null;
  }
};
