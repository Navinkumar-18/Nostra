const express = require('express');
const router = express.Router();
const { submitContact, getAllContacts, updateContactStatus } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/', protect, admin, getAllContacts);
router.put('/:id', protect, admin, updateContactStatus);

module.exports = router;
