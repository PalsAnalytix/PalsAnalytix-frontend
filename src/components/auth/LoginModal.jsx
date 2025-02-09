import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onSuccess, onSignupClick, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sanitizedPhone = formData.phone.replace(/[+\s]/g, '');
      const loginData = { ...formData, phone: sanitizedPhone };
      
      const result = await dispatch(loginUser(loginData)).unwrap();
      if (result.user.isAdmin) {
        navigate('/admin');
        onSuccess();
      } else {
        navigate('/');
      }
      onSuccess();
    } catch (err) {
      // Error handled by showing simplified message
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:rounded-2xl sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 sm:p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Login</h2>
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
                Unable to log in. Please check your credentials and try again.
              </div>
            )}
            
            <div className="relative">
              <PhoneInput
                country={'in'}
                value={formData.phone}
                onChange={phone => setFormData({ ...formData, phone })}
                inputProps={{
                  required: true,
                  placeholder: "Phone Number"
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

            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold text-base transition-colors ${
                loading ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={onSignupClick}
              className="text-blue-600 hover:text-blue-700 active:text-blue-800 font-semibold text-base py-2"
            >
              Register
            </button>
            <button
              onClick={() => alert('Forgot Password functionality')}
              className="text-blue-600 hover:text-blue-700 active:text-blue-800 font-semibold text-base py-2"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;