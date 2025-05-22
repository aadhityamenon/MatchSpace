const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutor: {
    type: Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  availability: {
    type: Schema.Types.ObjectId,
    ref: 'Availability',
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
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  amount: {
    type: Number,
    required: true
  },
  meetingLink: {
    type: String
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    createdAt: {
      type: Date
    }
  },
  cancellationReason: {
    type: String
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

// Pre-save middleware
BookingSchema.pre('save', async function(next) {
  try {
    // If this is a new booking (not an update)
    if (this.isNew) {
      // Update the related availability to mark it as booked
      const Availability = mongoose.model('Availability');
      await Availability.findByIdAndUpdate(this.availability, { isBooked: true });
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Method to cancel booking
BookingSchema.methods.cancel = async function(reason) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  
  // Free up the availability slot
  const Availability = mongoose.model('Availability');
  await Availability.findByIdAndUpdate(this.availability, { isBooked: false });
  
  return this.save();
};

// Method to add rating
BookingSchema.methods.addRating = function(score, comment) {
  this.rating = {
    score,
    comment,
    createdAt: new Date()
  };
  
  return this.save();
};

// Index for efficient querying
BookingSchema.index({ student: 1, createdAt: -1 });
BookingSchema.index({ tutor: 1, createdAt: -1 });
BookingSchema.index({ status: 1, startTime: 1 });

module.exports = mongoose.model('Booking', BookingSchema);