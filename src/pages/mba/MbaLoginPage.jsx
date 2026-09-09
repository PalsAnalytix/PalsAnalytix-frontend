import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { loginMbaStudent, clearMbaError } from "../../redux/slices/mbaAuthSlice";
import mbaLogo from "../../assets/mba-logo.png";

const MbaLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 font-sans">
      <div className="border border-line rounded-lg bg-white/[0.03] p-10 w-full max-w-md">
        <img src={mbaLogo} alt="PalsAnalytix" className="h-14 mx-auto mb-6" />
        <div className="font-mono text-xs tracking-[.14em] uppercase text-accent-orange2 text-center mb-2">
          MBA Evaluation
        </div>
        <h1 className="font-sora text-2xl font-bold text-paper text-center mb-2 tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-sand-600 text-center mb-8 text-sm">
          Access your assignments and exams
        </p>

        {error && (
          <div className="bg-accent-orange/10 border border-accent-orange/30 text-accent-amber text-sm rounded px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-sand-600 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border border-line-light rounded px-4 py-3 text-paper focus:outline-none focus:border-accent-orange2"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-sand-600 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-line-light rounded px-4 py-3 pr-10 text-paper focus:outline-none focus:border-accent-orange2"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-600 hover:text-paper"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gradient hover:opacity-90 text-charcoal font-semibold py-3 rounded transition duration-300 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MbaLoginPage;
