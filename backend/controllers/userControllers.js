import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import Conversation from "../models/conversationModel.js";

const register = asyncHandler(async (req, res, next) => {
  const { name, username, password, gender } = req.body;

  if (!name || !username || !password || !gender) {
    return next(new errorHandler("All fields are required", 400));
  }

  const user = await User.findOne({ username });

  if (user) {
    return next(
      new errorHandler(`Username not available, try something else`, 400)
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const avatarType = gender === "male" ? "boy" : "girl";
  const avatar = `https://avatar.iran.liara.run/public/${avatarType}?username=${username}`;

  const newUser = await User.create({
    name,
    username,
    password: hashedPassword,
    gender,
    avatar,
  });

  const userId = newUser._id;

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  const cookieExpiryMs = process.env.COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  // Notifying on telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const sendTelegramNotification = async () => {
    const message = `! New user signed up !
    User name :- ${newUser.name},
    User username :- ${newUser.username},
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      message
    )}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      if (result.ok) {
        // console.log("Notification sent successfully!");
      } else {
        console.error("Failed to send notification:", result);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  sendTelegramNotification();

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + cookieExpiryMs),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({ success: true, responseData: { newUser, token } });
});

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new errorHandler("Please enter username and password", 400));
  }

  const user = await User.findOne({ username });

  if (!user) {
    return next(new errorHandler("Invalid username or password", 400));
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return next(new errorHandler("Invalid username or password"));
  }

  const userId = user._id;

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  const cookieExpiryMs = process.env.COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + cookieExpiryMs),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({ success: true, responseData: { token, user } });
});

const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(new errorHandler("Something went wrong", 400));
  }

  const user = await User.findById(userId);

  res.status(200).json({ success: true, responseData: { user } });
});

const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", { expires: new Date(Date.now()), httpOnly: true })
    .json({ success: true, message: "Logout Successfully" });
});

const getOtherUsers = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(new errorHandler("Something went wrong", 400));
  }

  const users = await User.find({ _id: { $ne: req.user.id } });

  const contactedUserIds = [];

  const conversations = await Conversation.find({
    participants: userId,
  });

  conversations.forEach((conversation) => {
    conversation.participants.forEach((participantId) => {
      if (participantId.toString() !== userId) {
        contactedUserIds.push(participantId);
      }
    });
  });

  const contactedUsers = await User.find({ _id: { $in: contactedUserIds } });

  res
    .status(200)
    .json({ success: true, responseData: { users, contactedUsers } });
});

export { register, login, getProfile, logout, getOtherUsers };
