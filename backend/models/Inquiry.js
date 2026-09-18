const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TourPackage',
    },
    preferredDates: {
      type: String,
      trim: true,
    },
    numberOfPeople: {
      type: Number,
      default: 1,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: 'new',
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
