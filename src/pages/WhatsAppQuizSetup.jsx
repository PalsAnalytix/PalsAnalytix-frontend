import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronUp, MessageCircle, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { COURSE_TOPICS, COURSE_LABELS } from "../data/courseTopics";
import {
  fetchWhatsAppQuizPreference,
  saveWhatsAppQuizPreference,
  clearWhatsAppQuizState,
} from "../redux/slices/whatsappQuizSlice";

const DIFFICULTIES = [
  { value: "mixed", label: "Mixed" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const QUESTIONS_PER_DAY_OPTIONS = [1, 3, 5, 10];

const WhatsAppQuizSetup = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const courseLabel = COURSE_LABELS[courseCode] || courseCode;
  const sections = COURSE_TOPICS[courseCode] || [];

  const { preference, loading, saving, error, saveError, savedMessage } = useSelector(
    (state) => state.whatsappQuiz
  );

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [expandedSection, setExpandedSection] = useState(0);
  const [difficulty, setDifficulty] = useState("mixed");
  const [questionsPerDay, setQuestionsPerDay] = useState(3);
  const [active, setActive] = useState(true);

  useEffect(() => {
    dispatch(fetchWhatsAppQuizPreference(courseCode));
    return () => dispatch(clearWhatsAppQuizState());
  }, [courseCode, dispatch]);

  useEffect(() => {
    if (preference) {
      setSelectedTopics(preference.chapters || []);
      setDifficulty(preference.difficulty || "mixed");
      setQuestionsPerDay(preference.questionsPerDay || 3);
      setActive(preference.active || false);
    }
  }, [preference]);

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSave = () => {
    dispatch(
      saveWhatsAppQuizPreference({
        course: courseCode,
        chapters: selectedTopics,
        difficulty,
        questionsPerDay,
        active,
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="text-ink700">Loading…</p>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-6 sm:px-12 py-16 pt-28 max-w-4xl mx-auto w-full">
        <button
          onClick={() => navigate(`/dashboard/course/${courseCode}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink700 hover:text-ink mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {courseLabel}
        </button>

        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-6 h-6 text-accent-orange2" />
          <p className="font-mono text-xs uppercase tracking-widest text-accent-orange">
            WhatsApp Quiz
          </p>
        </div>
        <h1 className="font-sora text-3xl font-semibold text-ink mb-8">{courseLabel}</h1>

        <div className="bg-sand-100 border border-line rounded-[3px] px-5 py-4 text-sm text-ink700 mb-8">
          Daily practice questions (with answers and explanations) will be sent to your
          registered WhatsApp number: <strong>{preference?.phoneNumber || "—"}</strong>.
          {" "}
          <span className="italic">
            (This feature is currently in testing — messages may only arrive if this number
            has been set up to receive them.)
          </span>
        </div>

        {/* Enable/disable */}
        <div className="flex items-center justify-between bg-white border border-line rounded-[3px] px-5 py-4 mb-8">
          <div>
            <p className="font-sora font-semibold text-ink">Daily WhatsApp Quiz</p>
            <p className="text-sm text-ink700">
              {active ? "Currently ON — you'll receive daily questions." : "Currently OFF."}
            </p>
          </div>
          <button
  onClick={() => setActive((a) => !a)}
  className={`w-14 h-8 rounded-full transition-colors relative flex-shrink-0 ${
    active ? "bg-accent-orange" : "bg-sand-300"
  }`}
>
  <span
    className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform duration-200 ${
      active ? "translate-x-6" : "translate-x-0"
    }`}
  />
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
          </div>
        ) : (
          <div className="mb-8 bg-sand-100 border border-line rounded-[3px] px-5 py-4 text-sm text-ink700">
            Chapter selection isn't set up for {courseLabel} yet — questions will be drawn from
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

        {/* Questions per day */}
        <div className="mb-8">
          <h2 className="font-sora text-lg font-semibold text-ink mb-4">Questions Per Day</h2>
          <div className="flex flex-wrap gap-3">
            {QUESTIONS_PER_DAY_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setQuestionsPerDay(n)}
                className={`w-16 h-11 rounded-[3px] text-sm font-semibold border transition ${
                  questionsPerDay === n
                    ? "bg-brand-gradient-alt text-charcoal border-transparent"
                    : "border-line text-ink700 bg-white hover:border-accent-orange"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-line pt-6">
          {saveError && <p className="text-sm text-red-600 mb-4">{saveError}</p>}
          {savedMessage && <p className="text-sm text-green-700 mb-4">{savedMessage}</p>}

          <button
            disabled={saving}
            onClick={handleSave}
            className="px-8 py-3 bg-brand-gradient text-charcoal font-semibold rounded-[3px] hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Preferences
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WhatsAppQuizSetup;
