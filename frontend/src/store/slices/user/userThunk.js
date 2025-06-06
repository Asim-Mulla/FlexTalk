import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../components/utilities/axiosInstance.js";
import toast from "react-hot-toast";

export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/user/login", {
        username,
        password,
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

export const registerUserThunk = createAsyncThunk(
  "user/signup",
  async ({ name, username, password, gender }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/user/register", {
        name,
        username,
        password,
        gender,
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

export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/user/logout");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.errMessage;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserProfileThunk = createAsyncThunk(
  "user/get-profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/user/profile");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.errMessage;
      return rejectWithValue(errorMessage);
    }
  }
);

export const getOtherUsersThunk = createAsyncThunk(
  "user/get-users",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/user/get-users");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.errMessage;
      return rejectWithValue(errorMessage);
    }
  }
);
