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

export const fetchSampleQuestions = createAsyncThunk(
  "user/fetchSampleQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/api/random-questions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
  async ({ userId, phoneNo, currentChapterForWhatsapp, currentCourseForWhatsapp }, { dispatch }) => {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/update_preference_Chapter/${userId}`, {
        phoneNo,
        currentChapterForWhatsapp,
        currentCourseForWhatsapp
      });
      
      // After successful update, fetch the updated profile
      dispatch(fetchUserProfile());
      
      return response.data;
    } catch (error) {
      throw error;
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
  sampleQuestions: [], // Add this new field
  sampleQuestionsLoading: false, // Add loading state for sample questions
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
    builder
      

      // Question Stats cases
      .addCase(fetchQuestionStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionStats.fulfilled, (state, action) => {
        state.loading = false;
        state.questionStats = action.payload.data;
        state.error = null;
      })
      .addCase(fetchQuestionStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch question stats";
      })

      // WhatsApp Update cases
      .addCase(updateUserWhatsAppDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserWhatsAppDetails.fulfilled, (state, action) => {
        state.loading = false;
        // We don't update the state here because fetchUserProfile will be called
        state.error = null;
      })
      .addCase(updateUserWhatsAppDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update WhatsApp details";
      });
  },
});

export const { clearUserData, clearError } = userSlice.actions;

// Selectors

// Add some helpful selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectQuestionStats = (state) => state.user.questionStats;


export default userSlice.reducer;