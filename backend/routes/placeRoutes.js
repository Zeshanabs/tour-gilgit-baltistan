const express = require('express');
const {
  getPlaces,
  getPlaceBySlug,
  createPlace,
  updatePlace,
  deletePlace,
} = require('../controllers/placeController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getPlaces).post(protectAdmin, createPlace);
router.route('/:slug').get(getPlaceBySlug).put(protectAdmin, updatePlace).delete(protectAdmin, deletePlace);

module.exports = router;
