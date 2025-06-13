import { createSlice } from "@reduxjs/toolkit";
import { getMessagesThunk, sendMessageThunk } from "./messageThunk";
import { useSelector } from "react-redux";

export const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: null,
  },
  reducers: {
    setNewMessages: (state, action) => {
      const oldMessages = state.messages ?? [];
      state.messages = [...oldMessages, action.payload];
    },
  },
  extraReducers: (builder) => {
    // get messages Thunk
    builder.addCase(getMessagesThunk.pending, (state, action) => {});
    builder.addCase(getMessagesThunk.fulfilled, (state, action) => {
      state.messages = action?.payload?.responseData?.messages;
    });
    builder.addCase(getMessagesThunk.rejected, (state, action) => {});

    // send message Thunk
    builder.addCase(sendMessageThunk.pending, (state, action) => {});
    builder.addCase(sendMessageThunk.fulfilled, (state, action) => {
      const oldMessages = state.messages ?? [];
      state.messages = [...oldMessages, action.payload?.responseData];
    });
    builder.addCase(sendMessageThunk.rejected, (state, action) => {});
  },
});

export const { setNewMessages } = messageSlice.actions;

export default messageSlice.reducer;
