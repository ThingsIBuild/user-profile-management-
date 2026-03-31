import { Router } from 'express';
import { register , login , refresh , logout, forgotPasswordController , resetPasswordController} from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout',  logout);
router.post('/forgot-password',  forgotPasswordController);
router.post('/reset-password',  resetPasswordController);

export default router;

