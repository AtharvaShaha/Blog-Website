'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../redux/features/authSlice';
import toast from 'react-hot-toast';

export default function AuthSuccessPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Get user data from the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/current-user`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Authentication failed');
        }

        const data = await response.json();
        if (data.status === 'success' && data.data.user) {
          dispatch(loginSuccess(data.data.user));
          toast.success('Successfully logged in!');
          router.push('/dashboard');
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        const error = err as Error;
        console.error('Auth error:', error);
        setError(error.message);
        toast.error(error.message || 'Authentication failed');
        // Wait a bit before redirecting to show the error
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    handleAuthSuccess();
  }, [dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {!error ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl text-gray-700">Completing authentication...</h2>
          </>
        ) : (
          <div className="text-red-600">
            <h2 className="text-xl mb-2">Authentication Error</h2>
            <p>{error}</p>
            <p className="text-sm mt-2">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
}