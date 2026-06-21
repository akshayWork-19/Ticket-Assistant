import express from 'express';
import { signup, login, updateUser, getUserDetails, updateProfile } from "../controllers/user.js";
import { authenticate } from '../middlewares/auth.js';
import { loginSchema, signupSchema, updateProfileSchema, updateUserSchema } from "../validations/user.validation.js"
import { validate } from "../middlewares/validate.js";
const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
// router.post('/logout', logout);
router.put('/update', authenticate, validate(updateUserSchema), updateUser);
router.get('/details', authenticate, getUserDetails);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;