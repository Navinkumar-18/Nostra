const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', markReviewHelpful);

module.exports = router;
