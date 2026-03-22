import {Request, Response } from 'express';
import { createUser, loginUser } from '../services/auth.services';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ message: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ message: errorMessage });
  }
}