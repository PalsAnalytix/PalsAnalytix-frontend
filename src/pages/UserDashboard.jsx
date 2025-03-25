import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Bell,
  Clock,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Star,
  Activity,
  Target,
  MessageSquare,
  Calendar,
  Shield,
  CreditCard,
  Award,
} from "lucide-react";
import { fetchUserProfile } from "../redux/slices/authSlice";
import Navbar from "../components/common/Navbar";
import WhatsAppModal from "../components/comp/WhatsappModal";
import UserQuestions from "../components/user/UserQuestions";
import { StreakCalendar } from "../components/user/PremiumCalendar";
import Footer from "../components/common/Footer";
import { ProgressChart } from "../components/user/ProgressCard";
import { useNavigate } from "react-router-dom";

// Enhanced StatCard with animation and improved visuals
const StatCard = ({ title, value, icon: Icon, color, change }) => {
  const isPositive = change > 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden relative group">
      <div className="absolute -right-4 -top-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className={`w-full h-full ${color.replace("bg-", "text-")}`} />
      </div>
      <div className="flex items-center gap-3 relative z-10">
        <div
          className={`p-2.5 rounded-lg ${color} transform transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <div className="flex items-end justify-between mt-1">
            <p className="text-lg font-bold text-gray-800">{value}</p>
            {change !== undefined && (
              <div
                className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full ${
                  isPositive
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {isPositive ? "↑" : "↓"} {Math.abs(change)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced SubscriptionCard with improved visuals and responsiveness
const SubscriptionCard = ({ subscription, profile }) => {
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "EXPIRED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate days remaining until subscription expires
  const today = new Date();
  const expiryDate = new Date(subscription.subscriptionExpiryDate);
  const daysRemaining = Math.max(
    0,
    Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
  );

  // Determine progress bar width for subscription time remaining
  const totalDays = 30; // Assuming monthly subscription
  const progressWidth = Math.min(100, (daysRemaining / totalDays) * 100);

  // Determine color based on days remaining
  const getTimeRemainingColor = () => {
    if (daysRemaining > 14) return "bg-green-500";
    if (daysRemaining > 7) return "bg-yellow-500";
    return "bg-red-500";
  };

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden h-full">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-full">
              <Star className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-base font-semibold text-gray-800">
              Your Subscription
            </span>
          </div>
          <div
            className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(
              subscription.subscriptionStatus || "ACTIVE"
            )}`}
          >
            {subscription.subscriptionStatus || "ACTIVE"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <StatCard
          title="Total Questions"
          value={profile.stats.totalQuestions}
          icon={BookOpen}
          color="bg-blue-500"
          // change={5}
        />
        <StatCard
          title="Attempted Questions"
          value={profile.stats.attemptedQuestions}
          icon={CheckCircle}
          color="bg-green-500"
          // change={3.7}
        />
        <StatCard
          title="Average Time"
          value={`${Math.round(profile.stats.averageTime)}s`}
          icon={Clock}
          color="bg-purple-500"
          // change={-2.1}
        />
        <StatCard
          title="Success Rate"
          value={`${profile.stats.successRate.toFixed(1)}%`}
          icon={TrendingUp}
          color="bg-indigo-500"
          // change={1.4}
        />
      </div>

      <div className="p-6 space-y-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                Current Plan
              </span>
            </div>
            <div className="flex items-center px-3 py-2 bg-blue-50 rounded-md">
              <span className="font-semibold text-blue-700">
                {subscription.currentSubscriptionPlan || "Free Plan"}
              </span>
              {subscription.currentSubscriptionPlan !== "FREE" && (
                <Award className="w-4 h-4 text-blue-500 ml-2" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">
                Current Chapter
              </span>
            </div>
            <div className="flex items-center px-3 py-2 bg-indigo-50 rounded-md">
              <span className="font-medium text-indigo-700">
                {subscription.currentChapterForWhatsapp || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-20 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 rounded-full">
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Expires On
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-medium text-gray-800 bg-amber-50 px-3 py-1 rounded-md">
                {subscription.subscriptionExpiryDate
                  ? new Date(
                      subscription.subscriptionExpiryDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>

              {daysRemaining <= 7 && (
                <button onClick={() => navigate("/pricing")} className="text-xs bg-blue-500 hover:bg-blue-600 transition-colors text-white px-2 py-1 rounded-md">
                  Renew
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs mb-2 gap-1">
              <span className="text-gray-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Time Remaining
              </span>
              <span
                className={`font-medium ${
                  daysRemaining <= 7 ? "text-red-600" : "text-gray-800"
                }`}
              >
                {daysRemaining} days left
              </span>
            </div>
            <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${getTimeRemainingColor()}`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ProgressComponent with the same design aesthetics
const ProgressComponent = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-semibold text-gray-800">
            Your Progress
          </h2>
        </div>
      </div>
      <div className="p-4 h-full">
        <ProgressChart />
      </div>
    </div>
  );
};

// Enhanced UserDashboard with the exact layout requested
const UserDashboard = () => {
  const dispatch = useDispatch();
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const profile = user;
  // console.log(profile);
  const isPremium = profile?.currentSubscriptionPlan !== "FREE";
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
        <div className="relative">
          <div className="animate-spin h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-3 text-sm text-gray-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* User Profile Card */}
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-xl font-bold text-white">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {profile.username}
                </h1>
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center sm:justify-start">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    {profile.email}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center sm:justify-start">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    {profile.phoneNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="w-full sm:w-auto px-3 py-1.5 bg-green-500 text-white text-xs sm:text-sm rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                Update Questions Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Main content area with requested layout */}
        <div className="space-y-6">
          {/* Subscription and Progress side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SubscriptionCard subscription={profile} profile={profile} />
            <ProgressComponent/>
          </div>

          {/* Streak Calendar below */}
          <StreakCalendar isPremium={isPremium} questions={profile.questions} />

          {/* Questions section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-semibold text-gray-800">
                  Your Questions
                </h2>
              </div>
            </div>
            <div>
              <UserQuestions
                isSubscribed={isPremium}
                questions={profile.questions}
              />
            </div>
          </div>
        </div>
      </div>

      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default UserDashboard;
