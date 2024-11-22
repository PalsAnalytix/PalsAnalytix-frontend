// redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axiosInstance.get(`${BASE_URL}/user/profile`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchQuestionStats = createAsyncThunk(
  "user/fetchQuestionStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/user/question-stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserWhatsAppDetails = createAsyncThunk(
  "user/updateWhatsApp",
  async (whatsappData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/api/user/whatsapp", whatsappData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  error: null,
  loading: true,
  questionStats : null,
  whatsapp: null,
  //   _id: null,
  //   name: "",
  //   email: "",
  //   phoneNumber: "",
  //   picture: "",
  //   isVerified: false,
  //   subscription: {
  //     id: "",
  //     status: "inactive",
  //     expiryDate: null,
  //     purchaseDate: null,
  //   },
  // },
  // questionStats: {
  //   CFA: 0,
  //   FRM: 0,
  //   SCR: 0,
  //   Total: 0,
  //   Right: 0,
  // },
  // whatsapp: {
  //   currentChapter: null,
  //   currentCourse: null,
  // },
  // loading: false,
  // error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserData: (state) => {
      Object.assign(state, initialState);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch profile";
      })

    // Fetch Question Stats
      .addCase(fetchQuestionStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionStats.fulfilled, (state, action) => {
        state.loading = false;
        state.questionStats = action.payload.data;
      })
      .addCase(fetchQuestionStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch question stats";
      })

    // Update WhatsApp Details
      .addCase(updateUserWhatsAppDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserWhatsAppDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.whatsapp = action.payload.data;
      })
      .addCase(updateUserWhatsAppDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update WhatsApp details";
      });
  },
});

export const { clearUserData, clearError } = userSlice.actions;

// Selectors


export default userSlice.reducer;