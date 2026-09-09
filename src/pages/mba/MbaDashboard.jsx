import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logoutMbaStudent } from "../../redux/slices/mbaAuthSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const MbaDashboard = () => {
   const [tests, setTests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
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
    if (activeTab !== "performance" || history.length) return;
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/mba/student/tests/attempts/history?limit=10`, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, token]);

  const handleLogout = () => {
    dispatch(logoutMbaStudent());
    navigate("/mba-evaluation");
  };

  const filteredTests = tests.filter((t) => t.type === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MBA Evaluation</h1>
            <p className="text-gray-600">Welcome, {fullName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg px-4 py-2"
          >
            Log Out
          </button>
        </div>

                <div className="flex gap-2 mb-6">
          {["assignment", "exam", "performance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-medium capitalize ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              {tab === "performance" ? "Performance" : `${tab}s`}
            </button>
          ))}
        </div>

        {activeTab !== "performance" && loading && <p className="text-gray-600">Loading...</p>}
        {activeTab !== "performance" && errorMsg && <p className="text-red-600">{errorMsg}</p>}

        {activeTab !== "performance" && !loading && !errorMsg && filteredTests.length === 0 && (
          <p className="text-gray-600">No {activeTab}s available to you right now.</p>
        )}

        {activeTab !== "performance" && (
          <div className="space-y-4">
            {filteredTests.map((test) => (
              <div key={test._id} className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {test.totalQuestions} questions — {test.timePerQuestionSeconds}s/question
                  </p>
                  {!test.canStart && (
                    <p className="text-sm text-gray-500 mt-1">Already completed</p>
                  )}
                </div>
                <button
                  disabled={!test.canStart}
                  onClick={() => navigate(`/mba-evaluation/test/${test._id}`)}
                  className={`font-semibold py-2 px-6 rounded-lg ${
                    test.canStart
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {test.canStart ? "Start" : "Completed"}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "performance" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            {historyLoading && <p className="text-gray-600">Loading...</p>}
            {!historyLoading && history.length === 0 && (
              <p className="text-gray-600">No completed assignments or exams yet.</p>
            )}
            {!historyLoading && history.length > 0 && (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Your last {history.length} completed assignment{history.length > 1 ? "s" : ""}/exam{history.length > 1 ? "s" : ""}
                  {" "}— average: {Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)}%
                </p>
                <div className="space-y-4">
                  {history.map((h) => (
                    <div key={h.attemptId} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900">{h.testTitle} <span className="text-xs text-gray-400 capitalize">({h.testType})</span></span>
                        <span className="font-semibold text-blue-700">{h.score}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded h-4 overflow-hidden">
                          <div className="bg-blue-500 h-4" style={{ width: `${h.score}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-32 text-right">
                          {h.totalCorrect}/{h.totalQuestions} — {new Date(h.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MbaDashboard;
