const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'usd'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  stripePaymentIntentId: {
    type: String,
    required: true
  },
  stripeChargeId: {
    type: String
  },
  stripeRefundId: {
    type: String
  },
  completedAt: {
    type: Date
  },
  refundAmount: {
    type: Number,
    min: 0
  },
  refundReason: {
    type: String
  },
  refundedAt: {
    type: Date
  },
  failureReason: {
    type: String
  },
  platformFee: {
    type: Number,
    default: 0
  },
  tutorEarnings: {
    type: Number
  }
}, {
  timestamps: true
});

// Calculate tutor earnings after platform fee
PaymentSchema.pre('save', function(next) {
  if (this.amount && this.status === 'completed') {
    const feePercentage = 0.10; // 10% platform fee
    this.platformFee = this.amount * feePercentage;
    this.tutorEarnings = this.amount - this.platformFee;
  }
  next();
});

// Index for efficient queries
PaymentSchema.index({ student: 1, createdAt: -1 });
PaymentSchema.index({ tutor: 1, createdAt: -1 });
PaymentSchema.index({ booking: 1 });
PaymentSchema.index({ stripePaymentIntentId: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);