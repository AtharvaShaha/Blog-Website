'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { postsAPI } from '../../../lib/api';

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        // Fetch user's posts to calculate stats
        const response = await postsAPI.getAllPosts({ author: user?._id });
        console.log('API Response:', response.data); // Debug log
        
        const userPosts = response.data.data?.posts || response.data.posts || [];
        
        const totalPosts = userPosts.length;
        const totalViews = userPosts.reduce((sum: number, post: any) => sum + (post.views || 0), 0);
        const totalLikes = userPosts.reduce((sum: number, post: any) => sum + (post.likes?.length || 0), 0);
        
        setStats({ totalPosts, totalViews, totalLikes });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {user && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome back, {user.username}!</h2>
          <p className="text-gray-600">{user.email}</p>
          {user.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
        </div>
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Posts</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalPosts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Views</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalViews}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Likes</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalLikes}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a
              href="/posts/create"
              className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create New Post
            </a>
            <a
              href="/posts"
              className="block w-full text-left px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              View All Posts
            </a>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Role:</span> {user?.role || 'User'}</p>
            <p><span className="font-medium">Member since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            <p><span className="font-medium">Email verified:</span> {user?.isEmailVerified ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        {stats.totalPosts > 0 ? (
          <p className="text-gray-600">You have {stats.totalPosts} published posts. Keep up the great work!</p>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't created any posts yet.</p>
            <a
              href="/posts/create"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create Your First Post
            </a>
          </div>
        )}
      </div>
    </div>
  );
}