import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const serverUrl = import.meta.env.VITE_SERVER_URL;

export const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineUsers: null,
  },
  reducers: {
    initializeSocket: (state, action) => {
      const socket = io(serverUrl, { query: { userId: action.payload } });
      state.socket = socket;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { initializeSocket, setOnlineUsers } = socketSlice.actions;

export default socketSlice.reducer;
