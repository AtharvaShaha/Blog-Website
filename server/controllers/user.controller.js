const User = require('../models/User');
const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken');
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Get user's post count and total likes received
    const stats = await Post.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          posts: { $sum: 1 },
          totalLikes: { $sum: { $size: '$likes' } },
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: { 
        user,
        stats: stats[0] || { posts: 0, totalLikes: 0, totalViews: 0 }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, bio } = req.body;
    
    // Check if user exists
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if username is taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return next(new AppError('Username is already taken', 400));
      }
      user.username = username;
    }

    // Update profile picture if provided
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'bytejournal/profiles'
      });
      user.profilePicture = result.secure_url;
    }

    // Update bio
    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();

    // Remove sensitive information
    user.password = undefined;
    user.refreshToken = undefined;

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete user account
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Delete all user's posts and their comments
    const userPosts = await Post.find({ author: user._id });
    for (const post of userPosts) {
      await Comment.deleteMany({ post: post._id });
      await post.deleteOne();
    }

    // Delete user's comments on other posts
    await Comment.deleteMany({ author: user._id });

    // Delete the user
    await user.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Get user's dashboard stats (for the authenticated user)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get user's posts stats
    const postStats = await Post.aggregate([
      { $match: { author: req.user._id } },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          publishedPosts: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'published'] }, 1, 0] 
            }
          },
          draftPosts: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] 
            }
          },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: { $size: '$likes' } }
        }
      }
    ]);

    // Get top posts
    const topPosts = await Post.find({ author: req.user._id })
      .sort('-views')
      .limit(5)
      .select('title views likes createdAt');

    // Get recent activity (posts and comments)
    const recentActivity = await Promise.all([
      Post.find({ author: req.user._id })
        .sort('-createdAt')
        .limit(5)
        .select('title createdAt status'),
      Comment.find({ author: req.user._id })
        .sort('-createdAt')
        .limit(5)
        .populate('post', 'title')
        .select('content createdAt')
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: postStats[0] || {
          totalPosts: 0,
          publishedPosts: 0,
          draftPosts: 0,
          totalViews: 0,
          totalLikes: 0
        },
        topPosts,
        recentActivity: {
          posts: recentActivity[0],
          comments: recentActivity[1]
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin only: Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = User.find()
      .select('-password -refreshToken')
      .sort('-createdAt');

    // Search by username or email
    if (req.query.search) {
      query = query.or([
        { username: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ]);
    }

    const users = await query.skip(skip).limit(limit);
    const total = await User.countDocuments(query.getFilter());

    res.status(200).json({
      status: 'success',
      data: {
        users,
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

// Admin only: Update user role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return next(new AppError('Invalid role', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { 
        new: true,
        runValidators: true,
        select: '-password -refreshToken'
      }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};