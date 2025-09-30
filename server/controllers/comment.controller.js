const Comment = require('../models/Comment');
const Post = require('../models/Post');
const AppError = require('../utils/AppError');

// Create comment
exports.createComment = async (req, res, next) => {
  try {
    const { content, parent } = req.body;
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Create comment
    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
      parent: parent || null
    });

    // Populate author details
    await comment.populate('author', 'username profilePicture');

    res.status(201).json({
      status: 'success',
      data: { comment }
    });
  } catch (error) {
    next(error);
  }
};

// Get comments for a post
exports.getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get top-level comments first
    const comments = await Comment.find({ post: postId, parent: null })
      .populate('author', 'username profilePicture')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username profilePicture'
        }
      })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ post: postId, parent: null });

    res.status(200).json({
      status: 'success',
      data: {
        comments,
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

// Update comment
exports.updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this comment', 403));
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    await comment.populate('author', 'username profilePicture');

    res.status(200).json({
      status: 'success',
      data: { comment }
    });
  } catch (error) {
    next(error);
  }
};

// Delete comment
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this comment', 403));
    }

    // Delete all replies if it's a parent comment
    if (!comment.parent) {
      await Comment.deleteMany({ parent: comment._id });
    }

    await comment.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Toggle like on comment
exports.toggleLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    const userIndex = comment.likes.indexOf(req.user._id);

    if (userIndex === -1) {
      // Like comment
      comment.likes.push(req.user._id);
    } else {
      // Unlike comment
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    res.status(200).json({
      status: 'success',
      data: {
        likes: comment.likes.length,
        isLiked: userIndex === -1
      }
    });
  } catch (error) {
    next(error);
  }
};