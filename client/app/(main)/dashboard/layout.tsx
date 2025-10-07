'use client';

import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '../../redux/features/authSlice';
import { RootState } from '../../redux/store';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and Redux state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logout());
      router.push('/');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar */}
        <nav className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-900">ByteJournal</h1>
            {user && (
              <p className="text-sm text-gray-600 mt-1">Welcome, {user.username}!</p>
            )}
          </div>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/posts"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              All Posts
            </Link>
            <Link
              href="/posts/create"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              Create Post
            </Link>
            <Link
              href="/dashboard/posts"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              My Posts
            </Link>
            <Link
              href="/dashboard/settings"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              Settings
            </Link>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Main content */}
        <div className="ml-64 p-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}