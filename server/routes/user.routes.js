const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/profile/:id', userController.getProfile);

// Protected routes
router.use(protect);

router.patch('/profile', 
  upload.single('profilePicture'),
  userController.updateProfile
);
router.patch('/change-password', userController.changePassword);
router.delete('/account', userController.deleteAccount);
router.get('/dashboard', userController.getDashboardStats);

// Admin only routes
router.use(restrictTo('admin'));

router.get('/', userController.getAllUsers);
router.patch('/:id/role', userController.updateUserRole);

module.exports = router;