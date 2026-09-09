import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BookOpen, Target, BarChart3, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { logoutMbaStudent } from "../../redux/slices/mbaAuthSlice";
import MbaHeader from "../../components/mba/MbaHeader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const TAB_CONFIG = {
  assignment: { label: "Assignments", icon: BookOpen },
  exam: { label: "Exams", icon: Target },
  performance: { label: "Performance", icon: BarChart3 },
};

const MbaDashboard = () => {
  const [tests, setTests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("assignment");

  const { token, fullName } = useSelector((state) => state.mbaAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/mba/student/tests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(response.data);
      } catch (err) {
        setErrorMsg("Could not load your tests. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [token]);

  useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/mba/student/tests/attempts/history?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data);
      } catch (err) {
        // leave history empty on failure
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  const handleLogout = () => {
    dispatch(logoutMbaStudent());
    navigate("/mba-evaluation");
  };

  const filteredTests = tests.filter((t) => t.type === activeTab);
  const recentHistory = history.slice(-10).reverse(); // most recent first, for the Performance tab

  const testsCompleted = history.length;
  const averageScore = history.length ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length) : null;
  const bestScore = history.length ? Math.max(...history.map((h) => h.score)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper via-white to-accent-yellow/5 font-sans">
      <MbaHeader>
        <span className="text-base text-paper">Welcome, {fullName}</span>
        <button
          onClick={handleLogout}
          className="text-base text-paper border border-line-light rounded px-6 py-3 hover:bg-white/10"
        >
          Log Out
        </button>
      </MbaHeader>

      {/* Hero greeting band */}
      <div className="bg-ink px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-xs tracking-[.14em] uppercase text-accent-orange2 mb-2">MBA Evaluation</div>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-paper tracking-tight mb-2">
            Welcome back, {fullName}
          </h1>
          <p className="text-sand-500">Track your assignments, exams, and performance — all in one place.</p>
          <div className="h-1 w-24 bg-brand-gradient rounded-full mt-4" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* KPI stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-sand-200 rounded-lg p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-brand-gradient flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={20} className="text-charcoal" />
            </div>
            <div>
              <div className="font-sora text-2xl font-bold text-charcoal">
                {historyLoading ? "–" : testsCompleted}
              </div>
              <div className="text-sm text-sand-600">Tests Completed</div>
            </div>
          </div>
          <div className="bg-white border border-sand-200 rounded-lg p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-brand-gradient flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-charcoal" />
            </div>
            <div>
              <div className="font-sora text-2xl font-bold text-charcoal">
                {historyLoading ? "–" : averageScore !== null ? `${averageScore}%` : "—"}
              </div>
              <div className="text-sm text-sand-600">Average Score</div>
            </div>
          </div>
          <div className="bg-white border border-sand-200 rounded-lg p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-brand-gradient flex items-center justify-center flex-shrink-0">
              <Award size={20} className="text-charcoal" />
            </div>
            <div>
              <div className="font-sora text-2xl font-bold text-charcoal">
                {historyLoading ? "–" : bestScore !== null ? `${bestScore}%` : "—"}
              </div>
              <div className="text-sm text-sand-600">Best Score</div>
            </div>
          </div>
        </div>

        {/* Tabs with icons */}
        <div className="flex gap-2 mb-6">
          {Object.entries(TAB_CONFIG).map(([tab, { label, icon: Icon }]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2 rounded font-medium ${
                activeTab === tab
                  ? "bg-brand-gradient text-charcoal"
                  : "bg-white text-sand-900 border border-sand-200"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {activeTab !== "performance" && loading && <p className="text-sand-700">Loading...</p>}
        {activeTab !== "performance" && errorMsg && <p className="text-red-600">{errorMsg}</p>}

        {activeTab !== "performance" && !loading && !errorMsg && filteredTests.length === 0 && (
          <p className="text-sand-700">No {activeTab}s available to you right now.</p>
        )}

        {activeTab !== "performance" && (
          <div className="space-y-4">
            {filteredTests.map((test) => {
              const Icon = TAB_CONFIG[test.type]?.icon || BookOpen;
              return (
                <div key={test._id} className="bg-white border border-sand-200 rounded-lg overflow-hidden">
                  <div className="h-1 bg-brand-gradient" />
                  <div className="p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent-yellow/20 border border-accent-orange2/30 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-accent-orange2" />
                      </div>
                      <div>
                        <h3 className="font-sora text-lg font-semibold text-charcoal">{test.title}</h3>
                        <p className="text-sand-700 text-sm">
                          {test.totalQuestions} questions — {test.timePerQuestionSeconds}s/question
                        </p>
                        {!test.canStart && (
                          <p className="text-sm text-sand-600 mt-1">Already completed</p>
                        )}
                      </div>
                    </div>
                    <button
                      disabled={!test.canStart}
                      onClick={() => navigate(`/mba-evaluation/test/${test._id}`, { state: { testTitle: test.title, testType: test.type } })}
                      className={`font-semibold py-2 px-6 rounded ${
                        test.canStart
                          ? "bg-brand-gradient hover:opacity-90 text-charcoal"
                          : "bg-sand-200 text-sand-600 cursor-not-allowed"
                      }`}
                    >
                      {test.canStart ? "Start" : "Completed"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "performance" && (
          <div className="bg-white border border-sand-200 rounded-lg overflow-hidden">
            <div className="h-1 bg-brand-gradient" />
            <div className="p-6">
              {historyLoading && <p className="text-sand-700">Loading...</p>}
              {!historyLoading && recentHistory.length === 0 && (
                <p className="text-sand-700">No completed assignments or exams yet.</p>
              )}
              {!historyLoading && recentHistory.length > 0 && (
                <>
                  <p className="text-sm text-sand-600 mb-4">
                    Your last {recentHistory.length} completed assignment{recentHistory.length > 1 ? "s" : ""}/exam{recentHistory.length > 1 ? "s" : ""}
                  </p>
                  <div className="space-y-4">
                    {recentHistory.map((h) => (
                      <div key={h.attemptId} className="border-b border-sand-200 pb-3 last:border-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-charcoal">{h.testTitle} <span className="text-xs text-sand-500 capitalize">({h.testType})</span></span>
                          <span className="font-semibold text-accent-orange2">{h.score}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-sand-200 rounded h-4 overflow-hidden">
                            <div className="h-4 bg-brand-gradient" style={{ width: `${h.score}%` }} />
                          </div>
                          <span className="text-xs text-sand-600 w-32 text-right">
                            {h.totalCorrect}/{h.totalQuestions} — {new Date(h.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MbaDashboard;
