import express from "express";
import { authMiddleware , authorizeAdminOnly} from "../middlewares/auth.middleware";
import { deleteProfile, getProfile, updateProfile , getAllProfiles } from "../controllers/user.controller";

const router = express.Router();

router.get('/', authMiddleware, getAllProfiles);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile/:id', authMiddleware, updateProfile);
router.delete('/:id', authMiddleware, authorizeAdminOnly(),deleteProfile);

export default router;