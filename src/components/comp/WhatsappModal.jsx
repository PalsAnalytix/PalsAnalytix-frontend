import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, BookOpen, GraduationCap, Send } from "lucide-react";
import { updateUserWhatsAppDetails } from "../../redux/slices/userSlice";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const WhatsAppModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [phoneNo, setPhoneNo] = useState("");
  const [currentChapter, setCurrentChapter] = useState("");
  const [currentCourse, setCurrentCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      "Quantitative Analysis and Statistical Methods",
      "Financial Markets and Products",
      "Valuation and Risk Models",
      "Market Risk Measurement and Management",
      "Credit Risk Measurement and Management",
      "Operational Risk and Resilience",
      "Liquidity and Treasury Risk Measurement",
      "Enterprise Risk Management",
      "Current Issues in Financial Markets",
    ],
  };
  const courses = ["CFA", "FRM", "SCR"];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
  
      if (!currentChapter || !currentCourse) {
        throw new Error("Please fill in all fields");
      }
  
      // Get the updated user data from the response
      const updatedUser = await dispatch(
        updateUserWhatsAppDetails({
          userId: user._id,
          currentChapterForWhatsapp: currentChapter,
          currentCourseForWhatsapp: currentCourse,
        })
      ).unwrap();
  
      // Update the user in Redux state
  
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
        {/* Header with gradient border */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gradient-to-r from-blue-500 to-purple-500">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Daily Questions</h2>
            <p className="text-sm text-gray-500 mt-1">Subscribe to Daily Questions updates</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-r-md animate-shake">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* WhatsApp Input with custom styling */}
          {/* <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <PhoneInput
              country={"in"}
              value={phoneNo}
              onChange={setPhoneNo}
              inputStyle={{
                width: "100%",
                height: "45px",
                borderRadius: "0.5rem",
                paddingLeft: "48px",
              }}
              containerClass="hover:shadow-sm transition-shadow duration-200"
              buttonClass="rounded-l-lg"
              dropdownClass="rounded-lg shadow-lg"
            />
          </div> */}

          {/* Course Selection with hover effect */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Course
            </label>
            <div className="relative group">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 transition-colors duration-200" size={20} />
              <select
                value={currentCourse}
                onChange={(e) => setCurrentCourse(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          hover:border-blue-400 transition-all duration-200
                          appearance-none cursor-pointer shadow-sm"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course} value={course} className="py-2">
                    {course}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Chapter Selection with hover effect */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Chapter
            </label>
            <div className="relative group">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 transition-colors duration-200" size={20} />
              <select
                value={currentChapter}
                onChange={(e) => setCurrentChapter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          hover:border-blue-400 transition-all duration-200
                          appearance-none cursor-pointer shadow-sm text-sm"
              >
                <option value="">Select a chapter</option>
                {currentCourse &&
                  chapters[currentCourse]?.map((chapter) => (
                    <option key={chapter} value={chapter} className="py-2">
                      {`${currentCourse} - ${chapter}`}
                    </option>
                  ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribe Button with animation */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`
            mt-8 w-full py-3 rounded-lg font-medium
            flex items-center justify-center space-x-2
            ${loading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5'
            }
            transition-all duration-200 shadow-sm hover:shadow-md
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
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-blue-700 flex items-start space-x-2">
            <svg className="w-5 h-5 inline-block mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>You'll receive carefully curated daily practice questions for your selected course and chapter.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;