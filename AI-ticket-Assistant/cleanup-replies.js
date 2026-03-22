// cleanup-replies.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ticket from './models/ticket.model.js';

dotenv.config();

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Find all tickets and remove responses that have no message
        const result = await Ticket.updateMany(
            {},
            { $pull: { responses: { message: { $exists: false } } } }
        );

        console.log(`Cleaned up empty responses in ${result.modifiedCount} tickets!`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanup();
