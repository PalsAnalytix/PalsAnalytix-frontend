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

// Async thunks

export const fetchAvailableCount = createAsyncThunk(
  "assignment/fetchAvailableCount",
  async ({ course, chapters = [], difficulty }, { rejectWithValue }) => {
    try {
      const params = { course, difficulty };
      if (chapters.length > 0) params.chapters = chapters.join(",");
      const response = await axiosInstance.get(`/api/assignments/available-count`, {
        params,
      });
      return response.data.count;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to check available questions");
    }
  }
);

export const createAssignment = createAsyncThunk(
  "assignment/create",
  async ({ course, chapters = [], difficulty, numQuestions }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/assignments`, {
        course,
        chapters,
        difficulty,
        numQuestions,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create assignment");
    }
  }
);

export const fetchAssignment = createAsyncThunk(
  "assignment/fetch",
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load assignment");
    }
  }
);

export const submitAssignment = createAsyncThunk(
  "assignment/submit",
  async ({ assignmentId, answers, totalTimeSpent }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/assignments/${assignmentId}/submit`,
        { answers, totalTimeSpent }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit assignment");
    }
  }
);

export const fetchAssignmentReview = createAsyncThunk(
  "assignment/fetchReview",
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/assignments/${assignmentId}/review`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load review");
    }
  }
);

export const fetchAssignmentHistory = createAsyncThunk(
  "assignment/fetchHistory",
  async (course, { rejectWithValue }) => {
    try {
      const params = course ? { course } : {};
      const response = await axiosInstance.get(`/api/assignments/history`, { params });
      return response.data.history;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load history");
    }
  }
);

const initialState = {
  availableCount: null,
  availableCountLoading: false,

  currentAssignment: null, // the active/resumed assignment (setup response or fetch response)
  creatingAssignment: false,
  createError: null,

  submitting: false,
  submitError: null,
  submitResult: null, // { assignmentId, score, numQuestions, totalTimeSpent }

  history: [],
  historyLoading: false,

  review: null,
  reviewLoading: false,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
      state.submitResult = null;
      state.submitError = null;
    },
    clearAvailableCount: (state) => {
      state.availableCount = null;
    },
    clearReview: (state) => {
      state.review = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableCount.pending, (state) => {
        state.availableCountLoading = true;
      })
      .addCase(fetchAvailableCount.fulfilled, (state, action) => {
        state.availableCountLoading = false;
        state.availableCount = action.payload;
      })
      .addCase(fetchAvailableCount.rejected, (state) => {
        state.availableCountLoading = false;
        state.availableCount = null;
      })

      .addCase(createAssignment.pending, (state) => {
        state.creatingAssignment = true;
        state.createError = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.creatingAssignment = false;
        state.currentAssignment = action.payload;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.creatingAssignment = false;
        state.createError = action.payload || "Failed to create assignment";
      })

      .addCase(fetchAssignment.pending, (state) => {
        state.creatingAssignment = true;
        state.createError = null;
      })
      .addCase(fetchAssignment.fulfilled, (state, action) => {
        state.creatingAssignment = false;
        state.currentAssignment = action.payload;
      })
      .addCase(fetchAssignment.rejected, (state, action) => {
        state.creatingAssignment = false;
        state.createError = action.payload || "Failed to load assignment";
      })

      .addCase(submitAssignment.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitResult = action.payload;
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload || "Failed to submit assignment";
      })

      .addCase(fetchAssignmentReview.pending, (state) => {
        state.reviewLoading = true;
      })
      .addCase(fetchAssignmentReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.review = action.payload;
      })
      .addCase(fetchAssignmentReview.rejected, (state) => {
        state.reviewLoading = false;
        state.review = null;
      })

      .addCase(fetchAssignmentHistory.pending, (state) => {
        state.historyLoading = true;
      })
      .addCase(fetchAssignmentHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload;
      })
      .addCase(fetchAssignmentHistory.rejected, (state) => {
        state.historyLoading = false;
        state.history = [];
      });
  },
});

export const { clearCurrentAssignment, clearAvailableCount, clearReview } =
  assignmentSlice.actions;

export default assignmentSlice.reducer;
