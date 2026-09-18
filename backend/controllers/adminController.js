const Place = require('../models/Place');
const TourPackage = require('../models/TourPackage');
const Inquiry = require('../models/Inquiry');
const asyncHandler = require('../middleware/asyncHandler');

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

const getInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find().populate('packageId', 'title slug');
  res.json(inquiries);
});

const updateInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    res.status(404);
    throw new Error('Inquiry not found');
  }
  inquiry.status = req.body.status || inquiry.status;
  await inquiry.save();
  res.json(inquiry);
});

module.exports = {
  createPlace,
  updatePlace,
  deletePlace,
  createTour,
  updateTour,
  deleteTour,
  getInquiries,
  updateInquiry,
};
