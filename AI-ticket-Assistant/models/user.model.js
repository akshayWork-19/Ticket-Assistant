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
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('User', userSchema);