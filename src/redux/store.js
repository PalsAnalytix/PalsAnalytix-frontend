import { configureStore } from '@reduxjs/toolkit'
import { Auth0Provider, Auth0Context } from '@auth0/auth0-react';
import questionReducer from "./slices/questionsSlice";
import testsReducer from "./slices/testsSlice"
import testPageReducer  from "./slices/testPageSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    questions : questionReducer,
    tests: testsReducer,  
    testPage : testPageReducer,
    userDetails : userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          auth0: Auth0Context
        },
      },
    }),
})