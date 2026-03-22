import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { inngest } from "../inngest/client.js"


export const signup = async (req, res) => {

  const { email, password, skills = [] } = req.body;
  // console.log(email, password);
  // console.log("entering here !")
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashPassword, skills });
    // console.log(user);

    //fire inngest option
    const response = await inngest.send({
      name: "user/signup",
      data: {
        email,
      },
    });
    console.log("response:", response);

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
    // console.log(user, token);
    return res.json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Signup Failed", details: error.message });
  }
}


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User Not Found!" });
    }
    const passwordMatched = bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(401).json({ error: "Invalid Credentials!" });
    }
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
    return res.json({ user, token });
  } catch (error) {
    return res.status(500).json({ error: "Login Failed", details: error.message });
  }
}


export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized!" })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: err.message })
      }
    })
  } catch (error) {
    return res.status(500).json({ error: "Login Failed", details: error.message });
  }
}

export const updateUser = async (req, res) => {
  const { skills = [], email, role } = req.body;
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden!" })
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "No User Found!" })
    }
    await User.updateOne({ email }, { skills, role });

    return res.status(200).json({ message: "User updated Successfully" })
  } catch (error) {
    return res.status(500).json({ error: "User Update Failed!" })
  }
}


export const getUserDetails = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden!" });
    }

    const users = await User.find().select("-password");
    return res.status(200).json({ AllUsers: users });
  } catch (error) {
    return res.status(500).json({ error: "GetUserDetails Failed!" })

  }
}

export const updateProfile = async (req, res) => {
  const { skills, avatarUrl } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    if (skills !== undefined) user.skills = skills;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    await user.save();

    return res.status(200).json({
      message: "Profile updated!",
      user
    });

  } catch (error) {
    return res.status(500).json({
      error: "profile update failed!"
    })
  }
}