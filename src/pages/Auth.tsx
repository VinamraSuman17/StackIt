import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Mock user data
        const userData = {
          id: 'user123',
          name: 'John Doe',
          email: formData.email,
          username: 'johndoe'
        };
        
        login(userData);
        navigate('/');
      } else {
        // Register logic
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          setLoading(false);
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Mock user data
        const userData = {
          id: 'user123',
          name: formData.name,
          email: formData.email,
          username: formData.name.toLowerCase().replace(' ', '')
        };
        
        login(userData);
        navigate('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-400 p-4 border-2 border-black shadow-[4px_4px_0px_#000] inline-block mb-4">
              {isLogin ? <FaSignInAlt size={32} /> : <FaUserPlus size={32} />}
            </div>
            <h1 className="text-3xl font-black text-black">
              {isLogin ? 'Welcome Back!' : 'Join StackIt'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Create an account to start asking and answering questions'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="flex items-center space-x-2 text-sm font-bold text-black mb-2">
                  <FaUser />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full p-3 border-2 border-black shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#000] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="flex items-center space-x-2 text-sm font-bold text-black mb-2">
                <FaEnvelope />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full p-3 border-2 border-black shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#000] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-bold text-black mb-2">
                <FaLock />
                <span>Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full p-3 border-2 border-black shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#000] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="flex items-center space-x-2 text-sm font-bold text-black mb-2">
                  <FaLock />
                  <span>Confirm Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full p-3 border-2 border-black shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#000] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-400 text-black border-2 border-black py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 font-bold underline mt-2"
            >
              {isLogin ? 'Create one here' : 'Sign in here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;