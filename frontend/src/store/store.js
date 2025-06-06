import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user/userSlice";
import messageReducer from "./slices/message/messageSlice";
import socketReducer from "./slices/socket/socketSlice";

export const store = configureStore({
  reducer: {
    userReducer,
    messageReducer,
    socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["socketReducer.socket"],
      },
    }),
});
