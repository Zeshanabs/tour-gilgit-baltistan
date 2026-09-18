const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      enum: [
        'Gilgit',
        'Hunza',
        'Nagar',
        'Ghizer',
        'Skardu',
        'Shigar',
        'Kharmang',
        'Ghanche',
        'Astore',
        'Diamer',
      ],
    },
    category: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    fullDescription: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    bestTimeToVisit: {
      type: String,
      trim: true,
    },
    location: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Place', placeSchema);
