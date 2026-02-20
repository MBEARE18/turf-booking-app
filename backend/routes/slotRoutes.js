const express = require('express');
const router = express.Router();
const {
    createSlots,
    getSlotsByDate,
    updateSlotStatus,
    generateSlotsForDate
} = require('../controllers/slotController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createSlots);

router.post('/generate', protect, admin, generateSlotsForDate);

router.route('/:date')
    .get(getSlotsByDate);

router.route('/id/:id')
    .put(protect, admin, updateSlotStatus);

module.exports = router;
