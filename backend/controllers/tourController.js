const TourPackage = require('../models/TourPackage');
const asyncHandler = require('../middleware/asyncHandler');

const fallbackTours = [
  {
    title: 'Hunza Highlights & Lakes',
    slug: 'hunza-highlights-lakes',
    durationDays: 5,
    price: 150000,
    coverImage: 'https://www.onthegotours.com/repository/Attabad-Lake--Pakistan-1084091763470758_crop_flip_2250_1200_f2f2f2_center-center.jpg',
    gallery: ['https://www.onthegotours.com/repository/Attabad-Lake--Pakistan-1084091763470758_crop_flip_2250_1200_f2f2f2_center-center.jpg'],
    summary: 'A relaxed mountain journey through Hunza, Baltit Fort, Karimabad and the famed Attabad Lake.',
    itinerary: [
      { day: 1, title: 'Arrival in Gilgit', description: 'Transfer into the valley and settle in before an evening walk.' },
      { day: 2, title: 'Karimabad & Baltit Fort', description: 'Explore heritage sites and the village viewpoint.' },
      { day: 3, title: 'Attabad Lake', description: 'Visit the turquoise lake and scenic stops along the route.' },
      { day: 4, title: 'Upper Hunza', description: 'Take a scenic drive and enjoy local culture in the high villages.' },
      { day: 5, title: 'Return to Gilgit', description: 'Enjoy a slow departure and last mountain views.' },
    ],
    includedPlaces: [],
    inclusions: ['Transport', 'Accommodation', 'Daily breakfast', 'Guided sightseeing'],
    exclusions: ['International flights', 'Personal expenses'],
  },
  {
    title: 'Skardu & Deosai Escape',
    slug: 'skardu-deosai-escape',
    durationDays: 4,
    price: 120000,
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/The_Land_of_Giants%2C_Deosai.jpg',
    gallery: ['https://upload.wikimedia.org/wikipedia/commons/d/d0/The_Land_of_Giants%2C_Deosai.jpg'],
    summary: 'A scenic Baltistan route covering Skardu, lakes and the views of the Deosai plateau.',
    itinerary: [
      { day: 1, title: 'Arrival in Skardu', description: 'Settle in and explore the town and riverfront.' },
      { day: 2, title: 'Kachura & Shangrila', description: 'Visit the lakes and enjoy a relaxed valley afternoon.' },
      { day: 3, title: 'Deosai Plains', description: 'Drive into the high plateau for panoramic mountain scenery.' },
      { day: 4, title: 'Return journey', description: 'Take in the roads and valleys on the way back.' },
    ],
    includedPlaces: [],
    inclusions: ['Transport', 'Hotel stays', 'Meals', 'Sightseeing'],
    exclusions: ['Trekking gear', 'Personal purchases'],
  },
];

const isDatabaseUnavailable = (error) => {
  const message = error?.message || '';

  return (
    !process.env.MONGO_URI ||
    error?.name === 'MongooseError' ||
    message.includes('buffering timed out') ||
    message.includes('ECONNREFUSED') ||
    message.includes('MongoNetworkError') ||
    message.includes('failed to connect')
  );
};

const getTours = asyncHandler(async (req, res) => {
  try {
    const tours = await TourPackage.find().populate('includedPlaces', 'name district slug');
    res.json(tours.length ? tours : fallbackTours);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.json(fallbackTours);
    }

    throw error;
  }
});

const getTourBySlug = asyncHandler(async (req, res) => {
  try {
    const tour = await TourPackage.findOne({ slug: req.params.slug }).populate(
      'includedPlaces',
      'name district slug'
    );

    if (!tour) {
      const fallbackTour = fallbackTours.find((item) => item.slug === req.params.slug);

      if (!fallbackTour) {
        res.status(404);
        throw new Error('Tour package not found');
      }

      return res.json(fallbackTour);
    }

    return res.json(tour);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      const fallbackTour = fallbackTours.find((item) => item.slug === req.params.slug);

      if (!fallbackTour) {
        res.status(404);
        throw new Error('Tour package not found');
      }

      return res.json(fallbackTour);
    }

    throw error;
  }
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
