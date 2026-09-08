import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginMbaStudent = createAsyncThunk(
  "mbaAuth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/mba/auth/login`, credentials);
      const { token, id, fullName, username } = response.data;
      localStorage.setItem("mba_token", token);
      localStorage.setItem("mba_fullName", fullName);
      localStorage.setItem("mba_username", username);
      return { token, id, fullName, username };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Login failed" });
    }
  }
);

const initialState = {
  token: localStorage.getItem("mba_token") || null,
  fullName: localStorage.getItem("mba_fullName") || null,
  username: localStorage.getItem("mba_username") || null,
  isAuthenticated: !!localStorage.getItem("mba_token"),
  loading: false,
  error: null,
};

const mbaAuthSlice = createSlice({
  name: "mbaAuth",
  initialState,
  reducers: {
    logoutMbaStudent: (state) => {
      state.token = null;
      state.fullName = null;
      state.username = null;
      state.isAuthenticated = false;
      localStorage.removeItem("mba_token");
      localStorage.removeItem("mba_fullName");
      localStorage.removeItem("mba_username");
    },
    clearMbaError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginMbaStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginMbaStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.fullName = action.payload.fullName;
        state.username = action.payload.username;
      })
      .addCase(loginMbaStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.payload?.message || "Login failed";
      });
  },
});

export const { logoutMbaStudent, clearMbaError } = mbaAuthSlice.actions;
export default mbaAuthSlice.reducer;
