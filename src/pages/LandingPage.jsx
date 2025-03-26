import React, { useState } from "react";
import {
  ArrowRight,
  Book,
  BarChart2,
  Users,
  Shield,
  Brain,
  Target,
  Check,
  Award,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../redux/slices/authSlice";
import Navbar from "../components/common/Navbar";
import LoginModal from "../components/auth/LoginModal";
import SignupModal from "../components/auth/SignupModal";
import { Helmet } from "react-helmet";
import Footer from "../components/common/Footer";
import LandingPageImage from "../assets/landing_page_image.jpg";

// SEO-optimized metadata component
const SEOMetadata = () => (
  <Helmet>
    <title>
      PalsAnalytix | Premier CFA, FRM & SCR Exam Preparation Platform
    </title>
    <meta
      name="description"
      content="Industry-leading exam preparation for CFA Level 1, 2, 3, FRM Part 1 & 2, and SCR certification. Access practice questions, mock exams, and expert-led content."
    />
    <meta
      name="keywords"
      content="CFA exam preparation, FRM certification, SCR certificate, CFA Level 1, CFA Level 2, CFA Level 3, practice questions, financial certification, mock exams, financial analyst, risk management, sustainable finance, exam prep, study materials"
    />
    <link rel="canonical" href="https://palsanalytix.com" />
    <meta
      property="og:title"
      content="PalsAnalytix | Premier CFA, FRM & SCR Exam Preparation"
    />
    <meta
      property="og:description"
      content="Accelerate your finance career with our comprehensive preparation platform for CFA, FRM, and SCR certifications."
    />
  </Helmet>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
    <div className="flex items-center space-x-4 mb-4">
      <div className="bg-blue-100 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
    <ul className="space-y-2">
      {title === "Comprehensive Content" && (
        <>
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
            <span className="text-gray-700">
              10,000+ practice questions aligned with exam curriculum
            </span>
          </li>
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
            <span className="text-gray-700">
              Expert-curated study materials updated for 2025
            </span>
          </li>
        </>
      )}
      {title === "Performance Analytics" && (
        <>
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
            <span className="text-gray-700">
              Personalized weakness identification algorithms
            </span>
          </li>
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
            <span className="text-gray-700">
              Custom study plans based on performance data
            </span>
          </li>
        </>
      )}
      {title === "Community Support" && (
        <>
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
            <span className="text-gray-700">
              Direct access to certified CFA/FRM/SCR instructors
            </span>
          </li>
          <li className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
            <span className="text-gray-700">
              Weekly live Q&A sessions with industry experts
            </span>
          </li>
        </>
      )}
    </ul>
  </div>
);

const CourseCard = ({ title, description, link, onClick }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-2" />
    <div className="p-6">
      <div className="bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full w-fit mb-3">
        95%+ Pass Rate
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      <div className="mb-6 space-y-2">
        {title === "CFA® Program" && (
          <>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-gray-700 text-sm">
                Comprehensive Level 1, 2 & 3 materials
              </span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-gray-700 text-sm">
                3,500+ CFA practice questions
              </span>
            </div>
          </>
        )}
        {title === "FRM® Certification" && (
          <>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-gray-700 text-sm">
                Part I & II comprehensive coverage
              </span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-gray-700 text-sm">
                3,000+ FRM practice questions
              </span>
            </div>
          </>
        )}
        {title === "SCR® Certificate" && (
          <>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-gray-700 text-sm">
                ESG integration frameworks
              </span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-gray-700 text-sm">
                2,500+ SCR practice questions
              </span>
            </div>
          </>
        )}
      </div>
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
              <div className="inline-block bg-blue-100 text-blue-700 rounded-full px-4 py-1 text-sm font-semibold tracking-wide mb-4">
                Trusted by 25,000+ finance professionals worldwide
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Master Your Financial Future with{" "}
                  <span className="text-blue-600">PalsAnalytix</span>
                </h1>
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-700">
                  Premier CFA® | FRM® | SCR® Examination Excellence
                </h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Join thousands of successful finance professionals who've
                transformed their careers through our innovative exam
                preparation platform. Our comprehensive study materials,
                extensive practice question banks, and mock exams are designed
                to maximize your chances of passing these prestigious
                certifications on your first attempt.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Shield, text: "24/7 Expert Support" },
                  { icon: Brain, text: "Adaptive Learning" },
                  { icon: BarChart2, text: "Real-Time Analytics" },
                  { icon: Award, text: "95% Pass Rate" },
                ].map((feature, index) => (
                  <span
                    key={index}
                    className="bg-white px-4 py-2 rounded-full shadow-md text-gray-700 font-medium hover:bg-blue-50 transition-colors duration-300 flex items-center"
                  >
                    <feature.icon className="w-5 h-5 mr-2 text-blue-600" />
                    {feature.text}
                  </span>
                ))}
              </div>
              <div className="pt-2">
                <p className="text-gray-700 mb-2 font-medium">
                  Used by professionals from:
                </p>
                <div className="flex flex-wrap gap-4 items-center opacity-80">
                  {[
                    "Goldman Sachs",
                    "JP Morgan",
                    "Morgan Stanley",
                    "BlackRock",
                    "Deloitte",
                  ].map((company) => (
                    <span key={company} className="text-gray-600 font-medium">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:w-[40%] w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-90">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {isAuthenticated
                    ? "Welcome Back!"
                    : "Start Your Certification Journey Today"}
                </h3>
                <div className="space-y-6">
                  <div className="space-y-3">
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
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-5 h-5 text-yellow-500" />
                      <span>10,000+ practice questions</span>
                    </div>
                  </div>
                  <button
                    onClick={
                      isAuthenticated
                        ? () => navigate("/dashboard")
                        : onGetStarted
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center"
                  >
                    {isAuthenticated
                      ? "Go to Dashboard"
                      : "Start Free Trial Today"}
                    <ArrowRight className="ml-2" />
                  </button>
                  <p className="text-sm text-gray-500 text-center">
                    No credit card required. 7-day free access to all materials.
                  </p>
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
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const dispatch = useDispatch();

  const features = [
    {
      icon: Book,
      title: "Comprehensive Content",
      description:
        "Access our extensive library of study materials, practice questions, and mock exams designed by industry experts with decades of experience in financial certification training.",
    },
    {
      icon: BarChart2,
      title: "Performance Analytics",
      description:
        "Track your progress with sophisticated analytics and insights, helping you identify and focus on areas that need improvement while optimizing your study time for maximum efficiency.",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Join a global community of driven finance professionals and get support from peers and certified mentors throughout your certification journey, available 24/7 via our platform.",
    },
  ];

  const courses = [
    {
      title: "CFA® Program",
      description:
        "Master investment analysis and portfolio management with our comprehensive CFA® preparation program covering all three levels of the certification process.",
      link: "/cfa",
    },
    {
      title: "FRM® Certification",
      description:
        "Develop expertise in financial risk management with our specialized FRM® certification preparation covering both Part I and Part II examination requirements.",
      link: "/frm",
    },
    {
      title: "SCR® Certificate",
      description:
        "Lead the way in sustainable finance with our cutting-edge SCR® certificate program that prepares you for the growing field of climate risk and responsible investing.",
      link: "/scr",
    },
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
    handleGetStarted: () => setShowAuthModal(true),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <SEOMetadata />
      <Navbar />
      <HeroSection onGetStarted={handleModalControls.handleGetStarted} />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Why Financial Professionals Choose PalsAnalytix
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience a revolutionary approach to financial certification
              exam preparation that combines cutting-edge technology with expert
              guidance from industry professionals.
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
            <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
              INDUSTRY-RECOGNIZED CERTIFICATIONS
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Accelerate Your Finance Career with Premier Certifications
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our selection of industry-leading certification
              programs designed to elevate your expertise and advance your
              career in the competitive financial sector.
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

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Ready to Accelerate Your Finance Career?
              </h2>
              <p className="text-xl opacity-90">
                Join over 25,000 finance professionals who have achieved
                certification success with PalsAnalytix.
              </p>
              <button
                onClick={
                  isAuthenticated
                    ? () => navigate("/pricing")
                    : handleModalControls.handleGetStarted
                }
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-4 px-8 rounded-xl text-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center"
              >
                {isAuthenticated ? "View Pricing" : "Start Free Trial"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">What You'll Get:</h3>
              <ul className="space-y-3">
                {[
                  "Full access to all study materials for 7 days",
                  "Practice question banks for your target certification",
                  "Performance analytics and progress tracking",
                  "Mock exam with detailed performance report",
                  "No credit card required for trial",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
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

      <Footer />
    </div>
  );
};

export default LandingPage;
