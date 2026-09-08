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
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/mba/student/tests/attempts/${attemptId}/results`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(response.data);
      } catch (err) {
        setErrorMsg(err.response?.data?.error || "Could not load results.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [attemptId, token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading results...</div>;
  if (errorMsg) return <div className="min-h-screen flex items-center justify-center text-red-600">{errorMsg}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-10">
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

        <div className="space-y-4">
          {results.review.map((r, i) => {
            const status =
              r.answerGiven === null || r.answerGiven === undefined
                ? "unanswered"
                : r.isCorrect
                ? "correct"
                : "incorrect";
            const borderColor =
              status === "correct" ? "border-l-green-700" : status === "incorrect" ? "border-l-red-700" : "border-l-gray-400";

            return (
              <div key={i} className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${borderColor}`}>
                <p className="font-semibold text-gray-900 mb-2">Q{i + 1}: {r.text}</p>
                {r.questionImage && <img src={r.questionImage} alt="" className="max-w-full rounded-lg mb-3" />}
                <div className="space-y-1">
                  {r.options.map((opt, idx) => {
                    const letter = OPTION_LETTERS[idx];
                    const isCorrectOpt = idx === r.correctOptionIndex;
                    const isUserAnswer = idx === r.answerGiven;
                    let tag = "";
                    if (isCorrectOpt) tag = "✓ Correct answer";
                    if (isUserAnswer && !r.isCorrect) tag = "✗ Your answer";
                    if (isUserAnswer && r.isCorrect) tag = "✓ Your answer";
                    return (
                      <div key={idx} className="text-gray-800">
                        <span className="font-medium">{letter}.</span> {opt}{" "}
                        {tag && <span className="text-sm font-semibold ml-1">({tag})</span>}
                      </div>
                    );
                  })}
                </div>
                {r.solution && (
                  <div className="bg-gray-50 rounded-lg p-3 mt-3 text-sm text-gray-700">
                    <b>Solution:</b> {r.solution}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigate("/mba-evaluation/dashboard")}
          className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MbaResultsPage;
