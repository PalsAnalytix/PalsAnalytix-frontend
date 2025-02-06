import React, { useState } from "react";
import { ArrowRight, Book, BarChart2, Users, Shield, Brain, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../redux/slices/authSlice";
import Navbar from "../components/common/Navbar";
import LoginModal from "../components/auth/LoginModal";
import SignupModal from "../components/auth/SignupModal";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
    <div className="flex items-center space-x-4 mb-4">
      <div className="bg-blue-100 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const CourseCard = ({ title, description, link, onClick }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-2" />
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      <button
        onClick={onClick}
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition duration-300 ease-in-out flex items-center justify-center"
      >
        Explore Curriculum
        <ArrowRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  </div>
);

const HeroSection = ({ onGetStarted }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 opacity-70" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-[60%] space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Master Your Financial Future with{" "}
                  <span className="text-blue-600">PalsAnalytix</span>
                </h1>
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-700">
                  CFA® | FRM® | SCR® Excellence
                </h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Join thousands of successful professionals who've transformed their careers through our innovative exam preparation platform. Expert-led content, adaptive learning, and real-time analytics combine to create your pathway to success.
              </p>
              <div className="flex flex-wrap gap-3">
                {["24/7 Expert Support", "Adaptive Learning", "Real-Time Analytics", "95% Pass Rate"].map((feature) => (
                  <span key={feature} className="bg-white px-4 py-2 rounded-full shadow-md text-gray-700 font-medium hover:bg-blue-50 transition-colors duration-300">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:w-[40%] w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-90">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {isAuthenticated ? "Welcome Back!" : "Start Your Journey Today"}
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span>Industry-recognized certifications</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Brain className="w-5 h-5 text-blue-500" />
                      <span>Personalized learning paths</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Target className="w-5 h-5 text-red-500" />
                      <span>Targeted exam preparation</span>
                    </div>
                  </div>
                  <button
                    onClick={isAuthenticated ? () => navigate("/dashboard") : onGetStarted}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center"
                  >
                    {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                    <ArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const dispatch = useDispatch();

  const features = [
    {
      icon: Book,
      title: "Comprehensive Content",
      description: "Access our extensive library of study materials, practice questions, and mock exams designed by industry experts."
    },
    {
      icon: BarChart2,
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics and insights, helping you focus on areas that need improvement."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join a community of driven professionals and get support from peers and mentors throughout your journey."
    }
  ];

  const courses = [
    {
      title: "CFA® Program",
      description: "Master investment analysis and portfolio management with our comprehensive CFA® preparation program.",
      link: "/cfa"
    },
    {
      title: "FRM® Certification",
      description: "Develop expertise in risk management with our specialized FRM® certification preparation course.",
      link: "/frm"
    },
    {
      title: "SCR® Certificate",
      description: "Lead the way in sustainable finance with our cutting-edge SCR® certificate program.",
      link: "/scr"
    }
  ];

  const handleModalControls = {
    close: () => {
      setShowAuthModal(false);
      setAuthMode("login");
      dispatch(clearError());
    },
    switchToRegister: () => {
      setAuthMode("register");
      dispatch(clearError());
    },
    switchToLogin: () => {
      setAuthMode("login");
      dispatch(clearError());
    },
    handleGetStarted: () => setShowAuthModal(true)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      <HeroSection onGetStarted={handleModalControls.handleGetStarted} />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Why Choose PalsAnalytix</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience a revolutionary approach to exam preparation that combines cutting-edge technology with expert guidance.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Professional Certifications</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our selection of industry-leading certification programs designed to accelerate your career.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <CourseCard
                key={index}
                {...course}
                onClick={() => navigate(course.link)}
              />
            ))}
          </div>
        </div>
      </section>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            {authMode === "login" ? (
              <LoginModal
                onSuccess={handleModalControls.close}
                onClose={handleModalControls.close}
                onSignupClick={handleModalControls.switchToRegister}
              />
            ) : (
              <SignupModal
                onSuccess={handleModalControls.switchToLogin}
                onClose={handleModalControls.close}
                onLoginClick={handleModalControls.switchToLogin}
              />
            )}
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} PalsAnalytix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;