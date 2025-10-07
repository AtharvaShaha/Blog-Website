import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { postsAPI } from '../../../lib/api';

interface Post {
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
  comments: any[]; // Array of comment objects from virtual populate
  views?: number;
  createdAt: string;
  updatedAt: string;
}

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  totalPosts: number;
  hasMore: boolean;
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  totalPosts: 0,
  hasMore: true,
};

// Async thunks for API calls
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const response = await postsAPI.getAllPosts({ page, limit });
    return response.data;
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: FormData) => {
    const response = await postsAPI.createPost(postData);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }: { id: string; postData: FormData }) => {
    const response = await postsAPI.updatePost(id, postData);
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string) => {
    await postsAPI.deletePost(id);
    return id;
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: string) => {
    const response = await postsAPI.getPost(id);
    return response.data;
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (id: string) => {
    const response = await postsAPI.likePost(id);
    return { postId: id, ...response.data };
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    resetPosts: (state) => {
      state.posts = [];
      state.hasMore = true;
      state.totalPosts = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        // Handle nested response structure from backend
        const responseData = action.payload.data || action.payload;
        const posts = responseData.posts || [];
        const pagination = responseData.pagination || {};
        
        state.posts = [...state.posts, ...posts];
        state.totalPosts = pagination.total || posts.length;
        state.hasMore = state.posts.length < (pagination.total || posts.length);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        const post = action.payload.data?.post || action.payload;
        state.posts.unshift(post);
        state.totalPosts += 1;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create post';
      })
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPost = action.payload.data?.post || action.payload;
        const index = state.posts.findIndex((post) => post._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
        if (state.currentPost?._id === updatedPost._id) {
          state.currentPost = updatedPost;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update post';
      })
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.totalPosts -= 1;
        if (state.currentPost?._id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete post';
      })
      // Fetch single post
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        // Handle nested response structure from backend
        state.currentPost = action.payload.data?.post || action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch post';
      })
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        const likes = data?.likes || [];
        
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.likes = likes;
        }
        if (state.currentPost && state.currentPost._id === postId) {
          state.currentPost.likes = likes;
        }
      });
  },
});

export const { clearCurrentPost, resetPosts } = postsSlice.actions;
export default postsSlice.reducer;