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

// Admin credentials

// Async thunks
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/signup`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/verify-otp`, {
        email,
        code: otp,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/login`, credentials);
      // console.log(response);

      if (response.data.user.isAdmin) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAdmin", response.data.user.isAdmin);
        return {
          ...response.data,
        };
      } else {
        const userResponse = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        let userData = userResponse.data.data;
        let ProgressMetrics = calculateProgress(userData);
        userData = {...userData, ProgressMetrics};
        localStorage.setItem("token", response.data.token);
        const res = {
          token: response.data.token,
          user: userData,
        };
        return res;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/forgot-password`, {
        phoneNumber,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ phoneNumber, otp, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/reset-password`, {
        phoneNumber,
        otp,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const admin = localStorage.getItem("isAdmin");

      // If admin, return early without fetching profile
      if (admin === "true") {
        return { isAdmin: true };
      }

      if (!token) {
        throw new Error("No token available");
      }

      const response = await axios.get(`${BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.data;
      let ProgressMetrics = calculateProgress(userData);
      return { ...userData, ProgressMetrics };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const calculateProgress = (userData) => {
  const { questions } = userData;
  const receivedCFAQuestions = questions.filter((q) =>
    q.question.courses.includes("CFA")
  ).length;
  const receivedFRMQuestions = questions.filter((q) =>
    q.question.courses.includes("FRM")
  ).length;
  const receivedSCRQuestions = questions.filter((q) =>
    q.question.courses.includes("SCR")
  ).length;
  const attemptedCFAQuestions = questions.filter(
    (q) => q.question.courses.includes("CFA") && q.attempted
  ).length;
  const attemptedFRMQuestions = questions.filter(
    (q) => q.question.courses.includes("FRM") && q.attempted
  ).length;
  const attemptedSCRQuestions = questions.filter(
    (q) => q.question.courses.includes("SCR") && q.attempted
  ).length;

  const ProgressMetrics = {
    courseWiseProgress: {
      CFA: {
        questionsReceived: receivedCFAQuestions,
        questionsAttempted: attemptedCFAQuestions,
      },
      FRM: {
        questionsReceived: receivedFRMQuestions,
        questionsAttempted: attemptedFRMQuestions,
      },
      SCR: {
        questionsReceived: receivedSCRQuestions,
        questionsAttempted: attemptedSCRQuestions,
      },
    },
  };

  return ProgressMetrics;
};

export const fetchSampleQuestions = createAsyncThunk(
  "auth/fetchSampleQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/api/random-questions`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserWhatsAppDetails = createAsyncThunk(
  "auth/updateWhatsApp",
  async (
    { userId, currentChapterForWhatsapp, currentCourseForWhatsapp },
    { dispatch }
  ) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/api/update_preference_Chapter/${userId}`,
        {
          currentChapterForWhatsapp,
          currentCourseForWhatsapp,
        }
      );

      const userData = response.data.data;

      let ProgressMetrics = calculateProgress(userData);
      return { ...userData, ProgressMetrics };
    } catch (error) {
      throw error;
    }
  }
);

export const attemptQuestion = createAsyncThunk(
  "auth/attemptQuestion",
  async ({ questionId, attemptDetails }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/api/user/attemptQuestion/${questionId}`,
        { attemptDetails }
      );
      const userData = response.data.data;
      const ProgressMetrics = calculateProgress(userData);
      return { ...userData, ProgressMetrics };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserPaymentDetails = createAsyncThunk(
  "auth/updateUserPaymentDetails",
  async ({ updatedUser }, { rejectWithValue }) => {
    try {
      return { updatedUser };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  resetPasswordStatus: "idle",
  whatsapp: null,
  sampleQuestions: [],
  sampleQuestionsLoading: false,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerified = false;
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
      state.resetPasswordStatus = "idle";
      state.error = null;
    },
    clearUserData: (state) => {
      state.user = null;
      state.whatsapp = null;
      state.sampleQuestions = [];
    },
    updateUserAfterSubscription: (state, action) => {
      if (state.user) {
        // Update only the subscription-related fields
        state.user = {
          ...state.user,
          currentSubscriptionPlan: action.payload.currentSubscriptionPlan,
          subscriptionDetails:
            action.payload.subscriptionDetails ||
            state.user.subscriptionDetails,
        };
      }
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Signup failed";
      })

      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAdmin = action.payload.user.isAdmin || false;
        state.error = null;

        if (state.isAdmin) {
          localStorage.setItem("isAdmin", "true");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetPasswordStatus = "pending";
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetPasswordStatus = "otpSent";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send OTP";
        state.resetPasswordStatus = "failed";
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetPasswordStatus = "completed";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password reset failed";
      })

      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;

        // If it's an admin, just mark as authenticated
        if (action.payload.isAdmin) {
          state.isAuthenticated = true;
          return;
        }

        state.user = action.payload;
        // console.log(state.user);
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user profile";
        state.isAuthenticated = false;
      })

      .addCase(fetchSampleQuestions.pending, (state) => {
        state.sampleQuestionsLoading = true;
      })
      .addCase(fetchSampleQuestions.fulfilled, (state, action) => {
        state.sampleQuestionsLoading = false;
        state.sampleQuestions = action.payload;
      })
      .addCase(fetchSampleQuestions.rejected, (state, action) => {
        state.sampleQuestionsLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch sample questions";
      })
      .addCase(updateUserWhatsAppDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserWhatsAppDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        // User profile will be updated by fetchUserProfile
      })
      .addCase(updateUserWhatsAppDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update WhatsApp details";
      })

      .addCase(attemptQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(attemptQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(attemptQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update question attempt";
      });
  },
});

export const {
  logout,
  clearError,
  resetAuthState,
  setAuthenticated,
  clearUserData,
} = authSlice.actions;

export const selectUserProfile = (state) => state.auth.user;
export const selectUserLoading = (state) => state.auth.loading;
export const selectUserError = (state) => state.auth.error;

export default authSlice.reducer;
