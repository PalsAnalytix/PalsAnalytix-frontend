import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../redux/slices/authSlice';
import OTPModal from './OTPModal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Loader } from 'lucide-react';

const darkPhoneInputStyle = {
  width: '100%',
  height: '48px',
  fontSize: '16px',
  borderRadius: '3px',
  borderColor: '#3a3733',
  backgroundColor: 'transparent',
  color: '#faf9f6',
  paddingTop: '8px',
  paddingBottom: '8px',
};
const darkPhoneButtonStyle = {
  borderRadius: '3px 0 0 3px',
  borderColor: '#3a3733',
  backgroundColor: '#141311',
};

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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 font-sans">
      <div className="bg-ink border border-line w-full sm:rounded-lg sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-ink p-4 sm:p-6 border-b border-line">
          <div className="flex justify-between items-center">
            <h2 className="font-sora text-xl sm:text-2xl font-bold text-paper">Create Account</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-sand-400 hover:bg-white/10 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-sm">
                {error}
              </div>
            )}
            {passwordMismatch && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-sm">
                Passwords do not match.
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 text-base bg-transparent border border-line-light rounded text-paper placeholder:text-sand-600 focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 text-base bg-transparent border border-line-light rounded text-paper placeholder:text-sand-600 focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
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
                inputStyle={darkPhoneInputStyle}
                buttonStyle={darkPhoneButtonStyle}
                dropdownStyle={{ width: '300px', borderRadius: '6px' }}
                searchStyle={{ width: '100%', margin: '0.5rem 0', padding: '0.75rem', borderRadius: '4px' }}
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
                className="w-full px-4 py-3 text-base bg-transparent border border-line-light rounded text-paper placeholder:text-sand-600 focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none pr-20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sand-500 hover:text-sand-300 text-sm py-1 px-2"
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
                className="w-full px-4 py-3 text-base bg-transparent border border-line-light rounded text-paper placeholder:text-sand-600 focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
                required
              />
            </div>

                       <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-[3px] font-semibold text-base transition flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-sand-700 text-sand-400 cursor-not-allowed'
                  : 'bg-brand-gradient-alt text-charcoal hover:brightness-105'
              }`}
            >
              {loading && <Loader className="animate-spin h-4 w-4" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            {loading && (
              <p className="text-xs text-sand-600 text-center">
                This can take up to a minute if the server's been idle for a while.
              </p>
            )}
          </form>

          <div className="mt-6 text-center">
            <span className="text-sand-500">Already have an account? </span>
            <button
              onClick={onLoginClick}
              className="text-accent-orange2 hover:text-accent-amber font-semibold text-base py-2 transition-colors"
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
