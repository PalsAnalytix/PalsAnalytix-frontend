import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Clock, Flag, X } from "lucide-react";
import { COURSE_LABELS } from "../data/courseTopics";
import {
  fetchAssignment,
  submitAssignment,
  clearCurrentAssignment,
} from "../redux/slices/assignmentSlice";

const OPTION_KEYS = ["A", "B", "C", "D"];

const AssignmentTestPage = () => {
  const { courseCode, assignmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentAssignment, creatingAssignment, submitting } = useSelector(
    (state) => state.assignment
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: { selectedOption, markedForReview, timeSpent } }
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const questionStartRef = useRef(Date.now());
  const totalStartRef = useRef(Date.now());
  const submittedRef = useRef(false);

  const courseLabel = COURSE_LABELS[courseCode] || courseCode;

  // Load assignment: if we already have it in redux (just created) use it,
  // otherwise fetch (e.g. page was refreshed).
  useEffect(() => {
    if (!currentAssignment || String(currentAssignment.assignmentId) !== String(assignmentId)) {
      dispatch(fetchAssignment(assignmentId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId]);

  useEffect(() => {
    if (currentAssignment && String(currentAssignment.assignmentId) === String(assignmentId)) {
      const initial =
        currentAssignment.remainingSeconds !== undefined
          ? currentAssignment.remainingSeconds
          : currentAssignment.timeLimitSeconds;
      setRemainingSeconds(initial);

      // Pre-fill answers if resuming
      if (currentAssignment.answers) {
        const initialAnswers = {};
        currentAssignment.answers.forEach((a) => {
          initialAnswers[a.question] = {
            selectedOption: a.selectedOption || null,
            markedForReview: a.markedForReview || false,
            timeSpent: 0,
          };
        });
        setAnswers(initialAnswers);
      }
      totalStartRef.current = Date.now();
      questionStartRef.current = Date.now();
    }
  }, [currentAssignment, assignmentId]);

  const questions = currentAssignment?.questions || [];
  const currentQuestion = questions[currentIndex];

  const recordTimeOnCurrentQuestion = useCallback(() => {
    if (!currentQuestion) return;
    const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: {
        ...(prev[currentQuestion._id] || { selectedOption: null, markedForReview: false }),
        timeSpent: (prev[currentQuestion._id]?.timeSpent || 0) + elapsed,
      },
    }));
    questionStartRef.current = Date.now();
  }, [currentQuestion]);

  const handleSelectOption = (letter) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: {
        ...(prev[currentQuestion._id] || { timeSpent: 0, markedForReview: false }),
        selectedOption: letter,
      },
    }));
  };

  const toggleMarkForReview = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: {
        ...(prev[currentQuestion._id] || { timeSpent: 0, selectedOption: null }),
        markedForReview: !prev[currentQuestion._id]?.markedForReview,
      },
    }));
  };

  const goToQuestion = (idx) => {
    recordTimeOnCurrentQuestion();
    setCurrentIndex(idx);
  };

  const handleSubmit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    recordTimeOnCurrentQuestion();

    const totalTimeSpent = Math.round((Date.now() - totalStartRef.current) / 1000);

    // Build answers array from latest state (use a functional read via ref-like trick)
    setAnswers((latest) => {
      const answersPayload = questions.map((q) => ({
        questionId: q._id,
        selectedOption: latest[q._id]?.selectedOption || null,
        timeSpent: latest[q._id]?.timeSpent || 0,
        markedForReview: latest[q._id]?.markedForReview || false,
      }));

      dispatch(submitAssignment({ assignmentId, answers: answersPayload, totalTimeSpent })).then(
        (result) => {
          if (submitAssignment.fulfilled.match(result)) {
            dispatch(clearCurrentAssignment());
            navigate(`/dashboard/course/${courseCode}/assignments/${assignmentId}/results`);
          } else {
            submittedRef.current = false;
          }
        }
      );

      return latest;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId, questions, courseCode, dispatch, navigate, recordTimeOnCurrentQuestion]);

  // Countdown timer
  useEffect(() => {
    if (remainingSeconds === null) return;
    if (remainingSeconds <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setRemainingSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [remainingSeconds, handleSubmit]);

  // Warn before leaving the tab
  useEffect(() => {
    const handler = (e) => {
      if (submittedRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q._id]?.selectedOption).length,
    [questions, answers]
  );

  if (creatingAssignment || !currentAssignment || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="text-ink700">Loading assignment…</p>
      </div>
    );
  }

  const currentAnswer = answers[currentQuestion._id] || {};

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-line px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-orange">
            {courseLabel} · Custom Assignment
          </p>
          <p className="text-sm text-ink700">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 font-sora font-semibold text-lg ${
            remainingSeconds <= 60 ? "text-red-600" : "text-ink"
          }`}
        >
          <Clock className="w-5 h-5" />
          {formatTime(remainingSeconds)}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 gap-8">
        {/* Question panel */}
        <div className="flex-1 bg-white border border-line rounded-[3px] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs px-2 py-1 rounded-full bg-sand-100 text-ink700">
              {currentQuestion.chapterName || "General"}
            </span>
            <button
              onClick={toggleMarkForReview}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-[3px] border transition ${
                currentAnswer.markedForReview
                  ? "bg-accent-amber/20 border-accent-amber text-ink"
                  : "border-line text-ink700"
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              {currentAnswer.markedForReview ? "Marked for Review" : "Mark for Review"}
            </button>
          </div>

          <p className="text-ink font-medium mb-6 leading-relaxed">
            {currentQuestion.questionStatement}
          </p>
          {currentQuestion.questionImage && (
            <img
              src={currentQuestion.questionImage}
              alt="Question"
              className="mb-6 rounded-[3px] max-w-full"
            />
          )}

          <div className="space-y-3">
            {OPTION_KEYS.map((letter) => {
              const optionText = currentQuestion.options[`option${letter}`];
              const optionImage = currentQuestion.options[`option${letter}Image`];
              const selected = currentAnswer.selectedOption === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleSelectOption(letter)}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-[3px] border-2 transition ${
                    selected
                      ? "border-accent-orange bg-accent-orange/5"
                      : "border-line hover:border-accent-orange/50"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                      selected ? "bg-accent-orange text-white" : "bg-sand-100 text-ink700"
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="text-ink700 pt-0.5">{optionText}</span>
                  {optionImage && (
                    <img src={optionImage} alt={letter} className="max-w-[120px] rounded-[3px]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-line-light">
            <button
              disabled={currentIndex === 0}
              onClick={() => goToQuestion(currentIndex - 1)}
              className="px-5 py-2 rounded-[3px] border border-line text-ink700 font-medium disabled:opacity-40"
            >
              Previous
            </button>
            <div className="flex gap-3">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => goToQuestion(currentIndex + 1)}
                  className="px-6 py-2 rounded-[3px] bg-brand-gradient-alt text-charcoal font-semibold"
                >
                  {currentAnswer.selectedOption ? "Next" : "Skip"}
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="px-6 py-2 rounded-[3px] bg-brand-gradient text-charcoal font-semibold"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigator */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white border border-line rounded-[3px] p-5 sticky top-24">
            <p className="text-sm font-semibold text-ink mb-3">
              {answeredCount} of {questions.length} answered
            </p>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {questions.map((q, idx) => {
                const a = answers[q._id];
                const isCurrent = idx === currentIndex;
                let style = "border-line text-ink700 bg-white";
                if (a?.markedForReview) style = "border-accent-amber bg-accent-amber/20 text-ink";
                else if (a?.selectedOption) style = "border-accent-orange bg-accent-orange/10 text-ink";
                return (
                  <button
                    key={q._id}
                    onClick={() => goToQuestion(idx)}
                    className={`w-9 h-9 rounded-[3px] border text-xs font-semibold flex items-center justify-center ${style} ${
                      isCurrent ? "ring-2 ring-accent-orange" : ""
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full py-2.5 rounded-[3px] bg-brand-gradient text-charcoal font-semibold text-sm"
            >
              Submit Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Submit confirmation modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-[3px] max-w-sm w-full p-6 relative">
            <button
              onClick={() => setShowSubmitConfirm(false)}
              className="absolute top-4 right-4 text-ink700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-sora text-lg font-semibold text-ink mb-2">Submit assignment?</h3>
            <p className="text-sm text-ink700 mb-6">
              You've answered {answeredCount} of {questions.length} questions.
              {answeredCount < questions.length &&
                " Unanswered questions will be marked incorrect."}{" "}
              This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-[3px] border border-line text-ink700 font-medium"
              >
                Keep Working
              </button>
              <button
                disabled={submitting}
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-[3px] bg-brand-gradient text-charcoal font-semibold disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentTestPage;
