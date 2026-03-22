import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

export const authenticate = async (req, res, next) => {
  // console.log(req.headers);
  const token = req.headers.authorization?.split(" ")[1];
  // console.log(token);

  if (!token || token === 'null') {
    return res.status(401).json({ error: "Access Denied. No Token Found!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    // console.log(user);
    req.user = decoded;
    // console.log(req.user);
    next();
  } catch (error) {
    return res.status(500).json({ error: "Invalid Token" + error.message });
  }
}