import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, clearError } from "../../redux/slices/authSlice.js";
import { Menu, X } from "lucide-react";
import LoginModal from "../auth/LoginModal.jsx";
import SignupModal from "../auth/SignupModal.jsx";
import PalsAnalytixLogo from "../../assets/palsanalytix-logo.png";
import PalsAnalytixWordmark from "../../assets/palsanalytix-wordmark.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleNavigation = (path) => {
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

  const NAV_ITEMS = [
    { name: "Courses", path: "/" },
    { name: "Evaluation", path: "/mba-evaluation" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact Us", path: "/contact" },
    { name: "Resources", path: "/resources" },
  ];

  const NavLinks = ({ className = "" }) => (
    <>
      {NAV_ITEMS.filter((item) => item.path !== location.pathname).map((item) => (
        <button
          key={item.name}
          onClick={() => handleNavigation(item.path)}
          className={`${className} hover:text-accent-orange2 transition-colors`}
        >
          {item.name}
        </button>
      ))}
    </>
  );

  const AccountSection = ({ isMobile = false }) => (
    <div className={`relative ${isMobile ? "w-full" : ""}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`rounded-[3px] bg-brand-gradient-alt text-charcoal font-semibold px-4 py-2 flex items-center justify-between hover:brightness-105 transition ${
          isMobile ? "w-full" : "mr-4"
        }`}
      >
        <span>Account</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
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
        } mt-2 bg-ink border border-line rounded-md py-1 z-50`}>
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="block w-full text-left px-4 py-2 text-sand-300 hover:text-paper hover:bg-white/10 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sand-300 hover:text-paper hover:bg-white/10 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div>
        <nav className="bg-ink border-b border-line">
          <div className="px-6 sm:px-12">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="flex items-center gap-3 shrink-0 cursor-pointer">
                <img src={PalsAnalytixLogo} alt="PalsAnalytix" className="h-16 w-auto" />
                <div className="flex flex-col items-center">
                  <img src={PalsAnalytixWordmark} alt="palsanalytix" className="h-9 w-auto" />
                  <div className="mt-0.5 font-mono text-[11px] tracking-wide text-sand-500 leading-tight">
                    विद्याधनं सर्वधनप्रधानम् ॥
                  </div>
                </div>
              </Link>

                 <div className="hidden md:flex items-center space-x-6">
                <NavLinks className="text-sand-300 text-lg" />
              </div>

              <div className="hidden md:flex items-center">
                {isAuthenticated ? (
                  <AccountSection />
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="rounded-[3px] bg-brand-gradient-alt text-charcoal font-semibold px-4 py-2 hover:brightness-105 transition"
                  >
                    Login/Register
                  </button>
                )}
              </div>

              <button
                className="md:hidden p-2 text-paper"
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

            {isMobileMenuOpen && (
              <div
                ref={mobileMenuRef}
                className="md:hidden py-4 space-y-4 border-t border-line"
              >
                <div className="flex flex-col space-y-4">
                  <NavLinks className="text-sand-300 block w-full text-left px-2 py-1" />
                </div>
                <div className="pt-4 border-t border-line">
                  {isAuthenticated ? (
                    <AccountSection isMobile={true} />
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="w-full rounded-[3px] bg-brand-gradient-alt text-charcoal font-semibold px-4 py-2 hover:brightness-105 transition"
                    >
                      Login/Register
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>
        <div className="h-1 bg-brand-gradient" />
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md mx-4">
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
