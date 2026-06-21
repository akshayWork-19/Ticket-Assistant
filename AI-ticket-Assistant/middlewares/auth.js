import jwt from "jsonwebtoken";
import config from "../config/config.js";
// import User from "../models/user.model.js"

export const authenticate = async (req, res, next) => {
  // console.log(req.headers);
  const token = req.headers.authorization?.split(" ")[1];
  // console.log(token);

  if (!token || token === 'null') {
    return res.status(401).json({ error: "Access Denied. No Token Found!" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    // console.log(decoded);

    // console.log(user);
    req.user = decoded;
    // console.log(req.user);
    next();
  } catch (error) {
    return res.status(500).json({ error: "Invalid Token " + error.message });
  }
}

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied!" });
  }
  next();
}