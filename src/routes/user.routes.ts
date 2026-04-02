import express from "express";
import { authMiddleware , authorizeOwnerOrAdmin } from "../middlewares/auth.middleware";
import { deleteProfile, getProfile, updateProfile } from "../controllers/user.controller";

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile/:id', authMiddleware, updateProfile);
router.delete('/:id', authMiddleware, authorizeOwnerOrAdmin(), deleteProfile);

export default router;