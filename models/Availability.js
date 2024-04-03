const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  available: {
    type: Boolean,
    required: true,
    default: true
  }
});

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
