import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const Navbar = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Add event listener to detect clicks outside the dropdown
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const saveUserToDB = async () => {
      if (isAuthenticated && user) {
        try {
          // Send the user data to your backend
          console.log(user);
          const response = await axios.post(`${BASE_URL}/registerdb`, user);
          if (response.data.user.email === ADMIN_EMAIL) {
            console.log(response.data.user.email);
            console.log(ADMIN_EMAIL);
            navigate('/admin');
          }
        } catch (error) {
          console.error('Error registering user:', error);
        }
      }
    };

    saveUserToDB();
  }, [isAuthenticated, user]);

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <div className="flex items-center">
          <h1
            className="text-xl font-bold text-blue-500 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            PalsAnalytix
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <button onClick={() => handleNavigation('/scr')} className="text-gray-700 hover:text-blue-500">
            SCR
          </button>
          <button onClick={() => handleNavigation('/cfa')} className="text-gray-700 hover:text-blue-500">
            CFA
          </button>
          <button onClick={() => handleNavigation('/frm')} className="text-gray-700 hover:text-blue-500">
            FRM
          </button>
          <button onClick={() => handleNavigation('/testseries')} className="text-gray-700 hover:text-blue-500">
            Test Series
          </button>
        </div>
        <div className="flex items-center relative">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="bg-[#FEE154] text-black px-4 py-2 rounded mr-4"
              >
                Account
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2 z-50">
                  <button
                    onClick={() => handleNavigation('/dashboard')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-[#FEE154] text-black px-4 py-2 rounded mr-4"
            >
              Login/Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
