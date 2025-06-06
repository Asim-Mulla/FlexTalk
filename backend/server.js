import "dotenv/config";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import messageRouter from "./routes/messageRoutes.js";
import { connectDB } from "./configs/database.js";
import { app, server } from "./socket/socket.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

connectDB();

app.get("/", (req, res) => {
  res.send("server is listening");
});

app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
