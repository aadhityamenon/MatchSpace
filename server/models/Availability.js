const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilitySchema = new Schema({
  tutor: {
    type: Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Validate that start time is before end time
AvailabilitySchema.pre('save', function(next) {
  if (this.startTime >= this.endTime) {
    const err = new Error('Start time must be before end time');
    next(err);
  } else {
    next();
  }
});

// Index for efficient querying of availabilities
AvailabilitySchema.index({ tutor: 1, startTime: 1, endTime: 1, isBooked: 1 });

module.exports = mongoose.model('Availability', AvailabilitySchema);