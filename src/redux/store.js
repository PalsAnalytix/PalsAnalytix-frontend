import { configureStore } from '@reduxjs/toolkit'
import questionReducer from "./slices/questionsSlice";
import testsReducer from "./slices/testsSlice"
import testPageReducer  from "./slices/testPageSlice";
import authReducer from "./slices/authSlice";
import paymentReducer from "./slices/paymentSlice"

export const store = configureStore({
  reducer: {
    questions : questionReducer,
    tests: testsReducer,  
    testPage : testPageReducer,
    auth: authReducer,
    payment : paymentReducer,
  },
  
})

