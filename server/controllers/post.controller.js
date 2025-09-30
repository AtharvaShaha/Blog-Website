const Post = require('../models/Post');
const Comment = require('../models/Comment');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');

// Create a new post
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, category, tags } = req.body;
    let coverImage = 'default-post-cover.jpg';

    // Upload image if provided
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'bytejournal/posts'
      });
      coverImage = result.secure_url;
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      category,
      tags: tags ? JSON.parse(tags) : [],
      coverImage,
      author: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts with filters and pagination
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = Post.find()
      .populate('author', 'username profilePicture')
      .sort('-createdAt');

    // Apply filters
    if (req.query.category) {
      query = query.where('category').equals(req.query.category);
    }
    if (req.query.tag) {
      query = query.where('tags').in([req.query.tag]);
    }
    if (req.query.author) {
      query = query.where('author').equals(req.query.author);
    }
    if (req.query.status) {
      query = query.where('status').equals(req.query.status);
    }

    // Search functionality
    if (req.query.search) {
      query = query.or([
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } }
      ]);
    }

    // Execute query with pagination
    const posts = await query.skip(skip).limit(limit);
    const total = await Post.countDocuments(query.getFilter());

    res.status(200).json({
      status: 'success',
      data: {
        posts,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single post
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username profilePicture'
        }
      });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

// Update post
exports.updatePost = async (req, res, next) => {
  try {
    const { title, content, excerpt, category, tags, status } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this post', 403));
    }

    // Upload new image if provided
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'bytejournal/posts'
      });
      post.coverImage = result.secure_url;
    }

    // Update fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.category = category || post.category;
    post.tags = tags ? JSON.parse(tags) : post.tags;
    post.status = status || post.status;

    await post.save();

    res.status(200).json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

// Delete post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this post', 403));
    }

    // Delete associated comments
    await Comment.deleteMany({ post: post._id });

    // Delete post
    await post.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike post
exports.toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    const userIndex = post.likes.indexOf(req.user._id);

    if (userIndex === -1) {
      // Like post
      post.likes.push(req.user._id);
    } else {
      // Unlike post
      post.likes.splice(userIndex, 1);
    }

    await post.save();

    res.status(200).json({
      status: 'success',
      data: {
        likes: post.likes.length,
        isLiked: userIndex === -1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get post statistics (admin only)
exports.getPostStats = async (req, res, next) => {
  try {
    const stats = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: { $size: '$likes' } },
          averageViews: { $avg: '$views' }
        }
      }
    ]);

    const categoryCounts = await Post.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const tagCounts = await Post.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: stats[0],
        categories: categoryCounts,
        tags: tagCounts
      }
    });
  } catch (error) {
    next(error);
  }
};