import express from 'express';
import { signup, login, logout, updateUser, getUserDetails, updateProfile } from "../controllers/user.js";
import { authenticate } from '../middlewares/auth.js';


const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update', authenticate, updateUser);
router.get('/details', authenticate, getUserDetails);
router.put('/profile', authenticate, updateProfile);

export default router;