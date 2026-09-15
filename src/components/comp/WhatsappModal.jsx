import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, BookOpen, GraduationCap, Send, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateUserWhatsAppDetails } from "../../redux/slices/authSlice";
import "react-phone-input-2/lib/style.css";

const WhatsAppModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [currentChapter, setCurrentChapter] = useState("");
  const [currentCourse, setCurrentCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFreePlan = user?.currentSubscriptionPlan === "FREE";

  const chapters = {
    SCR: [
      "Foundations of Climate Change",
      "Sustainability",
      "Climate Change Risk",
      "Sustainability and Climate Policy, Culture, and Governance",
      "Green and Sustainable Finance: Markets and Instruments",
      "Climate Risk Measurement and Management",
      "Climate Models and Scenario Analysis",
      "Net Zero",
      "Climate and Nature Risk Assessment",
      "Transition Planning and Carbon Reporting",
    ],
    CFA: [
      "Ethical and Professional Standards",
      "Quantitative Methods",
      "Economics",
      "Financial Statement Analysis",
      "Corporate Issuers",
      "Equity Investments",
      "Fixed Income",
      "Derivatives",
      "Alternative Assets",
      "Portfolio Management",
    ],
    FRM: [
      "Foundations of Risk Management",
      "Quantitative Analysis",
      "Financial Markets and Products",
      // ... other chapters
    ],
  };
  const courses = ["CFA", "FRM", "SCR"];

  const handleSubmit = async () => {
    if (isFreePlan) {
      navigate("/pricing");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!currentChapter || !currentCourse) {
        throw new Error("Please fill in all fields");
      }

      await dispatch(
        updateUserWhatsAppDetails({
          userId: user._id,
          currentChapterForWhatsapp: currentChapter,
          currentCourseForWhatsapp: currentCourse,
        })
      ).unwrap();

      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (e) => {
    if (e.target.id === "modal-backdrop") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-backdrop"
      onClick={handleClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex justify-center items-center z-50 font-sans"
    >
      <div className="bg-ink border border-line rounded-lg p-6 w-full max-w-md m-4 shadow-2xl transform transition-all relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-line">
          <div>
            <h2 className="font-sora text-2xl font-bold text-paper">Daily Questions</h2>
            <p className="text-sm text-sand-500 mt-1">
              Subscribe to Daily Questions updates
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition-colors duration-200"
          >
            <X size={20} className="text-sand-400" />
          </button>
        </div>

        {isFreePlan && (
          <div className="absolute inset-0 bg-ink/90 backdrop-blur-[2px] rounded-lg z-10 flex flex-col items-center justify-center p-6">
            <Lock className="w-12 h-12 text-accent-orange2 mb-4" />
            <h3 className="font-sora text-xl font-bold text-paper mb-2">
              Upgrade to Access
            </h3>
            <p className="text-sand-400 text-center mb-6">
              Subscribe to our Pro or Premier plan to receive daily practice
              questions on your Dashboard.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="bg-brand-gradient-alt text-charcoal px-6 py-3 rounded-[3px] font-semibold hover:brightness-105 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View Pricing Plans
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 rounded-r-md">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Course Selection */}
          <div>
            <label className="block text-sm font-semibold text-sand-300 mb-2">
              Select Course
            </label>
            <div className="relative group">
              <GraduationCap
                className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-orange2"
                size={20}
              />
              <select
                value={currentCourse}
                onChange={(e) => setCurrentCourse(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-line-light rounded-lg text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 appearance-none cursor-pointer focus:outline-none"
              >
                <option value="" className="text-charcoal">Select a course</option>
                {courses.map((course) => (
                  <option key={course} value={course} className="text-charcoal">
                    {course}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chapter Selection */}
          <div>
            <label className="block text-sm font-semibold text-sand-300 mb-2">
              Select Chapter
            </label>
            <div className="relative group">
              <BookOpen
                className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-orange2"
                size={20}
              />
              <select
                value={currentChapter}
                onChange={(e) => setCurrentChapter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-line-light rounded-lg text-paper focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 appearance-none cursor-pointer focus:outline-none"
              >
                <option value="" className="text-charcoal">Select a chapter</option>
                {currentCourse &&
                  chapters[currentCourse]?.map((chapter) => (
                    <option key={chapter} value={chapter} className="text-charcoal">
                      {`${currentCourse} - ${chapter}`}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`
            mt-8 w-full py-3 rounded-[3px] font-semibold
            flex items-center justify-center space-x-2
            ${
              loading
                ? "bg-sand-700 text-sand-400 cursor-not-allowed"
                : "bg-brand-gradient-alt text-charcoal hover:brightness-105"
            }
            transition-all duration-200 shadow-md hover:shadow-lg
          `}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charcoal"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <Send size={18} className="transform rotate-90" />
              <span>Subscribe Now</span>
            </>
          )}
        </button>

        {/* Info box */}
        <div className="mt-6 bg-accent-yellow/10 rounded-lg p-4">
          <p className="text-sm text-accent-orange2">
            You'll receive carefully curated daily practice questions for your
            selected course and chapter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;
