import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Clock, ChevronLeft, ChevronRight, Send, BookOpen, Target } from "lucide-react";
import MbaHeader from "../../components/mba/MbaHeader";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const OPTION_LETTERS = ["A", "B", "C"];
const RING_RADIUS = 46;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const getRingColor = (fraction) => {
  if (fraction > 0.5) return "#ff8305";
  if (fraction > 0.2) return "#ffb23a";
  return "#dc2626";
};

const TimerRing = ({ displayTime, totalTime }) => {
  const fraction = totalTime > 0 ? Math.max(0, Math.min(1, displayTime / totalTime)) : 0;
  const color = getRingColor(fraction);
  const mins = Math.floor(Math.max(0, displayTime) / 60);
  const secs = Math.max(0, displayTime) % 60;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg width="96" height="96" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={RING_RADIUS} stroke="#e6e2d9" strokeWidth="8" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={RING_RADIUS}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE * (1 - fraction)}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Clock size={16} className="text-charcoal mb-0.5" />
        <span className={`font-sora text-sm font-bold ${fraction <= 0.2 ? "text-red-600" : "text-charcoal"}`}>
          {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

const LEGEND_ITEMS = [
  { label: "Answered", classes: "bg-green-100 border-green-700" },
  { label: "Marked for review", classes: "bg-yellow-100 border-yellow-600" },
  { label: "Skipped", classes: "bg-sand-200 border-sand-400" },
  { label: "Not visited", classes: "bg-white border-sand-400" },
];

const MbaTestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.mbaAuth);
  const testTitle = location.state?.testTitle;
  const testType = location.state?.testType;
  const TypeIcon = testType === "exam" ? Target : BookOpen;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const attemptIdRef = useRef(null);
  const timeRemainingRef = useRef(0);
  const totalTimeRef = useRef(0);
  const elapsedRef = useRef(0);
  const submittedRef = useRef(false);
  const intervalRef = useRef(null);
  const questionsRef = useRef([]);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const start = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/mba/student/tests/${testId}/start`,
          {},
          authHeader
        );
        const data = response.data;
        attemptIdRef.current = data.attemptId;
        timeRemainingRef.current = data.timeRemainingSec;
        totalTimeRef.current = data.timeRemainingSec;
        setDisplayTime(data.timeRemainingSec);
        setQuestions(data.questions);
        setLoading(false);
        startTimer();
      } catch (err) {
        setErrorMsg(err.response?.data?.error || "Could not start this test.");
        setLoading(false);
      }
    };
    start();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      if (submittedRef.current) return;
      timeRemainingRef.current -= 1;
      elapsedRef.current += 1;
      setDisplayTime(timeRemainingRef.current);

      if (timeRemainingRef.current <= 0) {
        await syncTimer();
        return;
      }
      if (elapsedRef.current >= 15) {
        await syncTimer();
      }
    }, 1000);
  };

  const syncTimer = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/mba/student/tests/attempts/${attemptIdRef.current}/sync`,
        { elapsedSec: elapsedRef.current },
        authHeader
      );
      elapsedRef.current = 0;
      timeRemainingRef.current = response.data.timeRemainingSec;
      setDisplayTime(response.data.timeRemainingSec);
      if (response.data.status === "submitted") {
        clearInterval(intervalRef.current);
        submittedRef.current = true;
        alert("Time's up! Your test has been automatically submitted.");
        navigate(`/mba-evaluation/results/${attemptIdRef.current}`);
      }
    } catch (err) {
      // Silent fail — retried on next tick
    }
  };

  const saveAnswer = async (question) => {
    try {
      await axios.post(
        `${BASE_URL}/api/mba/student/tests/attempts/${attemptIdRef.current}/answer`,
        {
          questionId: question._id,
          answerGiven:
            question.answerGiven !== undefined && question.answerGiven !== null
              ? question.answerGiven
              : undefined,
          markedForReview: question.markedForReview,
        },
        authHeader
      );
    } catch (err) {
      // Silent fail — not critical for a single save
    }
  };

  const selectOption = (idx) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[currentIndex] = { ...updated[currentIndex], answerGiven: idx, visited: true };
      saveAnswer(updated[currentIndex]);
      return updated;
    });
  };

  const toggleMarkForReview = () => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        markedForReview: !updated[currentIndex].markedForReview,
        visited: true,
      };
      saveAnswer(updated[currentIndex]);
      return updated;
    });
  };

  const jumpTo = (i) => {
    saveAnswer({ ...questionsRef.current[currentIndexRef.current], visited: true });
    setCurrentIndex(i);
  };

  const handleSubmit = async () => {
    if (!window.confirm("Submit your test now? You won't be able to change answers after this.")) return;
    await saveAnswer({ ...questionsRef.current[currentIndexRef.current], visited: true });
    clearInterval(intervalRef.current);
    submittedRef.current = true;
    try {
      await axios.post(
        `${BASE_URL}/api/mba/student/tests/attempts/${attemptIdRef.current}/submit`,
        {},
        authHeader
      );
      navigate(`/mba-evaluation/results/${attemptIdRef.current}`);
    } catch (err) {
      alert("Submit failed: " + (err.response?.data?.error || err.message));
      submittedRef.current = false;
    }
  };

  if (loading) return <div className="min-h-screen bg-paper flex items-center justify-center text-sand-700 font-sans">Loading test...</div>;
  if (errorMsg) return <div className="min-h-screen bg-paper flex items-center justify-center text-red-600 font-sans">{errorMsg}</div>;

  const q = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper via-white to-accent-yellow/5 font-sans">
      <MbaHeader />

      {/* Hero band with test title */}
      <div className="bg-ink px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          {testTitle && (
            <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center flex-shrink-0">
              <TypeIcon size={18} className="text-charcoal" />
            </div>
          )}
          <div>
            <div className="font-mono text-xs tracking-[.14em] uppercase text-accent-orange2 mb-1">
              {testType || "MBA Evaluation"}
            </div>
            <h1 className="font-sora text-xl sm:text-2xl font-bold text-paper tracking-tight">
              {testTitle || "In Progress"}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="sticky top-0 bg-paper/95 backdrop-blur z-10 py-3 flex justify-between items-center mb-2 border-b border-sand-200">
          <TimerRing displayTime={displayTime} totalTime={totalTimeRef.current} />
          <div className="text-right">
            <div className="font-mono text-xs uppercase tracking-wide text-sand-600">Question</div>
            <div className="font-sora text-xl font-bold text-charcoal">{currentIndex + 1} <span className="text-sand-500 text-base font-normal">of {questions.length}</span></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {questions.map((question, i) => {
            let style = "bg-white border-sand-400";
            if (question.markedForReview) style = "bg-yellow-100 border-yellow-600";
            else if (question.answerGiven !== null && question.answerGiven !== undefined) style = "bg-green-100 border-green-700";
            else if (question.visited) style = "bg-sand-200 border-sand-400";
            const ring = i === currentIndex ? "ring-2 ring-accent-orange2" : "";
            return (
              <button
                key={question._id}
                onClick={() => jumpTo(i)}
                className={`w-9 h-9 rounded border text-sm font-medium ${style} ${ring}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs text-sand-600">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded border ${item.classes}`} />
              {item.label}
            </div>
          ))}
        </div>

        <div className="bg-white border border-sand-200 rounded-lg overflow-hidden">
          <div className="h-1.5 bg-brand-gradient" />
          <div className="p-6">
            <p className="font-sora font-semibold text-charcoal mb-2">Question {currentIndex + 1}</p>
            <p className="text-charcoal mb-3">{q.text}</p>
            {q.questionImage && <img src={q.questionImage} alt="" className="max-w-full rounded-lg mb-4" />}

            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const letter = OPTION_LETTERS[idx];
                const img = q.optionImages && q.optionImages[letter];
                const selected = q.answerGiven === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => selectOption(idx)}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selected ? "bg-accent-yellow/20 border-accent-orange2" : "border-sand-200 hover:bg-sand-100"
                    }`}
                  >
                    <span className="font-medium">{letter}.</span> {opt}
                    {img && <img src={img} alt="" className="max-w-xs mt-2 rounded" />}
                  </div>
                );
              })}
            </div>

            <label className="flex items-center gap-2 mt-4 text-sm text-sand-700">
              <input type="checkbox" checked={!!q.markedForReview} onChange={toggleMarkForReview} />
              Mark this question for review
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => currentIndex > 0 && jumpTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-5 py-2 rounded border border-sand-300 bg-white disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            onClick={() => currentIndex < questions.length - 1 && jumpTo(currentIndex + 1)}
            disabled={currentIndex === questions.length - 1}
            className="flex items-center gap-1.5 px-5 py-2 rounded border border-sand-300 bg-white disabled:opacity-40"
          >
            Next <ChevronRight size={16} />
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-5 py-2 rounded bg-red-50 border border-red-700 text-red-700 font-semibold ml-auto hover:bg-red-100"
          >
            <Send size={16} /> Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default MbaTestPage;
