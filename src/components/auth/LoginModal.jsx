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
      // Format phone number: remove '+' and spaces
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
      // Error is handled by the reducer
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <button onClick={onClose} className="rounded-md text-lg text-red-500 hover:text-gray-700">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
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

          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition-colors ${
              loading ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center flex justify-between">
          <button
            onClick={onSignupClick}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Register
          </button>
          <button
            onClick={() => alert('Forgot Password functionality')}
            className="block text-blue-600 hover:text-blue-700 font-semibold"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;