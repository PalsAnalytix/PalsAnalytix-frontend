import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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

export const fetchWhatsAppQuizPreference = createAsyncThunk(
  "whatsappQuiz/fetchPreference",
  async (course, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/whatsapp-quiz/${course}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load preference");
    }
  }
);

export const saveWhatsAppQuizPreference = createAsyncThunk(
  "whatsappQuiz/savePreference",
  async ({ course, chapters, difficulty, questionsPerDay, active }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/whatsapp-quiz/${course}`, {
        chapters,
        difficulty,
        questionsPerDay,
        active,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to save preference");
    }
  }
);

const initialState = {
  preference: null,
  loading: false,
  saving: false,
  error: null,
  saveError: null,
  savedMessage: null,
};

const whatsappQuizSlice = createSlice({
  name: "whatsappQuiz",
  initialState,
  reducers: {
    clearWhatsAppQuizState: (state) => {
      state.preference = null;
      state.error = null;
      state.saveError = null;
      state.savedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWhatsAppQuizPreference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWhatsAppQuizPreference.fulfilled, (state, action) => {
        state.loading = false;
        state.preference = action.payload;
      })
      .addCase(fetchWhatsAppQuizPreference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load preference";
      })

      .addCase(saveWhatsAppQuizPreference.pending, (state) => {
        state.saving = true;
        state.saveError = null;
        state.savedMessage = null;
      })
      .addCase(saveWhatsAppQuizPreference.fulfilled, (state, action) => {
        state.saving = false;
        state.savedMessage = "Saved!";
        state.preference = { ...state.preference, ...action.payload.preference };
      })
      .addCase(saveWhatsAppQuizPreference.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload || "Failed to save preference";
      });
  },
});

export const { clearWhatsAppQuizState } = whatsappQuizSlice.actions;
export default whatsappQuizSlice.reducer;
