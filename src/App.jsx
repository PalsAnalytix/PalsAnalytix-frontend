import React from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MbaLoginPage from "./pages/mba/MbaLoginPage";
import MbaDashboard from "./pages/mba/MbaDashboard";
import MbaTestPage from "./pages/mba/MbaTestPage";
import MbaResultsPage from "./pages/mba/MbaResultsPage";
import EnhancedFAQPage from "./pages/FAQ";
import AdminDashboard from "./pages/AdminDashboard";
import CFAPage from "./pages/CFAPage";
import SCRPage from "./pages/SCRPage";
import UserDashboard from "./pages/UserDashboard";
import TestPage from "./pages/TestPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactUs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useAuth from "./hooks/useAuth";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { fetchUserProfile } from "./redux/slices/authSlice";

function App() {
    const dispatch = useDispatch();
  const isAuthenticated = useAuth(); // Using the custom hook
  const { user, authChecked } = useSelector((state) => state.auth);
  const hasToken = !!localStorage.getItem("token");
    const mbaAuthenticated = useSelector((state) => state.mbaAuth.isAuthenticated);
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  // Protected Route component
    // While a saved login is still being verified after a page load/refresh, wait rather than guessing
  const AuthGate = ({ children }) => {
    if (hasToken && !authChecked) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading...
        </div>
      );
    }
    return children;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => (
    <AuthGate>
      {!isAuthenticated ? <Navigate to="/" /> : children}
    </AuthGate>
  );

  // Admin Route component
  const AdminRoute = ({ children }) => (
    <AuthGate>
      {!isAuthenticated || !isAdmin ? <Navigate to="/" /> : children}
    </AuthGate>
  );

    // MBA Student Route component
  const MbaProtectedRoute = ({ children }) => {
    if (!mbaAuthenticated) {
      return <Navigate to="/mba-evaluation" />;
    }
    return children;
  };
  
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/mba-evaluation" element={<MbaLoginPage />} />
          <Route
            path="/mba-evaluation/dashboard"
            element={
              <MbaProtectedRoute>
                <MbaDashboard />
              </MbaProtectedRoute>
            }
          />
          <Route
            path="/mba-evaluation/test/:testId"
            element={
              <MbaProtectedRoute>
                <MbaTestPage />
              </MbaProtectedRoute>
            }
          />
            <Route
            path="/mba-evaluation/results/:attemptId"
            element={
              <MbaProtectedRoute>
                <MbaResultsPage />
              </MbaProtectedRoute>
            }
          />
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
          <Route path="/resources" element={<div>Resources Page</div>} />
          <Route path="/test-series" element={<div>Test Series Page</div>} />
          <Route path="/quizzes" element={<div>Quizzes Page</div>} />
          <Route path="/news" element={<div>News Page</div>} />
          <Route path="/cfa" element={<CFAPage />} />
          <Route path="/scr" element={<SCRPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/FAQ" element={<EnhancedFAQPage />} />

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
