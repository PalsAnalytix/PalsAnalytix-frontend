import React from "react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LoginModal from "../components/auth/LoginModal";
import SignupModal from "../components/auth/SignupModal";
import { clearError } from "../redux/slices/authSlice";

const HeroSection = ({ onGetStarted }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log(isAuthenticated);
  const { profile } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-b from-green-100 to-blue-100 py-16 px-16 md:py-24 lg:py-32 min-h-[70vh] lg:min-h-screen flex items-center">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Side - Text (70% on larger screens) */}
          <div className="text-center lg:text-left lg:w-[70%] mb-12 lg:mb-0 pr-0 lg:pr-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-4 lg:mb-6 leading-tight">
              Elevate Your Financial Career with{" "}
              <br className="hidden lg:block" />
              <span className="text-green-600">PalsAnalytix</span>
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 mb-3 lg:mb-4">
              CFA® | FRM® | SCR® Exam Preparation
            </h2>
            <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-4xl mx-auto lg:mx-0 leading-relaxed">
              PalsAnalytix is your ultimate companion for CFA® Level 1, FRM®
              Level 1, and SCR® exam preparation. We've revolutionized the way
              professionals and students approach these challenging
              certifications, offering a unique blend of technology and
              expertise.
            </p>
            <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-4xl mx-auto lg:mx-0 leading-relaxed">
              Our innovative platform delivers daily questions via WhatsApp,
              Telegram, or email, adapting to your busy schedule. With instant
              results, progress tracking, and personalized mock exams, we're
              transforming exam preparation into a seamless, effective journey.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 lg:gap-3 text-sm lg:text-base font-medium text-gray-700">
              <span className="bg-white hover:bg-green-300 px-3 py-1 lg:px-4 lg:py-2 rounded-full shadow">
                Adaptive Learning
              </span>
              <span className="bg-white hover:bg-green-300 px-3 py-1 lg:px-4 lg:py-2 rounded-full shadow">
                Real-Time Analytics
              </span>
              <span className="bg-white hover:bg-green-300 px-3 py-1 lg:px-4 lg:py-2 rounded-full shadow">
                Expert Support
              </span>
              <span className="bg-white hover:bg-green-300 px-3 py-1 lg:px-4 lg:py-2 rounded-full shadow">
                Performance Tracking
              </span>
            </div>
          </div>

          {/* Right Side - Call to Action (30% on larger screens) */}
          <div className="lg:w-[30%]">
            <div className="bg-white shadow-xl rounded-lg p-6 lg:p-8 max-w-sm mx-auto">
              <h3 className="text-xl lg:text-2xl font-bold text-center text-blue-900 mb-4 lg:mb-6">
                {isAuthenticated ? "Welcome Back!" : "Join PalsAnalytix Today"}
              </h3>
              <div className="border-t border-gray-200 my-4 lg:my-6"></div>
              <p className="text-gray-600 text-center text-sm lg:text-base mb-4 lg:mb-6">
                {isAuthenticated
                  ? "Visit your dashboard to explore more features and continue your learning journey."
                  : "Embark on your journey to financial excellence. Access our comprehensive test series, featuring thousands of practice questions and tailored mock exams."}
              </p>
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center"
                >
                  Visit Dashboard
                  <ArrowRight className="ml-2" size={20} />
                </button>
              ) : (
                <button
                  onClick={onGetStarted} // Use the passed prop
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center"
                >
                  Get Started Today
                  <ArrowRight className="ml-2" size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const dispatch = useDispatch();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthMode("login");
    dispatch(clearError());
  };

  const handleLoginSuccess = () => {
    closeAuthModal();
  };

  const switchToRegister = () => {
    setAuthMode("register");
    dispatch(clearError());
  };

  const switchToLogin = () => {
    setAuthMode("login");
    dispatch(clearError());
  };

  // Add handler for Get Started button
  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100">
      <Navbar />

      {/* Hero Section */}
      <HeroSection onGetStarted={handleGetStarted} />
      {/* Why Choose PalsAnalytix Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-blue-900 mb-6 text-center">
            Why PalsAnalytix Stands Out
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center leading-relaxed mb-12">
            At PalsAnalytix, we've reimagined exam preparation. Our platform is
            designed to make your journey towards certification not just
            effective, but also engaging and tailored to your unique learning
            style.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Daily Questions",
                description:
                  "Select your focus areas and receive daily practice questions that adapt to your progress, ensuring you're always challenged at the right level.",
              },
              {
                title: "Comprehensive Feedback Loop",
                description:
                  "Receive instant results and in-depth explanations for each question, turning every interaction into a valuable learning opportunity.",
              },
              {
                title: "Extensive Question Bank",
                description:
                  "Access over 10,000 questions covering all exam topics, complemented by full-length mock exams that simulate the real testing environment.",
              },
              {
                title: "Multi-Platform Accessibility",
                description:
                  "Study seamlessly across WhatsApp, Telegram, email, and our web platform. Your prep adapts to your lifestyle, not the other way around.",
              },
              {
                title: "Advanced Analytics Dashboard",
                description:
                  "Track your performance with our detailed analytics. Identify strengths, pinpoint weaknesses, and watch your progress unfold in real-time.",
              },
              {
                title: "Stress-Reduction Focused",
                description:
                  "Our approach breaks down the daunting task of exam prep into manageable daily goals, building your confidence steadily as you progress.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-white to-blue-50 shadow-lg rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Offerings Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-100 to-green-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-blue-900 mb-6 text-center">
            Our Specialized Courses
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center leading-relaxed mb-12">
            PalsAnalytix offers targeted preparation for three of the most
            sought-after financial certifications. Each course is meticulously
            designed to align with the latest exam patterns and industry
            requirements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "CFA® (Chartered Financial Analyst)",
                link: "/cfa",
                description:
                  "The CFA® program is the gold standard for investment analysis and portfolio management. Our course covers all three levels, focusing on ethics, quantitative methods, economics, financial reporting, corporate finance, and more.",
              },
              {
                title: "FRM® (Financial Risk Manager)",
                link: "/frm",
                description:
                  "Recognized globally, the FRM® certification is crucial for professionals in risk management. Our comprehensive program covers market risk, credit risk, operational risk, and investment management, preparing you for both Part I and Part II of the exam.",
              },
              {
                title: "SCR® (Sustainability and Climate Risk)",
                link: "/scr",
                description:
                  "As sustainability becomes central to financial decision-making, the SCR® certification is increasingly valuable. Our course covers climate science, financial risks of climate change, and strategies for managing climate-related risks in various business contexts.",
              },
            ].map((course, index) => (
              <div key={index} className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-6">{course.description}</p>
                <button
                  onClick={() => {
                    handleNavigation(`${course.link}`);
                  }}
                  className="w-full bg-[#FEE154] text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition duration-300 ease-in-out"
                >
                  Explore Curriculum
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            {authMode === "login" ? (
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            &copy; 2024 PalsAnalytix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
