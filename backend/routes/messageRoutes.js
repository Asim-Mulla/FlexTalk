import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/send/:receiverId", authenticateToken, sendMessage);
messageRouter.get("/get-messages/:otherUserId", authenticateToken, getMessages);

export default messageRouter;
