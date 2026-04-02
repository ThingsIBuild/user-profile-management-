import {
  getUserProfile,
  deleteUserProfile,
  updateUserProfile,
} from "../services/user.services";

export const getProfile = async (req: any, res: any) => {
  try {
    const { userId } = req.user; // Assuming auth middleware sets req.user
    const userProfile = await getUserProfile(userId);

    res.status(200).json({ profile: userProfile });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message: errorMessage });
  }
};

export const updateProfile = async (req: any, res: any) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    const updatedProfile = await updateUserProfile(userId, updateData);

    res
      .status(200)
      .json({
        message: "Profile updated successfully",
        profile: updatedProfile,
      });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message: errorMessage });
  }
};

export const deleteProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const deletedProfile = await deleteUserProfile(id);

    if (!deletedProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message: errorMessage });
  }
};
