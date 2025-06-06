import Conversation from "../models/conversationModel.js";
import { errorHandler } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Message from "../models/messageModel.js";
import { getSocketId, io } from "../socket/socket.js";

const sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user.id;
  const receiverId = req.params.receiverId;
  const message = req.body.message;

  if (!senderId || !receiverId || !message) {
    return next(new errorHandler("Missing data field", 400));
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }

  // socket.io
  const receiverSocketId = getSocketId(receiverId);
  io.to(receiverSocketId).emit("newMessage", newMessage);

  res.status(200).json({
    success: true,
    responseData: newMessage,
  });
});

const getMessages = asyncHandler(async (req, res, next) => {
  const currentUserID = req.user.id;
  const otherUserId = req.params.otherUserId;

  if (!currentUserID || !otherUserId) {
    return next(new errorHandler("Something went wrong!", 400));
  }

  const conversation = await Conversation.findOne({
    participants: { $all: [currentUserID, otherUserId] },
  }).populate("messages");

  res.status(200).json({ success: true, responseData: conversation });
});

export { sendMessage, getMessages };
