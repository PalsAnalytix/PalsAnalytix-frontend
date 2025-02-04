import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Admin credentials
const ADMIN_PHONE = "91123456789";
const ADMIN_PASSWORD = "123456789";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     console.log(token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export const loadUser = createAsyncThunk(
//   "auth/loadUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No token found");

//       const response = await axiosInstance.get("/user/profile");
//       return response.data;
//     } catch (error) {
//       localStorage.removeItem("token"); // Clear invalid token
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );


// Async thunks
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/signup`,
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/verify-otp`, {
        phone,
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
      const response = await axios.post(`${BASE_URL}/login`, credentials);

      console.log(response);
      
      if (response.data.user.isAdmin) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAdmin", response.data.user.isAdmin);
        return {
          ...response.data
        };
      }
      else{
        const userResponse = await axios.get(`${BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        console.log(userResponse);

        
        localStorage.setItem("token", response.data.token);
        const res = {
          token : response.data.token,
          user : userResponse.data.data
        }
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
      const response = await axios.post(
        `${BASE_URL}/forgot-password`,
        {
          phoneNumber,
        }
      );
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
      const response = await axios.post(`${BASE_URL}/reset-password`, {
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
      if(admin)return;
      if (token){
        const response = await axios.get(`${BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        
        return response.data.data;
      } 
      else{
        const response = await axios.get(`${BASE_URL}/user/profile`)
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
          localStorage.setItem('isAdmin', 'true');
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
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user profile";
        state.isAuthenticated = false;
      })
  },
});

export const { logout, clearError, resetAuthState, setAuthenticated  } = authSlice.actions;
export default authSlice.reducer;

