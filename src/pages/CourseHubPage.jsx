import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { FileText, ClipboardList, MessageCircle, ArrowLeft } from "lucide-react";

const COURSE_LABELS = {
  CFA: "CFA",
  FRM: "FRM",
  SCR: "SCR",
  EXCEL: "Excel",
  ADVANCED_EXCEL: "Advanced Excel",
  EXCEL_FOR_FINANCE: "Excel for Finance",
};

const OPTIONS = [
  {
    key: "custom-assignments",
    title: "Custom Assignments",
    description: "Get assignments tailored to your topics and difficulty level.",
    icon: FileText,
  },
  {
    key: "full-length-tests",
    title: "Full Length Tests",
    description: "Simulate the real exam with timed, full-length practice tests.",
    icon: ClipboardList,
  },
  {
    key: "whatsapp-quiz",
    title: "WhatsApp Quiz",
    description: "Receive daily practice questions directly on WhatsApp.",
    icon: MessageCircle,
  },
];

const CourseHubPage = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const courseLabel = COURSE_LABELS[courseCode] || courseCode;

  return (
    <div className="bg-paper min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-6 sm:px-12 py-16 pt-28 max-w-6xl mx-auto w-full">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink700 hover:text-ink mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <p className="font-mono text-xs uppercase tracking-widest text-accent-orange mb-3">
          Your Course
        </p>
        <h1 className="font-sora text-3xl sm:text-4xl font-semibold text-ink mb-3">
          {courseLabel}
        </h1>
        <p className="text-ink700 mb-12 max-w-2xl">
          Choose what you'd like to work on for {courseLabel}. These tools are being
          built and will be available soon.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OPTIONS.map(({ key, title, description, icon: Icon }) => (
            <div
              key={key}
              className="bg-white border border-line rounded-[3px] p-6 flex flex-col"
            >
              <div className="w-12 h-12 rounded-full bg-accent-orange2/10 flex items-center justify-center mb-5">
                <Icon className="w-6 h-6 text-accent-orange2" />
              </div>
              <h3 className="font-sora text-lg font-semibold text-ink mb-2">
                {title}
              </h3>
              <p className="text-sm text-ink700 mb-6 flex-1">{description}</p>
              <button
                disabled
                className="w-full py-2.5 rounded-[3px] border border-line-light text-sand-500 font-semibold text-sm cursor-not-allowed bg-sand-100"
              >
                Coming Soon
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseHubPage;
