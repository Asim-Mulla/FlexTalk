import express from "express";
import {
  login,
  getProfile,
  register,
  logout,
  getOtherUsers,
} from "../controllers/userControllers.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", authenticateToken, logout);
userRouter.get("/profile", authenticateToken, getProfile);
userRouter.get("/get-users", authenticateToken, getOtherUsers);

export default userRouter;
