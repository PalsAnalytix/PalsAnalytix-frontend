import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Zap,
  Star,
  BarChart2,
  BookOpen,
  Users,
  Target,
  CheckCircle2,
  X,
  Layout,
  ClipboardCheck
} from "lucide-react";
import Navbar from "../components/common/Navbar";

const PricingCard = ({ plan, isCurrentPlan, isPopular, onSelect }) => {
  const getBadgeColor = () => {
    if (isCurrentPlan) return "bg-blue-100 text-blue-800";
    if (isPopular) return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
    return "";
  };

  const getIcon = () => {
    switch (plan.name) {
      case "Free":
        return <Star className="w-6 h-6 text-gray-400" />;
      case "Premium":
        return <Zap className="w-6 h-6 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`
        relative bg-white rounded-2xl shadow-lg p-8 
        ${isPopular ? "ring-2 ring-yellow-400 transform scale-105" : ""}
        transition-all duration-200 hover:shadow-xl
      `}
    >
      {(isPopular || isCurrentPlan) && (
        <span 
          className={`
            absolute -top-4 left-1/2 transform -translate-x-1/2
            ${getBadgeColor()}
            px-4 py-1 rounded-full text-sm font-medium
          `}
        >
          {isCurrentPlan ? "Current Plan" : "Most Popular"}
        </span>
      )}

      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">{getIcon()}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="flex items-center justify-center">
          <span className="text-4xl font-bold">₹{plan.price}</span>
          <span className="text-gray-500 ml-2">{plan.price > 0 ? "/month" : ""}</span>
        </div>
      </div>

      <div className="space-y-4">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">{feature}</span>
          </div>
        ))}
        {plan.limitations && plan.limitations.map((limitation, index) => (
          <div key={`limit-${index}`} className="flex items-start gap-3">
            <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-500">{limitation}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelect(plan)}
        disabled={isCurrentPlan}
        className={`
          w-full mt-8 py-4 px-6 rounded-xl font-medium text-center
          transition-all duration-200 transform hover:-translate-y-0.5
          ${isCurrentPlan 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"}
        `}
      >
        {isCurrentPlan ? "Current Plan" : "Get Started"}
      </button>
    </div>
  );
};

const FeatureComparison = () => {
  return (
    <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-center mb-8">Detailed Feature Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-4 px-6 text-left">Feature</th>
              <th className="py-4 px-6 text-center">Free Trial</th>
              <th className="py-4 px-6 text-center">Premium</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                feature: "Daily Practice Questions",
                free: "3 per day",
                premium: "10 per day",
              },
              {
                feature: "Mock Tests",
                free: "1 subject specific",
                premium: "Monthly subject specific",
              },
              {
                feature: "Trial Period",
                free: "2 weeks",
                premium: "Unlimited access",
              },
              {
                feature: "Dashboard Tracking",
                free: "Basic",
                premium: "Advanced",
              },
              {
                feature: "Question Bank Access",
                free: "Limited",
                premium: "Full Access",
              },
              {
                feature: "Performance Analytics",
                free: "Basic",
                premium: "Advanced",
              },
            ].map((row, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4 px-6 font-medium">{row.feature}</td>
                <td className="py-4 px-6 text-center">{row.free}</td>
                <td className="py-4 px-6 text-center">{row.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const currentPlan = user?.currentSubscriptionPlan || "FREE";

  const plans = [
    {
      name: "Free",
      price: 0,
      features: [
        "3 daily practice questions",
        "2 weeks free trial",
        "Basic dashboard tracking",
        "1 subject specific mock exam",
        "Limited question bank access",
      ],
      limitations: [
        "Limited to 2 weeks",
        "Basic analytics only",
        "No email support",
      ],
    },
    {
      name: "Premium",
      price: 199,
      features: [
        "10 daily practice questions",
        "Monthly subject specific mock tests",
        "Full question bank access",
        "Advanced performance analytics",
        "Course & chapter selection",
        "Priority email support",
        "Price inclusive of GST",
      ],
    },
  ];

  const handleSelect = (plan) => {
    if (plan.name === currentPlan) {
      return;
    }
    console.log(`Selected plan: ${plan.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Path to Success
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Access premium study materials and mock tests through our comprehensive dashboard
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Layout className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Interactive Dashboard</h3>
            <p className="text-gray-600">Access your personalized study portal</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <ClipboardCheck className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Subject Mock Tests</h3>
            <p className="text-gray-600">Regular subject-specific assessments</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <BarChart2 className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Performance Tracking</h3>
            <p className="text-gray-600">Detailed analytics and insights</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <BookOpen className="w-8 h-8 text-yellow-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Question Bank</h3>
            <p className="text-gray-600">Comprehensive practice materials</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              isCurrentPlan={currentPlan === plan.name.toUpperCase()}
              isPopular={plan.name === "Premium"}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <FeatureComparison />

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
          <p className="text-gray-600">
            Have questions? Check out our{" "}
            <button className="text-blue-500 hover:underline" onClick={()=>{
              navigate("/faq")
            }}>FAQ page</button>
            {" "}or{" "}
            <button className="text-blue-500 hover:underline" onClick={()=>{navigate("/contact")}}>contact us</button>
          </p>
        </div>
      </div>

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

export default PricingPage;