import { configureStore } from '@reduxjs/toolkit'
import { Auth0Provider, Auth0Context } from '@auth0/auth0-react';
import questionReducer from "./slices/questionsSlice";
import testsReducer from "./slices/testsSlice"
import testPageReducer  from "./slices/testPageSlice";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    questions : questionReducer,
    tests: testsReducer,  
    testPage : testPageReducer,
    user : userReducer,
    auth: authReducer,
  },
  
})

