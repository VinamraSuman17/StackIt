import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUser, FaSignOutAlt, FaQuestionCircle, FaHome, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white border-b-4 border-black shadow-[0_4px_0px_#000] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-yellow-400 p-2 border-2 border-black shadow-[4px_4px_0px_#000]">
              <FaQuestionCircle size={24} className="text-black" />
            </div>
            <span className="text-2xl font-black text-black">StackIt</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-black hover:text-blue-600 font-semibold transition-colors"
            >
              <FaHome size={16} />
              <span>Home</span>
            </Link>
            <Link
              to="/questions"
              className="flex items-center space-x-1 text-black hover:text-blue-600 font-semibold transition-colors"
            >
              <FaQuestionCircle size={16} />
              <span>Questions</span>
            </Link>
            {user && (
              <Link
                to="/ask-question"
                className="flex items-center space-x-1 bg-green-400 text-black border-2 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
              >
                <FaPlus size={14} />
                <span>Ask Question</span>
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-black hover:text-blue-600 transition-colors"
                  >
                    <FaBell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-black">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <NotificationDropdown
                      notifications={notifications}
                      onClose={() => setShowNotifications(false)}
                    />
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-blue-400 text-black border-2 border-black px-3 py-2 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
                  >
                    <FaUser size={14} />
                    <span>{user.name}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black shadow-[4px_4px_0px_#000] z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-black hover:bg-yellow-100 font-semibold border-b border-black"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaUser className="inline mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-black hover:bg-red-100 font-semibold"
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-400 text-black border-2 border-black px-6 py-2 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;