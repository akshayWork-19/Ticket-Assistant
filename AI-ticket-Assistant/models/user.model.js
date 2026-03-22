import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    requried: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "moderator", "admin"]
  },
  skills: [String],
  avatarUrl: {
    type: String,
    default: ""
  }
});

export default mongoose.model('User', userSchema);