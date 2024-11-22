import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, clearError } from "../../redux/slices/authSlice.js";
import LoginModal from "../auth/LoginModal.jsx";
import SignupModal from "../auth/SignupModal.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, token,user } = useSelector((state) => state.auth); // Also get isAuthenticated

  // console.log(isAuthenticated, user);
  
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const dropdownRef = useRef(null);

  const handleNavigation = (path) => {
    navigate(path);
    setDropdownOpen(false); // Close dropdown when navigating
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setDropdownOpen(false);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthMode('login');
    dispatch(clearError());
  };

  const handleLoginSuccess = () => {
    closeAuthModal();
    setDropdownOpen(false);
  };

  const switchToRegister = () => {
    setAuthMode('register');
    dispatch(clearError());
  };

  const switchToLogin = () => {
    setAuthMode('login');
    dispatch(clearError());
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Account button and dropdown
  const AccountSection = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="bg-[#FEE154] text-black px-4 py-2 rounded mr-4 flex items-center space-x-2"
      >
        <span>Account</span>
        <svg
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50">
          {/* <div className="px-4 py-2 text-sm text-gray-500 border-b">
            <>+</>{user?.phoneNumber}
          </div> */}
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav className="bg-white shadow-lg border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1
              className="text-xl font-bold text-blue-500 cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              PalsAnalytix
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleNavigation("/scr")}
              className="text-gray-700 hover:text-blue-500"
            >
              SCR®
            </button>
            <button
              onClick={() => handleNavigation("/cfa")}
              className="text-gray-700 hover:text-blue-500"
            >
              CFA®
            </button>
            <button
              onClick={() => handleNavigation("/frm")}
              className="text-gray-700 hover:text-blue-500"
            >
              FRM®
            </button>
            {/* <button
              onClick={() => handleNavigation("/testseries")}
              className="text-gray-700 hover:text-blue-500"
            >
              Test Series
            </button> */}
          </div>

          <div className="flex items-center relative">
            {isAuthenticated ? (
              <AccountSection />
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-[#FEE154] text-black px-4 py-2 rounded mr-4"
              >
                Login/Register
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            {authMode === 'login' ? (
              <LoginModal 
                onSuccess={handleLoginSuccess}
                onClose={closeAuthModal}
                onSignupClick={switchToRegister}
              />
            ) : (
              <SignupModal 
                onSuccess={switchToLogin}
                onClose={closeAuthModal}
                onLoginClick={switchToLogin}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;