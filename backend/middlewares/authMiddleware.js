import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";

export const authenticateToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new errorHandler("Invalid token", 400));
  }

  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!verifiedToken) {
    return next(new errorHandler("Invalid token", 400));
  }

  req.user = verifiedToken;

  next();
});
