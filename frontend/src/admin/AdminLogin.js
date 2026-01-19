import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', result.access_token);
        localStorage.setItem('admin_user', result.username);
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Connection error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-gray via-steel-gray to-dark-gray flex items-center justify-center py-12 px-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-blue rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            S-Steel Admin
          </h1>
          <p className="text-gray-300 mt-2">
            Sign in to manage your website
          </p>
        </div>

        {/* Login Form */}
        <div className="card bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="form-label flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-steel-gray" />
                <span>Username</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Enter your username"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="form-label flex items-center space-x-2">
                <LockClosedIcon className="h-5 w-5 text-steel-gray" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input pr-12 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-steel-gray hover:text-primary-blue"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
            <p className="text-sm text-blue-700">Username: admin</p>
            <p className="text-sm text-blue-700">Password: admin123</p>
            <p className="text-xs text-blue-600 mt-2">
              * Change these credentials in production
            </p>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            ← Back to Website
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
