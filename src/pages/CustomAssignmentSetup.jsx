import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronUp, Loader2, History } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { COURSE_TOPICS, COURSE_LABELS } from "../data/courseTopics";
import {
  fetchAvailableCount,
  createAssignment,
  clearAvailableCount,
  clearCurrentAssignment,
} from "../redux/slices/assignmentSlice";

const DIFFICULTIES = [
  { value: "mixed", label: "Mixed" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const QUESTION_COUNTS = [10, 20, 30, 40, 50];

const CustomAssignmentSetup = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const courseLabel = COURSE_LABELS[courseCode] || courseCode;
  const sections = COURSE_TOPICS[courseCode] || [];

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [expandedSection, setExpandedSection] = useState(0);
  const [difficulty, setDifficulty] = useState("mixed");
  const [numQuestions, setNumQuestions] = useState(20);

  const { availableCount, availableCountLoading, creatingAssignment, createError } =
    useSelector((state) => state.assignment);

  useEffect(() => {
    dispatch(clearCurrentAssignment());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAvailableCount({ course: courseCode, chapters: selectedTopics, difficulty }));
    return () => {
      dispatch(clearAvailableCount());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseCode, difficulty, JSON.stringify(selectedTopics)]);

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const effectiveMax = useMemo(() => {
    if (availableCount === null) return null;
    return Math.min(numQuestions, availableCount);
  }, [availableCount, numQuestions]);

  const canStart = availableCount !== null && availableCount > 0 && !creatingAssignment;

  const handleStart = async () => {
    const result = await dispatch(
      createAssignment({
        course: courseCode,
        chapters: selectedTopics,
        difficulty,
        numQuestions,
      })
    );
    if (createAssignment.fulfilled.match(result)) {
      navigate(`/dashboard/course/${courseCode}/assignments/${result.payload.assignmentId}/take`);
    }
  };

  return (
    <div className="bg-paper min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-6 sm:px-12 py-16 pt-28 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent-orange mb-2">
              Custom Assignment
            </p>
            <h1 className="font-sora text-3xl font-semibold text-ink">{courseLabel}</h1>
          </div>
          <button
            onClick={() => navigate(`/dashboard/course/${courseCode}/assignments/history`)}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink700 hover:text-ink border border-line rounded-[3px] px-4 py-2"
          >
            <History className="w-4 h-4" />
            Past Assignments
          </button>
        </div>

        {/* Chapters */}
        {sections.length > 0 ? (
          <div className="mb-8">
            <h2 className="font-sora text-lg font-semibold text-ink mb-1">Chapters</h2>
            <p className="text-sm text-ink700 mb-4">
              Select one or more chapters, or leave everything unchecked to draw from all
              chapters.
            </p>
            <div className="border border-line rounded-[3px] divide-y divide-line-light bg-white">
              {sections.map((section, idx) => (
                <div key={section.title}>
                  <button
                    onClick={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
                    className="w-full flex items-center justify-between px-5 py-3 text-left"
                  >
                    <span className="font-medium text-ink text-sm">{section.title}</span>
                    {expandedSection === idx ? (
                      <ChevronUp className="w-4 h-4 text-ink700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-ink700" />
                    )}
                  </button>
                  {expandedSection === idx && (
                    <div className="px-5 pb-4 grid sm:grid-cols-2 gap-2">
                      {section.topics.map((topic) => (
                        <label
                          key={topic}
                          className="flex items-start gap-2 text-sm text-ink700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => toggleTopic(topic)}
                            className="mt-0.5 accent-accent-orange"
                          />
                          {topic}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {selectedTopics.length > 0 && (
              <p className="text-xs text-ink700 mt-2">
                {selectedTopics.length} chapter{selectedTopics.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        ) : (
          <div className="mb-8 bg-sand-100 border border-line rounded-[3px] px-5 py-4 text-sm text-ink700">
            Chapter selection isn't set up for {courseLabel} yet — this assignment will draw from
            the full {courseLabel} question bank.
          </div>
        )}

        {/* Difficulty */}
        <div className="mb-8">
          <h2 className="font-sora text-lg font-semibold text-ink mb-4">Difficulty</h2>
          <div className="flex flex-wrap gap-3">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={`px-5 py-2 rounded-[3px] text-sm font-semibold border transition ${
                  difficulty === d.value
                    ? "bg-brand-gradient-alt text-charcoal border-transparent"
                    : "border-line text-ink700 bg-white hover:border-accent-orange"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Number of questions */}
        <div className="mb-8">
          <h2 className="font-sora text-lg font-semibold text-ink mb-4">Number of Questions</h2>
          <div className="flex flex-wrap gap-3">
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setNumQuestions(n)}
                className={`w-16 h-11 rounded-[3px] text-sm font-semibold border transition ${
                  numQuestions === n
                    ? "bg-brand-gradient-alt text-charcoal border-transparent"
                    : "border-line text-ink700 bg-white hover:border-accent-orange"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink700 mt-2">
            Time given: {Math.round((numQuestions * 90) / 60)} minutes (1.5 min/question)
          </p>
        </div>

        {/* Available count + start */}
        <div className="border-t border-line pt-6">
          <div className="mb-4 text-sm">
            {availableCountLoading ? (
              <span className="text-ink700 inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Checking available questions…
              </span>
            ) : availableCount === null ? null : availableCount === 0 ? (
              <span className="text-red-600 font-medium">
                No questions match this selection. Try different chapters or difficulty.
              </span>
            ) : availableCount < numQuestions ? (
              <span className="text-accent-orange2 font-medium">
                Only {availableCount} question{availableCount > 1 ? "s" : ""} available — your
                assignment will have {effectiveMax}.
              </span>
            ) : (
              <span className="text-ink700">{availableCount} questions available.</span>
            )}
          </div>

          {createError && <p className="text-sm text-red-600 mb-4">{createError}</p>}

          <button
            disabled={!canStart}
            onClick={handleStart}
            className="px-8 py-3 bg-brand-gradient text-charcoal font-semibold rounded-[3px] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {creatingAssignment && <Loader2 className="w-4 h-4 animate-spin" />}
            Start Assignment
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomAssignmentSetup;
