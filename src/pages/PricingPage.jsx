import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  ClipboardCheck,
  Loader,
  Award,
  Shield,
  Clock,
} from "lucide-react";
import axios from "axios";
import Navbar from "../components/common/Navbar";
import {
  createPaymentOrder,
  verifyPayment,
  upgradeUserSubscription,
  resetPaymentState,
} from "../redux/slices/paymentSlice";
import { toast } from "react-toastify";
import Footer from "../components/common/Footer";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const PricingCard = ({ plan, isCurrentPlan, isPopular, onSelect }) => {
  const getBadgeColor = () => {
    if (isCurrentPlan) return "bg-blue-100 text-blue-800";
    if (isPopular)
      return "bg-gradient-to-r from-purple-600 to-blue-600 text-white";
    return "";
  };

  const getIcon = () => {
    switch (plan.name) {
      case "Free":
        return <Star className="w-8 h-8 text-gray-400" />;
      case "Premium":
        return <Crown className="w-8 h-8 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        relative bg-white rounded-2xl shadow-xl p-8 border 
        ${isPopular ? "border-blue-500 transform scale-105" : "border-gray-100"}
        transition-all duration-300 hover:shadow-2xl
        ${isPopular ? "hover:shadow-blue-100" : "hover:shadow-gray-100"}
      `}
    >
      {(isPopular || isCurrentPlan) && (
        <span
          className={`
            absolute -top-4 left-1/2 transform -translate-x-1/2
            ${getBadgeColor()}
            px-6 py-1.5 rounded-full text-sm font-bold shadow-lg
          `}
        >
          {isCurrentPlan ? "Current Plan" : "Most Popular"}
        </span>
      )}

      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div
            className={`p-3 rounded-full ${
              isPopular ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            {getIcon()}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="flex items-center justify-center">
          <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            ₹{plan.price}
          </span>
          <span className="text-gray-500 ml-2 text-lg">
            {plan.price > 0 ? "/year" : ""}
          </span>
        </div>
        {plan.price > 0 && (
          <p className="text-sm text-gray-500 mt-2">Price inclusive of GST</p>
        )}
      </div>

      <div className="space-y-4 min-h-64">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3 group">
            <CheckCircle2
              className={`w-5 h-5 ${
                isPopular ? "text-blue-500" : "text-green-500"
              } flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}
            />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
        {plan.limitations &&
          plan.limitations.map((limitation, index) => (
            <div
              key={`limit-${index}`}
              className="flex items-start gap-3 opacity-75"
            >
              <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-500">{limitation}</span>
            </div>
          ))}
      </div>

      <button
        onClick={() => onSelect(plan)}
        disabled={isCurrentPlan}
        className={`
          w-full mt-8 py-4 px-6 rounded-xl font-bold text-center text-lg
          transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
          ${
            isCurrentPlan
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isPopular
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md"
              : "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 shadow-md"
          }
        `}
      >
        {isCurrentPlan ? "Current Plan" : "Get Started"}
      </button>
    </div>
  );
};

const TestimonialCard = ({ name, role, content, avatar }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
          {name.substring(0, 1)}
        </div>
        <div className="ml-4">
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <p className="text-gray-600">{content}</p>
      <div className="mt-4 flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
    </div>
  );
};

const FeatureComparison = () => {
  return (
    <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-3xl font-bold text-center mb-2">
        Detailed Feature Comparison
      </h3>
      <p className="text-gray-500 text-center mb-8">
        See exactly what you get with each plan
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-6 px-6 text-left font-bold text-gray-800">
                Feature
              </th>
              <th className="py-6 px-6 text-center font-bold text-gray-700">
                Free Trial
              </th>
              <th className="py-6 px-6 text-center font-bold bg-blue-50 rounded-t-lg text-blue-800">
                Premium
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                feature: "Daily Practice Questions",
                icon: <Target className="w-5 h-5 text-blue-500" />,
                free: "3 per day",
                premium: "10 per day",
              },
              {
                feature: "Mock Tests",
                icon: <ClipboardCheck className="w-5 h-5 text-blue-500" />,
                free: "1 subject specific",
                premium: "Monthly subject specific",
              },
              {
                feature: "Trial Period",
                icon: <Clock className="w-5 h-5 text-blue-500" />,
                free: "2 weeks",
                premium: "Unlimited access",
              },
              {
                feature: "Dashboard Tracking",
                icon: <Layout className="w-5 h-5 text-blue-500" />,
                free: "Basic",
                premium: "Advanced",
              },
              {
                feature: "Question Bank Access",
                icon: <BookOpen className="w-5 h-5 text-blue-500" />,
                free: "Limited",
                premium: "Full Access",
              },
              {
                feature: "Performance Analytics",
                icon: <BarChart2 className="w-5 h-5 text-blue-500" />,
                free: "Basic",
                premium: "Advanced",
              },
              {
                feature: "Email Support",
                icon: <Shield className="w-5 h-5 text-blue-500" />,
                free: "No",
                premium: "Priority Support",
              },
            ].map((row, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 ${
                  index % 2 === 1 ? "bg-gray-50" : ""
                }`}
              >
                <td className="py-6 px-6 font-medium flex items-center gap-3">
                  {row.icon}
                  <span>{row.feature}</span>
                </td>
                <td className="py-6 px-6 text-center">{row.free}</td>
                <td className="py-6 px-6 text-center bg-blue-50">
                  {row.premium}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I get started with my subscription?",
      answer:
        "After completing your payment, you'll immediately gain access to your plan features. Simply log in to your dashboard to start using all the resources available to you.",
    },
    {
      question: "Can I upgrade my plan later?",
      answer:
        "Yes, you can upgrade from the Free plan to the Premium plan at any time. Your new benefits will be available immediately after completing the upgrade process.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit and debit cards, UPI, net banking, and other payment methods supported by Razorpay.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "We offer a 7-day refund policy if you're not satisfied with our Premium plan. Please contact our support team within 7 days of your purchase to process your refund.",
    },
  ];

  return (
    <div className="mt-20">
      <h3 className="text-3xl font-bold text-center mb-2">
        Frequently Asked Questions
      </h3>
      <p className="text-gray-500 text-center mb-8">
        Find answers to common questions about our plans
      </p>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white"
          >
            <button
              className="w-full p-6 text-left font-semibold flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.question}
              <div
                className={`transform transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </button>
            <div
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-40 pb-6" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PricingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, currentOrder, paymentStatus, error, successMessage } =
    useSelector((state) => state.payment);
  const currentPlan = user?.currentSubscriptionPlan || "FREE";
  const [processingPayment, setProcessingPayment] = useState(false);
  // const [redirecting, setRedirecting] = useState(false);

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

  // Load the Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    const initRazorpay = async () => {
      const isLoaded = await loadRazorpayScript();
      if (isLoaded) {
      } else {
        toast.error("Failed to load payment gateway. Please try again later.");
      }
    };

    initRazorpay();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetPaymentState());
      setProcessingPayment(false);
    }

    if (successMessage) {
      toast.success(successMessage);
      dispatch(resetPaymentState());
    }
  }, [error, successMessage, dispatch]);

  // Handle successful payment verification
  useEffect(() => {
    if (paymentStatus === "success") {
      toast.success("Payment successful! Refreshing application...");

      // Use a small delay to show the success message before reloading
      const reloadTimer = setTimeout(() => {
        // Perform a full page reload
        window.location.href = "/dashboard";
      }, 1500);

      return () => clearTimeout(reloadTimer);
    }
  }, [paymentStatus]);

  const handleSelect = async (plan) => {
    if (plan.name === "Free" || plan.name.toUpperCase() === currentPlan) {
      return;
    }

    try {
      setProcessingPayment(true);

      // Create an order with Razorpay through our backend
      const orderResponse = await dispatch(createPaymentOrder(plan)).unwrap();

      if (!orderResponse || !orderResponse.order) {
        throw new Error("Failed to create payment order");
      }

      // Initialize Razorpay checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: "PalsAnalytix",
        description: `${plan.name} Plan Subscription`,
        order_id: orderResponse.order.id,
        handler: async function (response) {
          try {
            // Handle successful payment
            const paymentVerificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              user_id: user._id,
            };

            // Verify payment with backend
            const verifyPaymentData = await dispatch(
              verifyPayment(paymentVerificationData)
            ).unwrap();


            if (verifyPaymentData.success) {
              window.location.reload();
              window.location.href = "/dashboard";
            }
            setProcessingPayment(false);

            // The redirect will be handled by the useEffect that watches paymentStatus
          } catch (error) {
            toast.error("Error processing payment. Please contact support.");
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        notes: {
          user_id: user?.id || "",
          plan_name: plan.name,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

      // Handle Razorpay errors
      razorpayInstance.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setProcessingPayment(false);
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section with animated gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-purple-800 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl transform rotate-6"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm">
            Choose a plan that's right for you
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Invest in Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              Future Success
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Access premium study materials and mock tests through our
            comprehensive learning platform
          </p>
        </div>
      </div>

      {/* Features Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <Layout className="w-10 h-10 text-blue-500 mb-4 p-2 bg-blue-50 rounded-lg" />
            <h3 className="font-bold text-lg mb-2">Interactive Dashboard</h3>
            <p className="text-gray-600">
              Access your personalized study portal with progress tracking
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <ClipboardCheck className="w-10 h-10 text-green-500 mb-4 p-2 bg-green-50 rounded-lg" />
            <h3 className="font-bold text-lg mb-2">Subject Mock Tests</h3>
            <p className="text-gray-600">
              Regular subject-specific assessments to test your knowledge
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <BarChart2 className="w-10 h-10 text-purple-500 mb-4 p-2 bg-purple-50 rounded-lg" />
            <h3 className="font-bold text-lg mb-2">Performance Tracking</h3>
            <p className="text-gray-600">
              Detailed analytics and insights to improve your results
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <BookOpen className="w-10 h-10 text-yellow-500 mb-4 p-2 bg-yellow-50 rounded-lg" />
            <h3 className="font-bold text-lg mb-2">Question Bank</h3>
            <p className="text-gray-600">
              Comprehensive practice materials for effective learning
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div
        id="pricing-cards"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best suits your needs and start your journey to
            success today
          </p>
        </div>

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

        {/* Feature comparison, FAQ, etc. remaining code is unchanged */}
        <FAQ />

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Accelerate Your Learning?
          </h3>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of students who have already upgraded their study
            experience
          </p>
          <button
            onClick={() =>
              document
                .getElementById("pricing-cards")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg text-lg"
          >
            Get Started Today
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center bg-gray-50 px-6 py-3 rounded-lg">
            <Shield className="w-6 h-6 text-blue-500 mr-2" />
            <span className="text-gray-700 font-medium">Secure Payments</span>
          </div>
          <div className="flex items-center bg-gray-50 px-6 py-3 rounded-lg">
            <Clock className="w-6 h-6 text-blue-500 mr-2" />
            <span className="text-gray-700 font-medium">7-Day Refund</span>
          </div>
          <div className="flex items-center bg-gray-50 px-6 py-3 rounded-lg">
            <Award className="w-6 h-6 text-blue-500 mr-2" />
            <span className="text-gray-700 font-medium">Top-Rated Content</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
