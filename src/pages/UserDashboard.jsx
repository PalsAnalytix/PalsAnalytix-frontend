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

const COURSE_LABELS = {
  CFA: "CFA",
  FRM: "FRM",
  SCR: "SCR",
  EXCEL: "Excel",
  ADVANCED_EXCEL: "Advanced Excel",
  EXCEL_FOR_FINANCE: "Excel for Finance",
};

const getActivePurchasedCourses = (user) => {
  if (!user?.coursePremium) return [];
  const now = new Date();
  const seen = new Set();
  const active = [];
  user.coursePremium.forEach((entry) => {
    if (entry.status === "ACTIVE" && new Date(entry.expiryDate) > now && !seen.has(entry.course)) {
      seen.add(entry.course);
      active.push({ code: entry.course, label: COURSE_LABELS[entry.course] || entry.course });
    }
  });
  return active;
};

// Enhanced StatCard with animation and improved visuals
const StatCard = ({ title, value, icon: Icon, color, change }) => {
  const isPositive = change > 0;

  return (
    <div className="bg-white rounded-lg border border-sand-200 p-4 hover:shadow-md transition-all duration-300 overflow-hidden relative group">
      <div className="absolute -right-4 -top-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className={`w-full h-full ${color.replace("bg-", "text-")}`} />
      </div>
      <div className="flex items-center gap-3 relative z-10">
                <div
          className={`p-2.5 rounded-lg ${color} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="w-5 h-5 text-charcoal" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-sand-600 font-medium">{title}</p>
          <div className="flex items-end justify-between mt-1">
            <p className="font-sora text-lg font-bold text-charcoal">{value}</p>
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

// Shared header band used across the dashboard's sub-cards
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="p-4 border-b border-sand-200 bg-sand-100">
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-accent-orange2" />
      <h2 className="font-sora text-base font-semibold text-charcoal">{title}</h2>
    </div>
  </div>
);

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
        return "bg-sand-100 text-sand-800 border-sand-200";
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
    <div className="bg-white rounded-lg border border-sand-200 overflow-hidden h-full">
      <div className="p-4 border-b border-sand-200 bg-sand-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-accent-yellow/20 rounded-full">
              <Star className="w-4 h-4 text-accent-orange2" />
            </div>
            <span className="font-sora text-base font-semibold text-charcoal">
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
          color="bg-accent-orange2"
        />
        <StatCard
          title="Attempted Questions"
          value={profile.stats.attemptedQuestions}
          icon={CheckCircle}
          color="bg-green-600"
        />
        <StatCard
          title="Average Time"
          value={`${Math.round(profile.stats.averageTime)}s`}
          icon={Clock}
          color="bg-accent-amber"
        />
        <StatCard
          title="Success Rate"
          value={`${profile.stats.successRate.toFixed(1)}%`}
          icon={TrendingUp}
          color="bg-accent-orange"
        />
      </div>

      <div className="p-6 space-y-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent-orange2" />
              <span className="text-sm font-medium text-sand-800">
                Current Plan
              </span>
            </div>
            <div className="flex items-center px-3 py-2 bg-accent-yellow/10 rounded-md">
              <span className="font-semibold text-accent-orange2">
                {subscription.currentSubscriptionPlan || "Free Plan"}
              </span>
              {subscription.currentSubscriptionPlan !== "FREE" && (
                <Award className="w-4 h-4 text-accent-orange2 ml-2" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sand-700" />
              <span className="text-sm font-medium text-sand-800">
                Current Chapter
              </span>
            </div>
            <div className="flex items-center px-3 py-2 bg-sand-100 rounded-md">
              <span className="font-medium text-charcoal">
                {subscription.currentChapterForWhatsapp || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-20 border-t border-sand-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-accent-amber/20 rounded-full">
                <Calendar className="w-4 h-4 text-accent-amber" />
              </div>
              <span className="text-sm font-medium text-sand-800">
                Expires On
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-medium text-charcoal bg-accent-amber/10 px-3 py-1 rounded-md">
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
                <button onClick={() => navigate("/pricing")} className="text-xs bg-brand-gradient-alt hover:brightness-105 transition text-charcoal font-semibold px-2 py-1 rounded-md">
                  Renew
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs mb-2 gap-1">
              <span className="text-sand-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Time Remaining
              </span>
              <span
                className={`font-medium ${
                  daysRemaining <= 7 ? "text-red-600" : "text-charcoal"
                }`}
              >
                {daysRemaining} days left
              </span>
            </div>
            <div className="relative w-full h-2.5 bg-sand-200 rounded-full overflow-hidden">
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
    <div className="bg-white rounded-lg border border-sand-200 overflow-hidden h-full">
      <SectionHeader icon={Activity} title="Your Progress" />
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
     const isPremium = profile?.currentSubscriptionPlan !== "FREE";
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  const purchasedCourses = profile ? getActivePurchasedCourses(profile) : [];

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  if (!isAuthenticated) return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex justify-center items-center font-sans">
        <div className="relative text-center">
          <div className="animate-spin h-8 w-8 border-3 border-accent-orange2 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-3 text-sm text-sand-700">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-paper font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* User Profile Card */}
                {/* User Profile Card */}
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="bg-white rounded-lg border border-sand-200 p-3 sm:p-4 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-gradient rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-xl font-bold text-charcoal">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-sora text-lg sm:text-xl font-semibold text-charcoal">
                  {profile.username}
                </h1>
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs sm:text-sm text-sand-700 flex items-center justify-center sm:justify-start">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    {profile.email}
                  </p>
                  <p className="text-xs sm:text-sm text-sand-700 flex items-center justify-center sm:justify-start">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    {profile.phoneNumber}
                  </p>
                </div>
              </div>
              {/*
                "Update Questions Preferences" button — removed from here for now,
                kept for reuse elsewhere later. The WhatsAppModal it opens is still
                wired up below (isWhatsAppModalOpen state + <WhatsAppModal />), just
                nothing currently triggers it.

                <button
                  onClick={() => setIsWhatsAppModalOpen(true)}
                  className="w-full sm:w-auto px-3 py-1.5 bg-green-600 text-white text-xs sm:text-sm rounded-[3px] hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  Update Questions Preferences
                </button>
              */}
            </div>
          </div>

          {purchasedCourses.length > 0 && (
            <div className="bg-white rounded-lg border border-sand-200 p-4 mb-4">
              <p className="text-sm font-semibold text-sand-700 mb-3">Your Courses</p>
              <div className="flex flex-wrap gap-3">
                {purchasedCourses.map((course) => (
                  <button
                    key={course.code}
                    onClick={() => navigate(`/dashboard/course/${course.code}`)}
                    className="px-5 py-2.5 bg-brand-gradient text-charcoal font-semibold rounded-[3px] hover:opacity-90 transition"
                  >
                    {course.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content area with requested layout */}
                  {purchasedCourses.length > 0 && (
            <div className="bg-white rounded-lg border border-sand-200 p-4 mb-4">
              <p className="text-sm font-semibold text-sand-700 mb-3">Your Courses</p>
              <div className="flex flex-wrap gap-3">
                {purchasedCourses.map((course) => (
                  <button
                    key={course.code}
                    onClick={() => navigate2(`/dashboard/course/${course.code}`)}
                    className="px-5 py-2.5 bg-brand-gradient text-charcoal font-semibold rounded-[3px] hover:opacity-90 transition"
                  >
                    {course.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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
          <div className="bg-white rounded-lg border border-sand-200 overflow-hidden">
            <SectionHeader icon={MessageSquare} title="Your Questions" />
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
