import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, clearError } from "../../redux/slices/authSlice.js";
import { Menu, X } from "lucide-react";
import LoginModal from "../auth/LoginModal.jsx";
import SignupModal from "../auth/SignupModal.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleNavigation = (path) => {
    // Check if the path is /dashboard and handle admin redirect
    if (path === '/dashboard') {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      navigate(isAdmin ? '/admin' : '/dashboard');
    } else {
      navigate(path);
    }
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const NavLinks = ({ className = "" }) => (
    <>
      <button
        onClick={() => handleNavigation("/scr")}
        className={`${className} hover:text-blue-500`}
      >
        SCR®
      </button>
      <button
        onClick={() => handleNavigation("/cfa")}
        className={`${className} hover:text-blue-500`}
      >
        CFA®
      </button>
      <button
        onClick={() => handleNavigation("/pricing")}
        className={`${className} hover:text-blue-500`}
      >
        Pricing
      </button>
      <button
        onClick={() => handleNavigation("/faq")}
        className={`${className} hover:text-blue-500`}
      >
        FAQ
      </button>
      <button
        onClick={() => handleNavigation("/contact")}
        className={`${className} hover:text-blue-500`}
      >
        Contact-Us
      </button>
    </>
  );

  const AccountSection = ({ isMobile = false }) => (
    <div className={`relative ${isMobile ? "w-full" : ""}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`bg-[#FEE154] text-black px-4 py-2 rounded flex items-center justify-between ${
          isMobile ? "w-full" : "mr-4"
        }`}
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
        <div className={`${
          isMobile ? "w-full" : "absolute right-0 w-48"
        } mt-2 bg-white shadow-lg rounded-md py-1 z-50`}>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <h1
              className="text-xl font-bold text-blue-500 cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              PalsAnalytix
            </h1>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLinks className="text-gray-700" />
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <AccountSection />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#FEE154] text-black px-4 py-2 rounded"
                >
                  Login/Register
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden py-4 space-y-4"
            >
              <div className="flex flex-col space-y-4">
                <NavLinks className="text-gray-700 block w-full text-left px-2 py-1" />
              </div>
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <AccountSection isMobile={true} />
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-[#FEE154] text-black px-4 py-2 rounded"
                  >
                    Login/Register
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
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