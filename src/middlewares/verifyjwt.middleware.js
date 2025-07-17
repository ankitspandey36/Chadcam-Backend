import asyncHandler from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyjwt = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const token = req.cookies?.accessToken || bearerToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: Access Token Missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired access token" });
  }
});
