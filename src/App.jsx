import React from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import CFAPage from "./pages/CFAPage";
import SCRPage from "./pages/SCRPage";
import UserDashboard from "./pages/UserDashboard";
import TestPage from "./pages/TestPage";
import PricingPage from "./pages/PricingPage";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useAuth from "./hooks/useAuth";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { fetchUserProfile } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useAuth(); // Using the custom hook
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.phoneNumber === import.meta.env.VITE_ADMIN_PHONE;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    return children;
  };

  // Admin Route component
  const AdminRoute = ({ children }) => {
    if (!isAuthenticated || !isAdmin) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/exams" element={<div>Exams Page</div>} />
          <Route path="/test-series" element={<div>Test Series Page</div>} />
          <Route path="/quizzes" element={<div>Quizzes Page</div>} />
          <Route path="/news" element={<div>News Page</div>} />
          <Route path="/cfa" element={<CFAPage />} />
          <Route path="/scr" element={<SCRPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/:id"
            element={
              <ProtectedRoute>
                <TestPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
