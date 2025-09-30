const express = require('express');
const postController = require('../controllers/post.controller');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);

// Protected routes
router.use(protect);

router.post('/', upload.single('coverImage'), postController.createPost);
router.patch('/:id', upload.single('coverImage'), postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/like', postController.toggleLike);

// Admin only routes
router.get('/stats/all', restrictTo('admin'), postController.getPostStats);

module.exports = router;