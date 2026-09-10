import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetPassword, clearError } from '../../redux/slices/authSlice';

const ForgotPasswordModal = ({ isOpen, onClose, onLoginClick }) => {
  const dispatch = useDispatch();
  const { loading, error, resetPasswordStatus } = useSelector((state) => state.auth);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setFormError('Phone number is required');
      return;
    }
    try {
      await dispatch(forgotPassword(phoneNumber)).unwrap();
    } catch (err) {
      // Error is handled by the reducer
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    try {
      await dispatch(resetPassword({ phoneNumber, otp, newPassword })).unwrap();
      onClose();
    } catch (err) {
      // Error is handled by the reducer
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto font-sans ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
        
        <div className="relative w-full max-w-md rounded-lg bg-ink border border-line p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-sora text-2xl font-bold text-paper">
              Reset Password
            </h2>
            <button onClick={onClose} className="text-sand-400 hover:text-paper">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {(error || formError) && (
            <div className="mb-4 rounded bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
              {error || formError}
            </div>
          )}

          {resetPasswordStatus !== 'otpSent' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <p className="text-sand-500 text-sm">
                Enter the phone number on your account and we'll send you a verification code.
              </p>
              <div>
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded px-4 py-2 bg-transparent border border-line-light text-paper placeholder:text-sand-600 focus:border-accent-orange2 focus:outline-none focus:ring-1 focus:ring-accent-orange2"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-[3px] py-2 font-semibold transition
                  ${loading ? 'bg-sand-700 text-sand-400 cursor-not-allowed' : 'bg-brand-gradient-alt text-charcoal hover:brightness-105'}`}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded px-4 py-2 bg-transparent border border-line-light text-paper placeholder:text-sand-600 focus:border-accent-orange2 focus:outline-none focus:ring-1 focus:ring-accent-orange2"
                  maxLength={6}
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded px-4 py-2 bg-transparent border border-line-light text-paper placeholder:text-sand-600 focus:border-accent-orange2 focus:outline-none focus:ring-1 focus:ring-accent-orange2"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded px-4 py-2 bg-transparent border border-line-light text-paper placeholder:text-sand-600 focus:border-accent-orange2 focus:outline-none focus:ring-1 focus:ring-accent-orange2"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-[3px] py-2 font-semibold transition
                  ${loading ? 'bg-sand-700 text-sand-400 cursor-not-allowed' : 'bg-brand-gradient-alt text-charcoal hover:brightness-105'}`}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}

          {onLoginClick && (
            <div className="mt-6 text-center">
              <button
                onClick={onLoginClick}
                className="text-accent-orange2 hover:text-accent-amber font-semibold text-sm transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
