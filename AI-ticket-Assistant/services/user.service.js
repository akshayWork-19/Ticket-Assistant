import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { inngest } from '../inngest/client.js';
import config from '../config/config.js';
import logger from '../utils/logger.js';

export const createUser = async ({ email, password, skills = [] }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists with this email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, skills });

    try {
        const response = await inngest.send({
            name: "user/signup",
            data: { email }
        });
        logger.info(`inngest response : ${JSON.stringify(response)}`);
    } catch (inngestError) {
        logger.error(`Inngest send failed but user was created : ${inngestError.message}`)
    }

    const { password: _, ...safeUser } = user.toObject();
    const token = jwt.sign({ _id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '2d' });

    return { user: safeUser, token };
}

export const authenticateUser = async ({ email, password }) => {
    const user = await User.findOne({ email, isDeleted: { $ne: true } });
    const passwordMatched = user && await bcrypt.compare(password, user.password);

    if (!user || !passwordMatched) {
        throw new Error("Invalid email or password.");
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, config.jwtSecret);
    return { user, token };
};


export const updateUserRole = async ({ email, skills = [], role }) => {
    const user = await User.findOne({ email, isDeleted: { $ne: true } });
    if (!user) {
        throw new Error("No User Found!");
    }

    await User.updateOne({ email }, { skills, role });
    return true;
};

export const getAllUsers = async () => {
    return await User.find({ isDeleted: { $ne: true } }).select("-password");
};

export const deleteUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
        throw new Error("User not found!");
    }
    user.isDeleted = true;
    await user.save();
    return true;
};


export const updateUserProfile = async (userId, { skills, avatarUrl }) => {
    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
        throw new Error("User not found!");
    }

    if (skills !== undefined) user.skills = skills;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();
    return user;
};