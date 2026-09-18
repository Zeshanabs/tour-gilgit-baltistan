const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, 'Day number is required'],
    },
    title: {
      type: String,
      required: [true, 'Itinerary title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Itinerary description is required'],
      trim: true,
    },
  },
  { _id: false }
);

const tourPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tour title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    durationDays: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      trim: true,
    },
    itinerary: {
      type: [itinerarySchema],
      default: [],
    },
    includedPlaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
      },
    ],
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TourPackage', tourPackageSchema);
