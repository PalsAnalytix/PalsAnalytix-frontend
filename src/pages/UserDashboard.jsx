import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Award,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  Bell,
  Clock,
  TrendingUp
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import WhatsAppModal from '../components/comp/WhatsappModal';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const SubscriptionCard = ({ subscription }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Subscription Details</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Plan</span>
          <span className="font-medium">{subscription.currentSubscriptionPlan}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status</span>
          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(subscription.status)}`}>
            {subscription.status}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Expiry Date</span>
          <span className="font-medium">
            {new Date(subscription.subscriptionExpiryDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProgressCard = ({ metrics }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
    <div className="space-y-4">
      {Object.entries(metrics.courseWiseProgress).map(([course, progress]) => (
        <div key={course}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{course}</span>
            <span className="text-sm font-medium text-gray-700">
              {((progress.correctAnswers / progress.questionsAttempted) * 100 || 0).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${(progress.correctAnswers / progress.questionsAttempted) * 100 || 0}%`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UserDashboard = () => {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const profile = (user);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* User Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
              <div className="mt-2 space-y-1">
                <p className="text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {profile.email}
                </p>
                <p className="text-gray-600 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {profile.phoneNumber}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
            >
              <Bell className="w-4 h-4 mr-2" />
              Update WhatsApp Preferences
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

        {/* Subscription and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubscriptionCard subscription={profile} />
          <ProgressCard metrics={profile.performanceMetrics} />
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