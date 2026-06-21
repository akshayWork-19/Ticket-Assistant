import logger from "../utils/logger.js";
import * as userService from '../services/user.service.js';


export const signup = async (req, res) => {

  try {
    const { email, password, skills = [] } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    };
    const result = await userService.createUser({ email, password, skills });
    return res.status(201).json(result);
  } catch (error) {
    logger.error(`Signup Failed: ${error.message}`, { stack: error.stack });

    // We catch the specific error thrown by the service to maintain correct HTTP status codes
    if (error.message.includes("User already exists")) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Signup Failed", details: error.message });
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const result = await userService.authenticateUser({ email, password });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: "Login Failed", details: error.message });
  }


}


// export const logout = async (req, res) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ error: "Unauthorized!" })
//     }
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ error: err.message })
//       }
//     })
//   } catch (error) {
//     return res.status(500).json({ error: "Login Failed", details: error.message });
//   }
// }

export const updateUser = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden!" });
    }
    const { skills, email, role } = req.body;
    await userService.updateUserRole({ email, skills, role });

    return res.status(200).json({ message: "User updated Successfully" });
  } catch (error) {
    if (error.message.includes("No User Found")) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "User Update Failed!" });
  }
}


export const getUserDetails = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden!" });
    }
    const users = await userService.getAllUsers();
    return res.status(200).json({ AllUsers: users });
  } catch (error) {
    return res.status(500).json({ error: "GetUserDetails Failed!" });
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { skills, avatarUrl } = req.body;

    if (skills === undefined && avatarUrl === undefined) {
      return res.status(400).json({ error: "Please provide either skills or avatarUrl to update." });
    }

    const user = await userService.updateUserProfile(req.user._id, { skills, avatarUrl });

    return res.status(200).json({
      message: "Profile updated!",
      user
    });
  } catch (error) {
    if (error.message.includes("User not found")) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "profile update failed!" });
  }
}