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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:rounded-2xl sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 sm:p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Create Account</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm">
                {error}
              </div>
            )}
            {passwordMismatch && (
              <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm">
                Passwords do not match.
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  height: '48px',
                  fontSize: '16px',
                  borderRadius: '0.75rem',
                  borderColor: '#D1D5DB',
                  backgroundColor: 'white',
                  paddingTop: '8px',
                  paddingBottom: '8px'
                }}
                buttonStyle={{
                  borderRadius: '0.75rem 0 0 0.75rem',
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB',
                  padding: '8px'
                }}
                dropdownStyle={{
                  width: '300px',
                  borderRadius: '0.75rem',
                  borderColor: '#D1D5DB'
                }}
                searchStyle={{
                  width: '100%',
                  margin: '0.5rem 0',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  borderColor: '#D1D5DB'
                }}
                enableSearch={true}
                disableSearchIcon={true}
                searchPlaceholder="Search country..."
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none pr-20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm py-1 px-2"
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
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold text-base transition-colors ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800'
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={onLoginClick}
              className="text-blue-600 hover:text-blue-700 active:text-blue-800 font-semibold text-base py-2"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {showOTPModal && (
        <OTPModal
          onSuccess={handleOTPSuccess}
          onLoginClick={handleOTPLoginClick}
          onClose={handleOTPClose}
          email={formData.email}
        />
      )}
    </div>
  );
};

export default SignupModal;