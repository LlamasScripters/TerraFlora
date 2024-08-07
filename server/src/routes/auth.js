import Router from 'express';
import { 
    confirmEmail, 
    forgotPassword, 
    login, 
    loginLimiter,
    register, 
    resetPassword, 
    resetPasswordPage
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { verifyToken } from '../middlewares/tokenMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/confirm/:token', confirmEmail);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:token', resetPasswordPage);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-token', authenticate, verifyToken);

export default router;