'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    author: {
      _id: string;
      username: string;
      profilePicture?: string;
    };
    category?: string;
    tags?: string[];
    likes: string[];
    createdAt: string;
    views?: number;
  };
}

export default function PostCard({ post }: PostCardProps) {
  // Function to truncate text to a certain length
  const truncateText = (text: string, length: number) => {
    const strippedText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
    if (strippedText.length <= length) return strippedText;
    return `${strippedText.slice(0, length)}...`;
  };

  return (
  <article className="bg-amber-50/80 dark:bg-amber-900/40 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 overflow-hidden backdrop-blur-sm border border-amber-100/40">
      <Link href={`/posts/${post._id}`} className="block">
        {post.coverImage ? (
          <div className="relative h-44 w-full bg-gray-100/60">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute top-3 left-3">
              {post.category && (
                <span className="bg-white/80 text-xs text-blue-700 px-2 py-1 rounded-full font-medium">
                  {post.category}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="h-44 w-full bg-gradient-to-r from-gray-100/60 to-gray-50/60 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        <div className="p-5">
          <h3 className="text-lg font-semibold text-amber-900 mb-2" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{post.title}</h3>
          <p className="text-sm text-amber-800 mb-4" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{post.excerpt || truncateText(post.content, 160)}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {post.author?.profilePicture ? (
                  <Image
                    src={post.author.profilePicture}
                    alt={post.author.username || 'User'}
                    width={28}
                    height={28}
                    className="rounded-full"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                    {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="ml-2">
                  <div className="text-sm text-gray-900">{post.author?.username || 'Unknown'}</div>
                  <div className="text-xs text-gray-400">{formatDistanceToNow(new Date(post.createdAt))} ago</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{post.likes?.length || 0}</span>
              </div>
              <div className="text-gray-400">·</div>
              <div className="text-gray-500">{post.views || 0} views</div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}