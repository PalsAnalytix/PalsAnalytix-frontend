// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../redux/slices/authSlice';
import { setAuthenticated } from '../redux/slices/authSlice'; // New action to update isAuthenticated

const useAuth = () => {
  const dispatch = useDispatch();
  // BUG FIX: this was `useSelector((state) => state.auth)`, which selects
  // the ENTIRE auth slice object -- always truthy, regardless of actual
  // login status, since any object (even {isAuthenticated: false}) is
  // truthy in JS. That broke the effect below (it never ran, since
  // `!isAuthenticated` was always false) AND broke App.jsx's
  // ProtectedRoute, which reads this hook's return value directly.
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(setAuthenticated(true)); // Set authenticated state if token exists
      dispatch(fetchUserProfile()); // Fetch the user's profile
    }
  }, [dispatch, isAuthenticated]);

  return isAuthenticated;
};

export default useAuth;
