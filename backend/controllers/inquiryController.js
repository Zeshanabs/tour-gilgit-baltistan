const Inquiry = require('../models/Inquiry');
const asyncHandler = require('../middleware/asyncHandler');

const createInquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, packageId, preferredDates, numberOfPeople, message } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error('Name, email, and phone are required');
  }

  const inquiry = await Inquiry.create({
    name,
    email,
    phone,
    packageId,
    preferredDates,
    numberOfPeople,
    message,
  });

  res.status(201).json(inquiry);
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
  createInquiry,
  getInquiries,
  updateInquiry,
};
