const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, getAllSubscribers } = require('../controllers/newsletterController');
const { protect, admin } = require('../middleware/auth');

router.post('/subscribe', subscribe);
router.post('/unsubscribe/:email', unsubscribe);
router.get('/subscribers', protect, admin, getAllSubscribers);

module.exports = router;
