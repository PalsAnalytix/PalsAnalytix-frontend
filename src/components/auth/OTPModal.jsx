import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP } from '../../redux/slices/authSlice';

const OTPModal = ({ onSuccess, onLoginClick, onClose, email }) => {
  const dispatch = useDispatch();
  const { loading, error, otpSent, otpVerified } = useSelector((state) => state.auth);
  console.log(email)
  
  const [otp, setOTP] = useState('');

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyOTP({ email, otp })).unwrap();
      onSuccess();
    } catch (err) {
      // Error handled by reducer
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
          <button 
            onClick={onClose} 
            className="text-red-500 hover:text-gray-700 text-lg"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}

        {otpVerified ? (
          <div className="mb-4 p-3 bg-green-50 text-green-500 rounded-md text-sm">
            OTP verified successfully!
          </div>
        ) : (
          <form onSubmit={handleOTPVerification} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                maxLength="6"
                pattern="\d{6}"
                title="Please enter a 6-digit OTP"
              />
              <p className="text-sm text-gray-500 mt-2">
                Please enter the 6-digit OTP sent to your Email Id - {email}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className={`w-full py-2 rounded-lg text-white font-semibold transition-colors ${
                loading || otp.length !== 6
                  ? 'bg-blue-400'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={onLoginClick}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;