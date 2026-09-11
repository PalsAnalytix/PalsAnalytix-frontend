import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, clearError } from "../../redux/slices/authSlice.js";
import { Menu, X, ChevronDown } from "lucide-react";
import LoginModal from "../auth/LoginModal.jsx";
import SignupModal from "../auth/SignupModal.jsx";
import PalsAnalytixLogo from "../../assets/palsanalytix-logo.png";
import PalsAnalytixWordmark from "../../assets/palsanalytix-wordmark.png";

const COURSE_LINKS = [
  { name: "CFA", path: "/cfa" },
  { name: "FRM", path: "/frm" },
  { name: "SCR", path: "/scr" },
  { name: "Excel", path: "/excel" },
  { name: "Advanced Excel", path: "/advanced-excel" },
  { name: "Excel for Finance", path: "/excel-for-finance" },
];

const NAV_ITEMS = [
  { name: "Evaluation", path: "/mba-evaluation" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact" },
  { name: "Resources", path: "/resources" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
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
    setCoursesOpen(false);
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

  const visibleCourseLinks = COURSE_LINKS.filter((item) => item.path !== location.pathname);
  const visibleNavItems = NAV_ITEMS.filter((item) => item.path !== location.pathname);

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
            <div className="flex items-center justify-between gap-8 py-4">
              <Link to="/" className="flex items-center gap-3 shrink-0">
                <img src={PalsAnalytixLogo} alt="PalsAnalytix" className="h-16 w-auto" />
                <div className="flex flex-col items-center">
                  <img src={PalsAnalytixWordmark} alt="palsanalytix" className="h-9 w-auto" />
                  <div className="mt-0.5 font-mono text-[11px] tracking-wide text-sand-500 leading-tight">
                    विद्याधनं सर्वधनप्रधानम् ॥
                  </div>
                </div>
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center space-x-6">
                <div
                  className="relative"
                  onMouseEnter={() => setCoursesOpen(true)}
                  onMouseLeave={() => setCoursesOpen(false)}
                >
                  <button className="flex items-center gap-1 text-sand-300 text-lg hover:text-accent-orange2 transition-colors">
                    Courses
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${coursesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {coursesOpen && (
                    <div className="absolute left-0 top-full pt-2 w-56 z-50">
                      <div className="bg-ink border border-line rounded-md py-2 shadow-lg">
                        {visibleCourseLinks.map((course) => (
                          <button
                            key={course.name}
                            onClick={() => handleNavigation(course.path)}
                            className="block w-full text-left px-4 py-2 text-sand-300 hover:text-paper hover:bg-white/10 transition-colors"
                          >
                            {course.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {visibleNavItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className="text-sand-300 text-lg hover:text-accent-orange2 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
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

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div
                ref={mobileMenuRef}
                className="md:hidden py-4 space-y-4 border-t border-line"
              >
                <div className="flex flex-col space-y-4">
                  <div>
                    <button
                      onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                      className="flex items-center justify-between w-full text-left px-2 py-1 text-sand-300"
                    >
                      Courses
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${mobileCoursesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileCoursesOpen && (
                      <div className="mt-2 space-y-3 pl-4">
                        {visibleCourseLinks.map((course) => (
                          <button
                            key={course.name}
                            onClick={() => handleNavigation(course.path)}
                            className="block w-full text-left text-sand-400"
                          >
                            {course.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {visibleNavItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.path)}
                      className="text-sand-300 block w-full text-left px-2 py-1"
                    >
                      {item.name}
                    </button>
                  ))}
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
