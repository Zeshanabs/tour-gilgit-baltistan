const express = require('express');
const {
  getTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getTours).post(protectAdmin, createTour);
router.route('/:slug').get(getTourBySlug).put(protectAdmin, updateTour).delete(protectAdmin, deleteTour);

module.exports = router;
