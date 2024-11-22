import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../redux/slices/authSlice';
import OTPModal from './OTPModal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const SignupModal = ({ onSuccess, onLoginClick, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, otpSent } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);

    try {
      // Format phone number: remove '+' and spaces
      const sanitizedPhone = formData.phone.replace(/[+\s]/g, '');
      const updatedFormData = { ...formData, phone: sanitizedPhone };

      await dispatch(signupUser(updatedFormData)).unwrap();
      setShowOTPModal(true);
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTPModal(false);
    onSuccess();
  };

  const handleOTPClose = () => {
    setShowOTPModal(false);
  };

  const handleOTPLoginClick = () => {
    setShowOTPModal(false);
    onLoginClick();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <button onClick={onClose} className="text-red-500 hover:text-gray-700 text-lg">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}
          {passwordMismatch && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
              Passwords do not match.
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="relative">
            <PhoneInput
              country={'in'}
              value={formData.phone}
              onChange={phone => setFormData({ ...formData, phone })}
              inputProps={{
                required: true,
              }}
              containerStyle={{ width: '100%' }}
              inputStyle={{
                width: '100%',
                height: '42px',
                fontSize: '16px',
                borderRadius: '0.5rem',
                borderColor: '#D1D5DB',
                backgroundColor: 'white'
              }}
              buttonStyle={{
                borderRadius: '0.5rem 0 0 0.5rem',
                borderColor: '#D1D5DB',
                backgroundColor: '#F9FAFB'
              }}
              dropdownStyle={{
                width: '300px',
                borderRadius: '0.5rem',
                borderColor: '#D1D5DB'
              }}
              searchStyle={{
                width: '100%',
                margin: '0.5rem 0',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                borderColor: '#D1D5DB'
              }}
              enableSearch={true}
              disableSearchIcon={true}
              searchPlaceholder="Search country..."
              className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition-colors ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
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

      {showOTPModal && (
        <OTPModal
          onSuccess={handleOTPSuccess}
          onLoginClick={handleOTPLoginClick}
          onClose={handleOTPClose}
          phone={formData.phone}
        />
      )}
    </div>
  );
};

export default SignupModal;