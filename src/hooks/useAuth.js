// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../redux/slices/authSlice';
import { setAuthenticated } from '../redux/slices/authSlice'; // New action to update isAuthenticated

const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth);

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
