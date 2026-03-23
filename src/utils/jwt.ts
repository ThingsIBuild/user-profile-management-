import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;


export const generateToken = (userId: string, string?: any) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};


