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
  const getBadgeClasses = () => {
    if (isCurrentPlan) return "bg-accent-yellow/20 text-accent-orange2 border border-accent-orange2/30";
    if (isPopular) return "bg-brand-gradient-alt text-charcoal";
    return "";
  };

  const getIcon = () => {
    switch (plan.name) {
      case "Free":
        return <Star className="w-8 h-8 text-sand-500" />;
      case "Premium":
        return <Crown className="w-8 h-8 text-accent-amber" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        relative bg-white rounded-lg p-8 border
        ${isPopular ? "border-accent-orange2 transform scale-105" : "border-sand-200"}
        transition-all duration-300 hover:shadow-lg
      `}
    >
      {(isPopular || isCurrentPlan) && (
        <span
          className={`
            absolute -top-4 left-1/2 transform -translate-x-1/2
            ${getBadgeClasses()}
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
              isPopular ? "bg-accent-yellow/10" : "bg-sand-100"
            }`}
          >
            {getIcon()}
          </div>
        </div>
        <h3 className="font-sora text-2xl font-bold text-charcoal mb-2">{plan.name}</h3>
        <div className="flex items-center justify-center">
          <span className="font-sora text-5xl font-bold text-charcoal">
            ₹{plan.price}
          </span>
          <span className="text-sand-600 ml-2 text-lg">
            {plan.price > 0 ? "/year" : ""}
          </span>
        </div>
        {plan.price > 0 && (
          <p className="text-sm text-sand-600 mt-2">Price inclusive of GST</p>
        )}
      </div>

      <div className="space-y-4 min-h-64">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3 group">
            <CheckCircle2
              className={`w-5 h-5 ${
                isPopular ? "text-accent-orange2" : "text-green-600"
              } flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}
            />
            <span className="text-sand-900">{feature}</span>
          </div>
        ))}
        {plan.limitations &&
          plan.limitations.map((limitation, index) => (
            <div
              key={`limit-${index}`}
              className="flex items-start gap-3 opacity-75"
            >
              <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-sand-600">{limitation}</span>
            </div>
          ))}
      </div>

      <button
        onClick={() => onSelect(plan)}
        disabled={isCurrentPlan}
        className={`
          w-full mt-8 py-4 px-6 rounded-[3px] font-bold text-center text-lg
          transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
          ${
            isCurrentPlan
              ? "bg-sand-200 text-sand-500 cursor-not-allowed"
              : isPopular
              ? "bg-brand-gradient-alt text-charcoal hover:brightness-105 shadow-md"
              : "bg-ink text-paper hover:bg-charcoal shadow-md"
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
    <div className="bg-white rounded-lg border border-sand-200 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-accent-yellow/20 flex items-center justify-center text-accent-orange2 font-bold">
          {name.substring(0, 1)}
        </div>
        <div className="ml-4">
          <h4 className="font-medium text-charcoal">{name}</h4>
          <p className="text-sm text-sand-600">{role}</p>
        </div>
      </div>
      <p className="text-sand-900">{content}</p>
      <div className="mt-4 flex text-accent-amber">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
    </div>
  );
};

const FeatureComparison = () => {
  return (
    <div className="mt-20 bg-white rounded-lg p-8 border border-sand-200">
      <h3 className="font-sora text-3xl font-bold text-center text-charcoal mb-2">
        Detailed Feature Comparison
      </h3>
      <p className="text-sand-700 text-center mb-8">
        See exactly what you get with each plan
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-sand-300">
              <th className="py-6 px-6 text-left font-sora font-bold text-charcoal">
                Feature
              </th>
              <th className="py-6 px-6 text-center font-sora font-bold text-sand-700">
                Free Trial
              </th>
              <th className="py-6 px-6 text-center font-sora font-bold bg-accent-yellow/10 rounded-t-lg text-accent-orange2">
                Premium
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                feature: "Daily Practice Questions",
                icon: <Target className="w-5 h-5 text-accent-orange2" />,
                free: "3 per day",
                premium: "10 per day",
              },
              {
                feature: "Mock Tests",
                icon: <ClipboardCheck className="w-5 h-5 text-accent-orange2" />,
                free: "1 subject specific",
                premium: "Monthly subject specific",
              },
              {
                feature: "Trial Period",
                icon: <Clock className="w-5 h-5 text-accent-orange2" />,
                free: "2 weeks",
                premium: "Unlimited access",
              },
              {
                feature: "Dashboard Tracking",
                icon: <Layout className="w-5 h-5 text-accent-orange2" />,
                free: "Basic",
                premium: "Advanced",
              },
              {
                feature: "Question Bank Access",
                icon: <BookOpen className="w-5 h-5 text-accent-orange2" />,
                free: "Limited",
                premium: "Full Access",
              },
              {
                feature: "Performance Analytics",
                icon: <BarChart2 className="w-5 h-5 text-accent-orange2" />,
                free: "Basic",
                premium: "Advanced",
              },
              {
                feature: "Email Support",
                icon: <Shield className="w-5 h-5 text-accent-orange2" />,
                free: "No",
                premium: "Priority Support",
              },
            ].map((row, index) => (
              <tr
                key={index}
                className={`border-b border-sand-200 ${
                  index % 2 === 1 ? "bg-sand-100" : ""
                }`}
              >
                <td className="py-6 px-6 font-medium text-charcoal flex items-center gap-3">
                  {row.icon}
                  <span>{row.feature}</span>
                </td>
                <td className="py-6 px-6 text-center text-sand-900">{row.free}</td>
                <td className="py-6 px-6 text-center bg-accent-yellow/10 text-charcoal">
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
      <h3 className="font-sora text-3xl font-bold text-center text-charcoal mb-2">
        Frequently Asked Questions
      </h3>
      <p className="text-sand-700 text-center mb-8">
        Find answers to common questions about our plans
      </p>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-sand-200 rounded-lg overflow-hidden bg-white"
          >
            <button
              className="w-full p-6 text-left font-semibold text-charcoal flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.question}
              <div
                className={`transform transition-transform text-accent-orange2 ${
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
              <p className="text-sand-900">{faq.answer}</p>
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

  useEffect(() => {
    if (paymentStatus === "success") {
      toast.success("Payment successful! Refreshing application...");

      const reloadTimer = setTimeout(() => {
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

      const orderResponse = await dispatch(createPaymentOrder(plan)).unwrap();

      if (!orderResponse || !orderResponse.order) {
        throw new Error("Failed to create payment order");
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: "PalsAnalytix",
        description: `${plan.name} Plan Subscription`,
        order_id: orderResponse.order.id,
        handler: async function (response) {
          try {
            const paymentVerificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              user_id: user._id,
            };

            const verifyPaymentData = await dispatch(
              verifyPayment(paymentVerificationData)
            ).unwrap();

            if (verifyPaymentData.success) {
              window.location.reload();
              window.location.href = "/dashboard";
            }
            setProcessingPayment(false);
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
          color: "#ff8305",
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
    <div className="min-h-screen bg-paper font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-ink text-paper py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <span className="inline-block px-4 py-1.5 rounded-[2px] border border-line-tag font-mono text-xs uppercase tracking-[0.14em] text-accent-orange2 mb-6">
            Choose a plan that's right for you
          </span>
          <h1 className="font-sora text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-[-0.02em]">
            Invest in Your{" "}
            <span className="text-transparent bg-clip-text bg-brand-gradient-alt">
              Future Success
            </span>
          </h1>
          <p className="text-xl text-sand-400 max-w-2xl mx-auto leading-relaxed">
            Access premium study materials and mock tests through our
            comprehensive learning platform
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-lg border border-sand-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <Layout className="w-10 h-10 text-accent-orange2 mb-4 p-2 bg-accent-yellow/10 rounded-lg" />
            <h3 className="font-sora font-bold text-lg text-charcoal mb-2">Interactive Dashboard</h3>
            <p className="text-sand-900">
              Access your personalized study portal with progress tracking
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-sand-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <ClipboardCheck className="w-10 h-10 text-accent-orange2 mb-4 p-2 bg-accent-yellow/10 rounded-lg" />
            <h3 className="font-sora font-bold text-lg text-charcoal mb-2">Subject Mock Tests</h3>
            <p className="text-sand-900">
              Regular subject-specific assessments to test your knowledge
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-sand-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <BarChart2 className="w-10 h-10 text-accent-orange2 mb-4 p-2 bg-accent-yellow/10 rounded-lg" />
            <h3 className="font-sora font-bold text-lg text-charcoal mb-2">Performance Tracking</h3>
            <p className="text-sand-900">
              Detailed analytics and insights to improve your results
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-sand-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <BookOpen className="w-10 h-10 text-accent-orange2 mb-4 p-2 bg-accent-yellow/10 rounded-lg" />
            <h3 className="font-sora font-bold text-lg text-charcoal mb-2">Question Bank</h3>
            <p className="text-sand-900">
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
          <h2 className="font-sora text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-sand-900 max-w-2xl mx-auto">
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

        <FeatureComparison />

        <FAQ />

        {/* CTA Section */}
        <div className="mt-24 bg-brand-gradient rounded-lg p-12 text-center">
          <h3 className="font-sora text-3xl font-bold text-charcoal mb-4">
            Ready to Accelerate Your Learning?
          </h3>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-ink700">
            Join thousands of students who have already upgraded their study
            experience
          </p>
          <button
            onClick={() =>
              document
                .getElementById("pricing-cards")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-4 bg-ink text-paper font-bold rounded-[3px] hover:brightness-125 transition-all duration-300 transform hover:-translate-y-1 shadow-lg text-lg"
          >
            Get Started Today
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center bg-sand-100 px-6 py-3 rounded-lg">
            <Shield className="w-6 h-6 text-accent-orange2 mr-2" />
            <span className="text-sand-900 font-medium">Secure Payments</span>
          </div>
          <div className="flex items-center bg-sand-100 px-6 py-3 rounded-lg">
            <Clock className="w-6 h-6 text-accent-orange2 mr-2" />
            <span className="text-sand-900 font-medium">7-Day Refund</span>
          </div>
          <div className="flex items-center bg-sand-100 px-6 py-3 rounded-lg">
            <Award className="w-6 h-6 text-accent-orange2 mr-2" />
            <span className="text-sand-900 font-medium">Top-Rated Content</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
