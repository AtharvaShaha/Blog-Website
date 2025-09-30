const express = require('express');
const commentController = require('../controllers/comment.controller');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true }); // To access postId from parent router

// Get comments for a post
router.get('/', commentController.getComments);

// Protected routes
router.use(protect);

router.post('/', commentController.createComment);
router.patch('/:commentId', commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);
router.post('/:commentId/like', commentController.toggleLike);

module.exports = router;