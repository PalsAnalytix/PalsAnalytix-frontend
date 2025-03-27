import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchTestWithQuestions = createAsyncThunk(
  'test/fetchTestWithQuestions',
  async (testId) => {
    const testResponse = await axios.get(`${BASE_URL}/api/tests/${testId}`);
    const testData = testResponse.data;
    console.log(testData)
    let questionsData = [];
    if (testData.questionsList.length > 0) {
      const questionsResponse = await axios.get(`${BASE_URL}/api/questions`, {
        params: { ids: testData.questionsList.join(',') }
      });
      questionsData = questionsResponse.data;
    }

    return { testData, questionsData };
  }
);

export const submitTest = createAsyncThunk(
  'test/submitTest',
  async (_, { getState }) => {
    const { questions } = getState().test;
    const response = await axios.post(`${BASE_URL}/api/submit-test`, { answers: questions });
    return response.data;
  }
);

const testPageSlice = createSlice({
  name: 'testPage',
  initialState: {
    testDetails: null,
    questions: [],
    currentQuestionIndex: 0,
    timeRemaining: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    decrementTimer: (state) => {
      state.timeRemaining -= 1;
    },
    answerQuestion: (state, action) => {
      const { questionId, answer } = action.payload;
      const question = state.questions.find(q => q._id === questionId);
      if (question) {
        question.status = 'answered';
        question.selectedAnswer = answer;
      }
      // Move to the next question if not at the end
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    markForReview: (state, action) => {
      const question = state.questions.find(q => q._id === action.payload);
      if (question) {
        question.status = 'review';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestWithQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestWithQuestions.fulfilled, (state, action) => {
        console.log(action.payload)
        state.loading = false;
        state.testDetails = action.payload.testData;
        state.timeRemaining = action.payload.testData.time * 60;
        state.questions = action.payload.questionsData.map(q => ({
          ...q,
          status: 'unanswered',
          selectedAnswer: null,
        }));
      })
      .addCase(fetchTestWithQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(submitTest.fulfilled, (state) => {
        state.timeRemaining = 0;
      });
  },
});

export const { setCurrentQuestion, decrementTimer, answerQuestion, markForReview } = testPageSlice.actions;

export default testPageSlice.reducer;