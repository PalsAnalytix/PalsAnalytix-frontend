import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginMbaStudent, clearMbaError } from "../../redux/slices/mbaAuthSlice";

const MbaLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.mbaAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearMbaError());
    const result = await dispatch(loginMbaStudent({ username, password }));
    if (loginMbaStudent.fulfilled.match(result)) {
      navigate("/mba-evaluation/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">MBA Evaluation</h1>
        <p className="text-gray-600 text-center mb-6">Sign in to access your assignments and exams</p>
        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MbaLoginPage;
