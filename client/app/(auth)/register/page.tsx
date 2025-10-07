'use client';

import React from 'react';
// Using CSS transitions instead of framer-motion to avoid peer dependency conflicts with React 19
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../redux/features/authSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.auth);
  const [showInfo, setShowInfo] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:5002/api/auth/register', {
          username: values.username,
          email: values.email,
          password: values.password,
        }, {
          withCredentials: true
        });
        const { user, token } = response.data.data;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch(loginSuccess({ user, token }));
        toast.success('Registration successful');
        router.push('/dashboard');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    },
  });

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5002/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left info panel */}
        <aside className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-lg">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold">Create your free ByteJournal account</h1>
            <p className="mt-3 text-slate-200 max-w-md">Share ideas, build your writing portfolio, and connect with developers — fast. Your posts are discoverable and easy to manage.</p>
          </div>

          <ul className="space-y-3 text-slate-200">
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10">✓</span>
              <div>
                <div className="font-medium">Simple editor</div>
                <div className="text-sm text-slate-300">Write with a rich editor and save drafts.</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10">🔒</span>
              <div>
                <div className="font-medium">Privacy controls</div>
                <div className="text-sm text-slate-300">Choose public or private visibility for posts.</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10">⚡</span>
              <div>
                <div className="font-medium">Fast publishing</div>
                <div className="text-sm text-slate-300">Get your thoughts out quickly with one click.</div>
              </div>
            </li>
          </ul>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowInfo(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/8 hover:bg-white/12 rounded-md text-sm"
            >
              Learn why we ask for these details
            </button>
          </div>
        </aside>

  {/* Right form panel (subtle CSS transition on mount) */}
  <div className="p-6 bg-white rounded-xl shadow-md transition-opacity duration-300 ease-out" style={{opacity:1}}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="text-sm text-gray-500">Join the community — it only takes a minute.</p>
            </div>
            <div className="text-sm">
              <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
            </div>
          </div>

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Username</label>
                <input
                  id="username"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="yourname"
                  {...formik.getFieldProps('username')}
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="you@example.com"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Choose a strong password"
                    {...formik.getFieldProps('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-2 text-sm text-gray-500"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Confirm</label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Repeat password"
                  {...formik.getFieldProps('confirmPassword')}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-blue-600" />
              <label htmlFor="terms" className="text-sm text-gray-600">I agree to the <a href="#" className="text-blue-600">Terms</a> and <a href="#" className="text-blue-600">Privacy Policy</a>.</label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center py-2 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">{/* svg paths */}
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                Sign up with Google
              </button>
            </div>
          </div>
  </div>

        {/* Info modal using CSS transitions (fade + translate) */}
        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 transition-opacity duration-200" onClick={() => setShowInfo(false)} />
            <div className="relative z-10 max-w-lg w-full bg-white rounded-lg p-6 shadow-xl transform transition-all duration-300 ease-out translate-y-0">
              <h3 className="text-lg font-semibold">Why we ask for these details</h3>
              <p className="mt-2 text-sm text-gray-600">We request a username and email to create a public profile and allow other users to discover your posts. Your email will also be used for account recovery and notifications. Passwords are stored securely.</p>
              <div className="mt-4 flex justify-end">
                <button onClick={() => setShowInfo(false)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Got it</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}