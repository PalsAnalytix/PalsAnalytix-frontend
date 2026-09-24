import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, XCircle, ArrowLeft, Clock } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { COURSE_LABELS } from "../data/courseTopics";
import { fetchAssignmentReview, clearReview } from "../redux/slices/assignmentSlice";

const OPTION_KEYS = ["A", "B", "C", "D"];

const formatDuration = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s}s`;
};

const AssignmentResultsPage = () => {
  const { courseCode, assignmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { review, reviewLoading } = useSelector((state) => state.assignment);

  const courseLabel = COURSE_LABELS[courseCode] || courseCode;

  useEffect(() => {
    dispatch(fetchAssignmentReview(assignmentId));
    return () => dispatch(clearReview());
  }, [assignmentId, dispatch]);

  if (reviewLoading || !review) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="text-ink700">Loading results…</p>
      </div>
    );
  }

  const percentage = Math.round((review.score / review.numQuestions) * 100);

  return (
    <div className="bg-paper min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-6 sm:px-12 py-16 pt-28 max-w-4xl mx-auto w-full">
        <button
          onClick={() => navigate(`/dashboard/course/${courseCode}/assignments/history`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink700 hover:text-ink mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Past Assignments
        </button>

        <p className="font-mono text-xs uppercase tracking-widest text-accent-orange mb-2">
          {courseLabel} · Custom Assignment Results
        </p>

        <div className="bg-white border border-line rounded-[3px] p-6 mb-10 flex flex-wrap items-center gap-8">
          <div>
            <p className="text-sm text-ink700 mb-1">Score</p>
            <p className="font-sora text-3xl font-semibold text-ink">
              {review.score} / {review.numQuestions}
            </p>
          </div>
          <div>
            <p className="text-sm text-ink700 mb-1">Percentage</p>
            <p className="font-sora text-3xl font-semibold text-ink">{percentage}%</p>
          </div>
          <div>
            <p className="text-sm text-ink700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Time Taken
            </p>
            <p className="font-sora text-xl font-semibold text-ink">
              {formatDuration(review.totalTimeSpent)}
            </p>
          </div>
        </div>

        <h2 className="font-sora text-xl font-semibold text-ink mb-4">Question Review</h2>

        <div className="space-y-6">
          {review.review.map((q, idx) => (
            <div key={q._id} className="bg-white border border-line rounded-[3px] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-sand-100 text-ink700 text-xs font-semibold flex items-center justify-center">
                  {idx + 1}
                </span>
                {q.isCorrect ? (
                  <span className="inline-flex items-center gap-1 text-green-700 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600 text-xs font-semibold">
                    <XCircle className="w-4 h-4" /> Incorrect
                  </span>
                )}
                <span className="text-xs text-ink700 ml-auto">{q.chapterName}</span>
              </div>

              <p className="text-ink font-medium mb-4">{q.questionStatement}</p>

              <div className="space-y-2 mb-4">
                {OPTION_KEYS.map((letter) => {
                  const isCorrectOption = letter === q.correctOption;
                  const isSelected = letter === q.selectedOption;
                  let style = "border-line text-ink700";
                  if (isCorrectOption) style = "border-green-500 bg-green-50 text-green-800";
                  else if (isSelected && !isCorrectOption)
                    style = "border-red-500 bg-red-50 text-red-700";

                  return (
                    <div
                      key={letter}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-[3px] border ${style}`}
                    >
                      <span className="font-semibold">{letter}.</span>
                      <span className="flex-1">{q.options[`option${letter}`]}</span>
                      {isCorrectOption && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      {isSelected && !isCorrectOption && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  );
                })}
                {!q.selectedOption && (
                  <p className="text-xs text-ink700 italic">You didn't answer this question.</p>
                )}
              </div>

              <div className="bg-sand-100 rounded-[3px] p-4">
                <p className="text-xs font-semibold text-ink700 mb-1">Explanation</p>
                <p className="text-sm text-ink700">{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AssignmentResultsPage;
