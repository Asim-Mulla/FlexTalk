import { api } from "../../../components/utilities/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const getMessagesThunk = createAsyncThunk(
  "message/get-messages",
  async ({ otherUserId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/message/get-messages/${otherUserId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.errMessage;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const sendMessageThunk = createAsyncThunk(
  "message/send",
  async ({ receiverId, message }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/message/send/${receiverId}`, {
        message,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.errMessage;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
