const TourPackage = require('../models/TourPackage');
const asyncHandler = require('../middleware/asyncHandler');

const getTours = asyncHandler(async (req, res) => {
  const tours = await TourPackage.find().populate('includedPlaces', 'name district slug');
  res.json(tours);
});

const getTourBySlug = asyncHandler(async (req, res) => {
  const tour = await TourPackage.findOne({ slug: req.params.slug }).populate(
    'includedPlaces',
    'name district slug'
  );

  if (!tour) {
    res.status(404);
    throw new Error('Tour package not found');
  }

  res.json(tour);
});

const createTour = asyncHandler(async (req, res) => {
  const tour = await TourPackage.create(req.body);
  res.status(201).json(tour);
});

const updateTour = asyncHandler(async (req, res) => {
  const tour = await TourPackage.findOne({ slug: req.params.slug });
  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  Object.assign(tour, req.body);
  await tour.save();
  res.json(tour);
});

const deleteTour = asyncHandler(async (req, res) => {
  const tour = await TourPackage.findOne({ slug: req.params.slug });
  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  await tour.deleteOne();
  res.json({ message: 'Tour removed' });
});

module.exports = {
  getTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
};
