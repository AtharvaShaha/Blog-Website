const User = require('../models/User');
const AppError = require('../utils/AppError');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(new AppError('User with this email or username already exists', 400));
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Remove password from output
    user.password = undefined;

    // Set cookies
    res.cookie('token', token, cookieOptions);
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(201).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Remove password from output
    user.password = undefined;

    // Set cookies
    res.cookie('token', token, cookieOptions);
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new AppError('No refresh token found', 401));
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError('User not found or token revoked', 401));
    }

    // Generate new tokens
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new cookies
    res.cookie('token', newToken, cookieOptions);
    res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      status: 'success',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  // Clear refresh token in database
  if (req.user) {
    req.user.refreshToken = undefined;
    await req.user.save();
  }

  // Clear cookies
  res.cookie('token', 'logged out', { ...cookieOptions, maxAge: 0 });
  res.cookie('refreshToken', 'logged out', { ...cookieOptions, maxAge: 0 });

  res.status(200).json({ status: 'success' });
};

// Google OAuth handlers
exports.googleCallback = async (req, res, next) => {
  try {
    const token = generateToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    // Save refresh token
    req.user.refreshToken = refreshToken;
    await req.user.save();

    // Set cookies
    res.cookie('token', token, cookieOptions);
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    // Redirect to frontend
    res.redirect(`${process.env.CLIENT_URL}/auth/success`);
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};