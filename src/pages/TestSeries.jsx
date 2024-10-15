import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ArrowRight } from "lucide-react";
import { Clock, FileText, Languages, Award } from "lucide-react";
import { fetchTests, setSelectedTest } from "../redux/slices/testsSlice"; // Import the fetchTests action
import StartTestDialog from "../components/StartTestDialog";

const HeroSection = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-green-100 to-blue-100 py-16 px-16 md:py-24 lg:py-32 min-h-[70vh] lg:min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Side - Text (70% on larger screens) */}
          <div className="text-center lg:text-left lg:w-[70%] mb-12 lg:mb-0 pr-0 lg:pr-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-800 mb-4 lg:mb-6 leading-tight">
              Unlock Your Potential with <br className="hidden lg:block" />
              <span className="text-green-600">Expert-Crafted</span> Test Series
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 mb-3 lg:mb-4">
              CFA | FRM | SCR Preparation
            </h2>
            <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-3xl mx-auto lg:mx-0">
              Elevate your financial career with our comprehensive,
              industry-leading test series. Designed by experts to maximize your
              success in CFA, FRM, and SCR exams. Our adaptive learning platform
              ensures you're always challenged at the right level.
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
            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-xl max-w-sm mx-auto">
              <h3 className="text-xl lg:text-2xl font-bold text-center text-blue-800 mb-4 lg:mb-6">
                {isAuthenticated ? 'Welcome Back!' : 'Join PalsAnalytix Today'}
              </h3>
              <div className="border-t border-gray-200 my-4 lg:my-6"></div>
              <p className="text-gray-600 text-center text-sm lg:text-base mb-4 lg:mb-6">
                {isAuthenticated
                  ? 'Visit your dashboard to explore more features and continue your learning journey.'
                  : 'Start your journey towards financial excellence with our proven test series. Get access to thousands of practice questions and mock exams.'}
              </p>
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center"
                >
                  Visit Dashboard
                  <ArrowRight className="ml-2" size={20} />
                </button>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
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
    </div>
  );
};


const TestItem = ({ test, onStart,id }) => {
  return (
    <div className="lg:w-4/6 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{test.name}</h2>
          {test.status === "attempted" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Score: {test.score}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="grid grid-cols-2 gap-4 w-2/3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {test.questions} Questions
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{test.marks} Marks</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{test.time} Mins</span>
            </div>
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Languages: English</span>
            </div>
          </div>
          <div className="w-1/3 text-right">
            {test.status === "attempted" ? (
              <button className="px-4 py-2 text-sm font-medium text-gray-900 bg-green-200 rounded-lg hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
                View Analysis
              </button>
            ) : (
              <button
                onClick={() => onStart(id)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Start Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TestList = () => {
  const dispatch = useDispatch();
  const { tests, selectedTestId } = useSelector((state) => state.tests);
  const loading = useSelector((state) => state.tests.loading);
  const error = useSelector((state) => state.tests.error);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  const handleTestSelect = (testId) => {
    dispatch(setSelectedTest(testId));
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    if (selectedTestId) {
      navigate(`/test/${selectedTestId}`);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    dispatch(setSelectedTest(null));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tests: {error}</div>;
  }

  return (
    <div className="container mx-auto px-16 py-8 mb-9">
      <h1 className="text-2xl font-bold mb-6">Available Tests</h1>
      <div className="space-y-4">
        {tests.map((test, index) => (
          <TestItem 
            key={index} 
            test={test} 
            id={test._id}
            onStart={handleTestSelect}
          />
        ))}
      </div>
      <StartTestDialog
        isOpen={isDialogOpen}
        onClose={handleCancel}
        onStart={handleConfirm}
      />
    </div>
  );
};

const TestSeries = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <TestList />
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

export default TestSeries;
