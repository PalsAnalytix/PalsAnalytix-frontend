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
      // ... other chapters
    ],
    CFA: [
      "Ethical and Professional Standards",
      "Quantitative Methods",
      "Economics",
      // ... other chapters
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
      className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex justify-center items-center z-50"
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md m-4 shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gradient-to-r from-blue-500 to-purple-500">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Daily Questions</h2>
            <p className="text-sm text-gray-500 mt-1">
              Subscribe to Daily Questions updates
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {isFreePlan && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-xl z-10 flex flex-col items-center justify-center p-6">
            <Lock className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Upgrade to Access
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Subscribe to our Pro or Premier plan to receive daily practice
              questions on your Dashboard.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View Pricing Plans
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-r-md">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Course Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Course
            </label>
            <div className="relative group">
              <GraduationCap
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                size={20}
              />
              <select
                value={currentCourse}
                onChange={(e) => setCurrentCourse(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chapter Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Chapter
            </label>
            <div className="relative group">
              <BookOpen
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                size={20}
              />
              <select
                value={currentChapter}
                onChange={(e) => setCurrentChapter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Select a chapter</option>
                {currentCourse &&
                  chapters[currentCourse]?.map((chapter) => (
                    <option key={chapter} value={chapter}>
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
            mt-8 w-full py-3 rounded-lg font-medium
            flex items-center justify-center space-x-2
            ${
              loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
            }
            transition-all duration-200 shadow-md hover:shadow-lg
          `}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
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
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            You'll receive carefully curated daily practice questions for your
            selected course and chapter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;