import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Async Thunks for API requests
export const fetchTests = createAsyncThunk('tests/fetchTests', async () => {
  const response = await axios.get(`${BASE_URL}/tests`);
  return response.data;
});

export const createTest = createAsyncThunk('tests/createTest', async (testData) => {
  console.log(testData);
  const response = await axios.post(`${BASE_URL}/tests`, testData);
  return response.data;
});

export const deleteTest = createAsyncThunk('tests/deleteTest', async (id) => {
  await axios.delete(`${BASE_URL}/tests/${id}`);
  return id;
});

const testsSlice = createSlice({
  name: 'tests',
  initialState: {
    tests: [],
    selectedTestId:null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedTest: (state, action) => {
      state.selectedTestId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.tests.push(action.payload);
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.tests = state.tests.filter(test => test._id !== action.payload);
      });
  },
});

export const { setSelectedTest } = testsSlice.actions;

export default testsSlice.reducer;

