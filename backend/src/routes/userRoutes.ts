import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getMe, updateProfile } from '../controllers/userController.js';

const router = Router();
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);

export default router;


