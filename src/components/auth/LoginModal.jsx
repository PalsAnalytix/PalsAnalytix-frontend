import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onSuccess, onSignupClick, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 font-sans">
      <div className="bg-ink border border-line w-full sm:rounded-lg sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-ink p-4 sm:p-6 border-b border-line">
          <div className="flex justify-between items-center">
            <h2 className="font-sora text-xl sm:text-2xl font-bold text-paper">Login</h2>
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
                Unable to log in. Please check your credentials and try again.
              </div>
            )}
            
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

            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 text-base bg-transparent border border-line-light rounded text-paper placeholder:text-sand-600 focus:ring-1 focus:ring-accent-orange2 focus:border-accent-orange2 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-[3px] font-semibold text-base transition ${
                loading
                  ? 'bg-sand-700 text-sand-400'
                  : 'bg-brand-gradient-alt text-charcoal hover:brightness-105'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={onSignupClick}
              className="text-accent-orange2 hover:text-accent-amber font-semibold text-base py-2 transition-colors"
            >
              Register
            </button>
            <button
              onClick={() => alert('Forgot Password functionality')}
              className="text-accent-orange2 hover:text-accent-amber font-semibold text-base py-2 transition-colors"
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
