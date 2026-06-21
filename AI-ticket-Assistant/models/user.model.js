import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true        // fast lookups on login & role updates
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "moderator", "admin"],
    index: true        // fast moderator queries in Inngest triage
  },
  skills: [String],
  avatarUrl: {
    type: String,
    default: ""
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('User', userSchema);