import express from 'express';
import { signup, signin, logout } from '../../controllers/Auth/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout); // Route đăng xuất

export default router;