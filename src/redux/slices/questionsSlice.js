import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async () => {
    try {
      const response = await axios.get(`${BASE_URL}/questions`);
      console.log("Axios response:", response); // Log the full response object
      return response.data; // This should contain the questions
    } catch (error) {
      console.error("Error fetching questions:", error); // Log the error for debugging
      throw error; // Re-throw the error to handle it in the slice
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'questions/deleteQuestion',
  async (id) => {
    await axios.delete(`${BASE_URL}/question/${id}`);
    return id;
  }
);

export const addQuestion = createAsyncThunk(
  "questions/addQuestion",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/addquestion`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        return response.data; // This data will be available in the fulfilled state
      } else {
        return rejectWithValue("Error adding question");
      }
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to add question");
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'questions/updateQuestion',
  async ({ id, updatedQuestion }) => {
    const response = await axios.put(`${BASE_URL}/question/${id}`, updatedQuestion);
    return response.data;
  }
);

const calculateStats = (questions) => {
  const stats = {
    totalQuestions: questions.length,
    frmCount: 0,
    scrCount: 0,
    cfaCount: 0,
  };

  questions.forEach(question => {
    let courses = [];

    // If courses is already an array, use it directly
    if (Array.isArray(question.courses)) {
      courses = question.courses;
    } else if (typeof question.courses === 'string') {
      // If it's a string, handle as a fallback, assuming a single course
      courses = [question.courses];
    }

    // Count occurrences of each course type
    if (courses.includes('FRM')) stats.frmCount++;
    if (courses.includes('SCR')) stats.scrCount++;
    if (courses.includes('CFA')) stats.cfaCount++;
  });

  return stats;
};


const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    stats: {
      totalQuestions: 0,
      frmCount: 0,
      scrCount: 0,
      cfaCount: 0,
    },
    activeTab: 'questions', // Add activeTab to manage tab selection
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setAvailableQuestions: (state, action) => {
      state.items = action.payload;
      state.stats = calculateStats(state.items);  // Update stats when new questions are loaded
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.stats = calculateStats(state.items);
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addQuestion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);  // Add the newly created question to the state
        state.stats = calculateStats(state.items);
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Error adding question';
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.items.findIndex(question => question._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.stats = calculateStats(state.items);
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter(question => question._id !== action.payload);
        state.stats = calculateStats(state.items);
      });
  },
});

export const { setActiveTab, setAvailableQuestions } = questionsSlice.actions;

export default questionsSlice.reducer;
