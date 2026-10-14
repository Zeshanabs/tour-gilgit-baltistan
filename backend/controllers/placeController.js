const Place = require('../models/Place');
const asyncHandler = require('../middleware/asyncHandler');

const fallbackPlaces = [
  {
    name: 'Hunza Valley',
    district: 'Hunza',
    category: 'Valley',
    shortDescription: 'A high mountain valley lined with apricot orchards, forts and glacier views.',
    fullDescription: 'Hunza Valley is one of the most iconic destinations in Gilgit-Baltistan, known for its dramatic mountain scenery, warm hospitality and old heritage sites. It is a favourite for travellers wanting a mix of village culture and panoramic viewpoints.',
    images: ['https://www.onthegotours.com/repository/Attabad-Lake--Pakistan-1084091763470758_crop_flip_2250_1200_f2f2f2_center-center.jpg'],
    bestTimeToVisit: 'April to October',
    location: { lat: 36.3199, lng: 74.6373 },
    slug: 'hunza-valley',
  },
  {
    name: 'Attabad Lake',
    district: 'Hunza',
    category: 'Lake',
    shortDescription: 'A turquoise lake formed by a landslide, surrounded by steep cliffs and mountain roads.',
    fullDescription: 'Attabad Lake is one of the most photographed spots in Hunza, shining in bright blue against the surrounding Karakoram peaks. Visitors often stop here for boat rides, lakeside walks and scenic viewpoints.',
    images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85'],
    bestTimeToVisit: 'May to October',
    location: { lat: 36.3085, lng: 74.8304 },
    slug: 'attabad-lake',
  },
  {
    name: 'Skardu Valley',
    district: 'Skardu',
    category: 'Valley',
    shortDescription: 'A dramatic Baltistan valley with lakes, deserts and close access to high mountain routes.',
    fullDescription: 'Skardu is the gateway to the high deserts and lakes of Baltistan, offering a mix of mountain drama, local culture and accessible adventure. It is especially loved for its clear skies, broad valleys and easy road trips.',
    images: ['https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85'],
    bestTimeToVisit: 'May to September',
    location: { lat: 35.296, lng: 75.6332 },
    slug: 'skardu-valley',
  },
  {
    name: 'Deosai Plains',
    district: 'Skardu',
    category: 'Plateau',
    shortDescription: 'A vast, open alpine plateau known for wildflowers, wildlife and huge skies.',
    fullDescription: 'The Deosai Plains are among the most awe-inspiring landscapes in Pakistan. During summer, they turn into a wide-open meadowland with grazing animals, wildflowers and sweeping mountain views.',
    images: ['https://upload.wikimedia.org/wikipedia/commons/d/d0/The_Land_of_Giants%2C_Deosai.jpg'],
    bestTimeToVisit: 'June to September',
    location: { lat: 35.108, lng: 75.567 },
    slug: 'deosai-plains',
  },
  {
    name: 'Gilgit City',
    district: 'Gilgit',
    category: 'City',
    shortDescription: 'The gateway city for the region, rich in mountainous scenery and local culture.',
    fullDescription: 'Gilgit City is where many journeys through the north begin, offering bazaars, river views and a practical base for exploring nearby valleys. It is a friendly starting point for travelers heading toward the Karakoram.',
    images: ['https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1400&q=85'],
    bestTimeToVisit: 'April to October',
    location: { lat: 35.918, lng: 74.308 },
    slug: 'gilgit-city',
  },
  {
    name: 'Fairy Meadows',
    district: 'Diamer',
    category: 'Meadow',
    shortDescription: 'A peaceful meadow with unforgettable views of Nanga Parbat.',
    fullDescription: 'Fairy Meadows is a classic mountain escape beneath the north face of Nanga Parbat. It is a favourite stop for travelers seeking a quiet base with dramatic peaks, forest trails and starry nights.',
    images: ['https://upload.wikimedia.org/wikipedia/commons/2/21/Nanga_parbat%2C_fairy_medow%2C_Pak_by_gul791.jpg'],
    bestTimeToVisit: 'May to October',
    location: { lat: 35.352, lng: 74.565 },
    slug: 'fairy-meadows',
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

const getFallbackPlaces = (district) => {
  const filtered = district ? fallbackPlaces.filter((place) => place.district === district) : fallbackPlaces;
  return filtered;
};

const getPlaces = asyncHandler(async (req, res) => {
  try {
    const filter = {};

    if (req.query.district) {
      filter.district = req.query.district;
    }

    const places = await Place.find(filter);
    res.json(places.length ? places : getFallbackPlaces(req.query.district));
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.json(getFallbackPlaces(req.query.district));
    }

    throw error;
  }
});

const getPlaceBySlug = asyncHandler(async (req, res) => {
  try {
    const place = await Place.findOne({ slug: req.params.slug });

    if (!place) {
      const fallbackPlace = getFallbackPlaces().find((item) => item.slug === req.params.slug);

      if (!fallbackPlace) {
        res.status(404);
        throw new Error('Place not found');
      }

      return res.json(fallbackPlace);
    }

    return res.json(place);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      const fallbackPlace = getFallbackPlaces().find((item) => item.slug === req.params.slug);

      if (!fallbackPlace) {
        res.status(404);
        throw new Error('Place not found');
      }

      return res.json(fallbackPlace);
    }

    throw error;
  }
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
