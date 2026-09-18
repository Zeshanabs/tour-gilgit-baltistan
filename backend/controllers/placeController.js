const Place = require('../models/Place');
const asyncHandler = require('../middleware/asyncHandler');

const getPlaces = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.district) {
    filter.district = req.query.district;
  }

  const places = await Place.find(filter);
  res.json(places);
});

const getPlaceBySlug = asyncHandler(async (req, res) => {
  const place = await Place.findOne({ slug: req.params.slug });

  if (!place) {
    res.status(404);
    throw new Error('Place not found');
  }

  res.json(place);
});

const createPlace = asyncHandler(async (req, res) => {
  const place = await Place.create(req.body);
  res.status(201).json(place);
});

const updatePlace = asyncHandler(async (req, res) => {
  const place = await Place.findOne({ slug: req.params.slug });
  if (!place) {
    res.status(404);
    throw new Error('Place not found');
  }

  Object.assign(place, req.body);
  await place.save();
  res.json(place);
});

const deletePlace = asyncHandler(async (req, res) => {
  const place = await Place.findOne({ slug: req.params.slug });
  if (!place) {
    res.status(404);
    throw new Error('Place not found');
  }

  await place.deleteOne();
  res.json({ message: 'Place removed' });
});

module.exports = {
  getPlaces,
  getPlaceBySlug,
  createPlace,
  updatePlace,
  deletePlace,
};
