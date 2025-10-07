'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, deletePost, likePost } from '../../../redux/features/postsSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Comments from '../../../components/Comments';

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostPage({ params }: PostPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentPost: post, loading, error } = useSelector(
    (state: RootState) => state.posts
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Unwrap the params Promise
  const resolvedParams = React.use(params);

  useEffect(() => {
    dispatch(fetchPostById(resolvedParams.id));
  }, [dispatch, resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <p className="text-center text-gray-600">Post not found.</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Author and date info */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          {post.author?.profilePicture ? (
            <Image
              src={post.author.profilePicture}
              alt={post.author.username || 'User'}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm font-medium">
                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {post.author?.username || 'Unknown User'}
            </p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </p>
          </div>
        </div>
        {user?._id === post.author?._id && (
          <div className="flex items-center space-x-4">
            <Link
              href={`/posts/${post._id}/edit`}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </Link>
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this post?')) {
                  try {
                    await dispatch(deletePost(post._id)).unwrap();
                    router.push('/dashboard');
                  } catch (err) {
                    alert(err instanceof Error ? err.message : 'Failed to delete post');
                  }
                }
              }}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Post title and category */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
      {post.category && (
        <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-6">
          {post.category}
        </span>
      )}

      {/* Post image */}
      {post.coverImage && (
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Post content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Likes and comments stats */}
      <div className="mt-8 flex items-center space-x-8 text-gray-500">
        <button
          onClick={() => {
            if (user) {
              dispatch(likePost(post._id));
            } else {
              router.push('/login');
            }
          }}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
        >
          <svg
            className="w-6 h-6"
            fill={post.likes.includes(user?._id || '') ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{post.likes.length} likes</span>
        </button>
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <span>{Array.isArray(post.comments) ? post.comments.length : 0} comments</span>
        </div>
      </div>

      <Comments postId={post._id} />
    </article>
  );
}