import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const OPTION_LETTERS = ["A", "B", "C"];

const MbaResultsPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.mbaAuth);

  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };
    const fetchAll = async () => {
      try {
        const [resultsRes, historyRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/mba/student/tests/attempts/${attemptId}/results`, authHeader),
          axios.get(`${BASE_URL}/api/mba/student/tests/attempts/history`, authHeader),
        ]);
        setResults(resultsRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        setErrorMsg(err.response?.data?.error || "Could not load results.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [attemptId, token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading results...</div>;
  if (errorMsg) return <div className="min-h-screen flex items-center justify-center text-red-600">{errorMsg}</div>;

  const avgOfHistory = history.length
    ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
    : null;
  const maxScoreForBars = Math.max(...history.map((h) => h.score), 100);

  return (
    <>
      <style>{`
        @media print {
          .screen-only { display: none !important; }
          .print-only { display: block !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* ---------- ON-SCREEN DASHBOARD ---------- */}
      <div className="screen-only min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Score: {results.score}%</h1>
            <p className="text-gray-700">
              {results.totalCorrect} correct out of {results.totalQuestions}
            </p>
            {results.autoSubmitted && (
              <p className="text-sm text-gray-500 mt-1 italic">Auto-submitted when time ran out</p>
            )}
          </div>

          {history.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Your Recent Performance</h2>
              <p className="text-sm text-gray-500 mb-4">
                Last {history.length} assignment{history.length > 1 ? "s" : ""}/exam{history.length > 1 ? "s" : ""}
                {avgOfHistory !== null && ` — average: ${avgOfHistory}%`}
              </p>
              <div className="space-y-3">
                {history.map((h) => {
                  const isCurrent = h.attemptId === attemptId;
                  return (
                    <div key={h.attemptId} className="flex items-center gap-3">
                      <span className={`w-40 truncate text-sm ${isCurrent ? "font-bold text-blue-700" : "text-gray-700"}`}>
                        {h.testTitle} {isCurrent && "(this one)"}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded h-5 overflow-hidden">
                        <div
                          className={`h-5 ${isCurrent ? "bg-blue-600" : "bg-gray-400"}`}
                          style={{ width: `${(h.score / maxScoreForBars) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-sm font-medium">{h.score}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-lg"
            >
              Print / Save Answers as PDF
            </button>
            <button
              onClick={() => navigate("/mba-evaluation/dashboard")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* ---------- PRINT-ONLY DETAILED ANSWER REVIEW ---------- */}
      <div className="print-only px-4 py-6">
        <h1 className="text-xl font-bold mb-1">{results.score}% — {results.totalCorrect}/{results.totalQuestions} correct</h1>
        {results.autoSubmitted && <p className="text-sm italic mb-4">Auto-submitted when time ran out</p>}
        <div className="space-y-4 mt-4">
          {results.review.map((r, i) => {
            const status =
              r.answerGiven === null || r.answerGiven === undefined
                ? "unanswered"
                : r.isCorrect
                ? "correct"
                : "incorrect";
            return (
              <div key={i} style={{ borderLeft: `4px solid ${status === "correct" ? "#036b26" : status === "incorrect" ? "#8a1c1c" : "#999"}`, padding: "10px", pageBreakInside: "avoid" }}>
                <p style={{ fontWeight: "bold" }}>Q{i + 1}: {r.text}</p>
                {r.questionImage && <img src={r.questionImage} alt="" style={{ maxWidth: "300px", margin: "6px 0" }} />}
                {r.options.map((opt, idx) => {
                  const letter = OPTION_LETTERS[idx];
                  const isCorrectOpt = idx === r.correctOptionIndex;
                  const isUserAnswer = idx === r.answerGiven;
                  let tag = "";
                  if (isCorrectOpt) tag = "(Correct answer)";
                  if (isUserAnswer && !r.isCorrect) tag = "(Your answer — incorrect)";
                  if (isUserAnswer && r.isCorrect) tag = "(Your answer — correct)";
                  return (
                    <div key={idx}>{letter}. {opt} {tag}</div>
                  );
                })}
                {r.solution && <p style={{ marginTop: "6px", fontStyle: "italic" }}><b>Solution:</b> {r.solution}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MbaResultsPage;
