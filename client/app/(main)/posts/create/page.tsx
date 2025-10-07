'use client';

import React, { useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { postsAPI } from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const postCategories = [
  'Technology',
  'Programming',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Artificial Intelligence',
  'DevOps',
  'Career',
  'Personal',
  'Tutorial',
  'Other',
];

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  content: Yup.string()
    .required('Content is required')
    .min(100, 'Content must be at least 100 characters'),
  excerpt: Yup.string()
    .max(200, 'Excerpt must be less than 200 characters'),
  category: Yup.string().required('Category is required'),
  tags: Yup.string(),
});

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    multiple: false,
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!user) {
        toast.error('You must be logged in to create a post');
        return;
      }

      setIsSubmitting(true);
      try {
        // Prepare form data for multipart upload
        const formData = new FormData();
        formData.append('title', values.title.trim());
        formData.append('content', values.content.trim());
        formData.append('excerpt', values.excerpt.trim() || values.content.substring(0, 150) + '...');
        formData.append('category', values.category);
        
        // Handle tags
        if (values.tags) {
          const tagsArray = values.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          tagsArray.forEach(tag => formData.append('tags', tag));
        }
        
        // Handle image upload
        if (image) {
          formData.append('image', image);
        }

        // Create the post using the API
        const response = await postsAPI.createPost(formData);
        
        toast.success('Post created successfully!');
        router.push('/posts');
      } catch (error: any) {
        console.error('Error creating post:', error);
        toast.error(error.response?.data?.message || 'Failed to create post');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="mt-2 text-gray-600">Share your thoughts and ideas with the community</p>
      </div>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            {...formik.getFieldProps('title')}
            placeholder="Enter an engaging title for your post"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
          )}
        </div>

        {/* Excerpt Input */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt
          </label>
          <input
            type="text"
            id="excerpt"
            {...formik.getFieldProps('excerpt')}
            placeholder="Brief description of your post (optional)"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            If not provided, the first 150 characters of your content will be used
          </p>
          {formik.touched.excerpt && formik.errors.excerpt && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.excerpt}</p>
          )}
        </div>

        {/* Category and Tags Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              {...formik.getFieldProps('category')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {postCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
            )}
          </div>

          {/* Tags Input */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              {...formik.getFieldProps('tags')}
              placeholder="react, javascript, tutorial"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate tags with commas
            </p>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
            <input {...getInputProps()} />
            {imagePreview ? (
              <div className="space-y-4">
                <img src={imagePreview} alt="Preview" className="mx-auto max-h-48 rounded-lg" />
                <p className="text-sm text-gray-600">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Drop an image here, or click to select</p>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            rows={15}
            {...formik.getFieldProps('content')}
            placeholder="Write your post content here... You can use Markdown formatting!"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
          />
          <div className="mt-2 text-sm text-gray-500">
            <p className="mb-1">You can use Markdown formatting:</p>
            <div className="text-xs space-y-1">
              <p><code className="bg-gray-100 px-1 rounded"># Heading</code> for headings</p>
              <p><code className="bg-gray-100 px-1 rounded">**bold**</code> for bold text</p>
              <p><code className="bg-gray-100 px-1 rounded">*italic*</code> for italic text</p>
              <p><code className="bg-gray-100 px-1 rounded">`code`</code> for inline code</p>
              <p><code className="bg-gray-100 px-1 rounded">```code block```</code> for code blocks</p>
            </div>
          </div>
          {formik.touched.content && formik.errors.content && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.content}</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}