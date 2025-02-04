import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  User, Mail, Phone, Bell, Clock, TrendingUp, BookOpen,
  CheckCircle, Star, Activity, Target
} from "lucide-react";
import { fetchUserProfile } from "../redux/slices/authSlice";
import Navbar from "../components/common/Navbar";
import WhatsAppModal from "../components/comp/WhatsappModal";
import UserQuestions from "../components/user/UserQuestions";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-lg font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  </div>
);

const SubscriptionCard = ({ subscription }) => {
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE": return "bg-green-100 text-green-800 border-green-200";
      case "EXPIRED": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2 font-medium">
          <Star className="w-4 h-4 text-yellow-500" />
          Subscription Details
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm bg-gray-50 rounded-md p-2">
          <span className="text-gray-600">Current Plan</span>
          <span className="font-medium text-blue-600">{subscription.currentSubscriptionPlan}</span>
        </div>
        <div className="flex items-center justify-between text-sm bg-gray-50 rounded-md p-2">
          <span className="text-gray-600">Current Chapter</span>
          <span className="font-medium">{subscription.currentChapterForWhatsapp || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status</span>
          <span className={`px-2 py-0.5 rounded-full text-sm border ${getStatusColor(subscription.status)}`}>
            {subscription.status}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm bg-gray-50 rounded-md p-2">
          <span className="text-gray-600">Expires On</span>
          <span className="font-medium">
            {new Date(subscription.subscriptionExpiryDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProgressCard = ({ metrics }) => (
  <div className="bg-white rounded-lg shadow-sm">
    <div className="p-3 border-b border-gray-100">
      <div className="flex items-center gap-2 font-medium">
        <Activity className="w-4 h-4 text-blue-500" />
        Performance Overview
      </div>
    </div>
    <div className="p-4 space-y-4">
      {Object.entries(metrics.courseWiseProgress).map(([course, progress]) => {
        const percentage = ((progress.correctAnswers / progress.questionsAttempted) * 100 || 0).toFixed(1);
        return (
          <div key={course} className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">{course}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-gray-700">{percentage}%</span>
                <Target className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>
            <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const UserDashboard = () => {
  const dispatch = useDispatch();
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const profile = user;
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  if (!isAuthenticated) return <Navigate to="/" />;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin h-6 w-6 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">{profile.username}</h1>
              <div className="mt-1 space-y-0.5">
                <p className="text-sm text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-1.5" />
                  {profile.email}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="w-4 h-4 mr-1.5" />
                  {profile.phoneNumber}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors flex items-center"
            >
              <Bell className="w-4 h-4 mr-1.5" />
              Update Questions Preferences
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard
            title="Total Questions"
            value={profile.performanceMetrics.totalQuestionsAttempted}
            icon={BookOpen}
            color="bg-blue-500"
          />
          <StatCard
            title="Correct Answers"
            value={profile.performanceMetrics.correctAnswers}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Average Time"
            value={`${Math.round(profile.performanceMetrics.averageTimePerQuestion)}s`}
            icon={Clock}
            color="bg-purple-500"
          />
          <StatCard
            title="Success Rate"
            value={`${((profile.performanceMetrics.correctAnswers / profile.performanceMetrics.totalQuestionsAttempted) * 100 || 0).toFixed(1)}%`}
            icon={TrendingUp}
            color="bg-indigo-500"
          />
        </div>

        {/* Subscription and Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <SubscriptionCard subscription={profile} />
          <ProgressCard metrics={profile.performanceMetrics} />
        </div>

        {/* Questions Section */}
        <div className="mt-4">
          <UserQuestions
            isSubscribed={profile.currentSubscriptionPlan !== "FREE"}
            questions={profile.questions}
          />
        </div>
      </div>

      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />
    </div>
  );
};

export default UserDashboard;