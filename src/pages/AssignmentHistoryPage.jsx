import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ClipboardList } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { COURSE_LABELS } from "../data/courseTopics";
import { fetchAssignmentHistory } from "../redux/slices/assignmentSlice";

const AssignmentHistoryPage = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { history, historyLoading } = useSelector((state) => state.assignment);

  const courseLabel = COURSE_LABELS[courseCode] || courseCode;

  useEffect(() => {
    dispatch(fetchAssignmentHistory(courseCode));
  }, [courseCode, dispatch]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-paper min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-6 sm:px-12 py-16 pt-28 max-w-3xl mx-auto w-full">
        <button
          onClick={() => navigate(`/dashboard/course/${courseCode}/assignments/new`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink700 hover:text-ink mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          New Assignment
        </button>

        <p className="font-mono text-xs uppercase tracking-widest text-accent-orange mb-2">
          {courseLabel}
        </p>
        <h1 className="font-sora text-3xl font-semibold text-ink mb-8">Past Assignments</h1>

        {historyLoading ? (
          <p className="text-ink700">Loading…</p>
        ) : history.length === 0 ? (
          <div className="bg-white border border-line rounded-[3px] p-8 text-center">
            <ClipboardList className="w-8 h-8 text-ink700 mx-auto mb-3" />
            <p className="text-ink700 text-sm">
              You haven't completed any custom assignments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => {
              const percentage = Math.round((item.score / item.numQuestions) * 100);
              return (
                <button
                  key={item._id}
                  onClick={() =>
                    navigate(`/dashboard/course/${courseCode}/assignments/${item._id}/results`)
                  }
                  className="w-full text-left bg-white border border-line rounded-[3px] p-5 flex items-center justify-between hover:border-accent-orange transition"
                >
                  <div>
                    <p className="text-sm text-ink700 mb-1">{formatDate(item.submittedAt)}</p>
                    <p className="text-sm text-ink">
                      {item.chapters?.length > 0
                        ? `${item.chapters.length} chapter${item.chapters.length > 1 ? "s" : ""}`
                        : "All chapters"}{" "}
                      · {item.difficulty} · {item.numQuestions} questions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-sora text-xl font-semibold text-ink">{percentage}%</p>
                    <p className="text-xs text-ink700">
                      {item.score}/{item.numQuestions}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AssignmentHistoryPage;
