import { getUserProfile } from "../services/user.services";


export const getProfile = async (req: any, res: any) => {
  try {
    const {userId }= req.user; // Assuming auth middleware sets req.user
    const userProfile = await getUserProfile(userId);
 
    res.status(200).json({ profile: userProfile });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ message: errorMessage });
  }
};