import {Request, Response } from 'express';
import { createUser, loginUser } from '../services/auth.services';
import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();

export const register = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: 'User registered successfully'});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ message: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {

  try {
    const { email, password } = req.body;
   
    const { token , user } = await loginUser(email);


    const isMatch = await user.comparePassword(password);

    console.log(isMatch, 'password match')
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ token });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ message: errorMessage });
  }
 
}