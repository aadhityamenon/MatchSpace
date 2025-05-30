const express = require('express');
const stripe = require('stripe')('sk_test_51RUIkLRUznSFQOnvXmFIKu3PAr4GXRPCrkQpx1qj0RCx7VD5XdrInQhQg6DbE9zdck8ZSgtFY8Dg85F50tCWvqYp005Em6FXd9');
const { authenticateToken } = require('../authMiddleware');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Payment = require('../models/Payment');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Create payment intent for booking
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { bookingId, amount, currency = 'usd' } = req.body;
    
    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId).populate('tutor student');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.student._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to pay for this booking' });
    }
    
    if (booking.status === 'paid') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        bookingId: bookingId,
        studentId: req.user.userId,
        tutorId: booking.tutor._id.toString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create payment record
    const payment = new Payment({
      booking: bookingId,
      student: req.user.userId,
      tutor: booking.tutor._id,
      amount,
      currency,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending'
    });
    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

// Confirm payment
router.post('/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, paymentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update payment record
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return res.status(404).json({ message: 'Payment record not found' });
      }

      payment.status = 'completed';
      payment.stripeChargeId = paymentIntent.latest_charge;
      payment.completedAt = new Date();
      await payment.save();

      // Update booking status
      const booking = await Booking.findById(payment.booking);
      booking.status = 'paid';
      booking.paymentStatus = 'paid';
      await booking.save();

      res.json({ 
        success: true, 
        message: 'Payment confirmed successfully',
        payment: payment
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment not completed' 
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
});

// Get payment history for user
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({
      $or: [
        { student: req.user.userId },
        { tutor: req.user.userId }
      ]
    })
    .populate('booking', 'subject dateTime duration')
    .populate('student', 'name email')
    .populate('tutor', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Payment.countDocuments({
      $or: [
        { student: req.user.userId },
        { tutor: req.user.userId }
      ]
    });

    res.json({
      payments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPayments: total
    });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
});

// Get payment details
router.get('/:paymentId', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('booking')
      .populate('student', 'name email')
      .populate('tutor', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user is authorized to view this payment
    if (payment.student._id.toString() !== req.user.userId && 
        payment.tutor._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to view this payment' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Payment details error:', error);
    res.status(500).json({ message: 'Failed to fetch payment details' });
  }
});

// Process refund (admin only)
router.post('/:paymentId/refund', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { amount, reason } = req.body;
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot refund incomplete payment' });
    }

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason || 'requested_by_customer'
    });

    // Update payment record
    payment.status = 'refunded';
    payment.refundAmount = refund.amount / 100;
    payment.refundReason = reason;
    payment.refundedAt = new Date();
    payment.stripeRefundId = refund.id;
    await payment.save();

    // Update booking status
    const booking = await Booking.findById(payment.booking);
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Failed to process refund' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Update payment record
      const payment = await Payment.findOne({ 
        stripePaymentIntentId: paymentIntent.id 
      });
      
      if (payment && payment.status === 'pending') {
        payment.status = 'completed';
        payment.completedAt = new Date();
        await payment.save();

        // Update booking
        const booking = await Booking.findById(payment.booking);
        booking.status = 'paid';
        booking.paymentStatus = 'paid';
        await booking.save();
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      
      // Update payment record
      const failedPaymentRecord = await Payment.findOne({ 
        stripePaymentIntentId: failedPayment.id 
      });
      
      if (failedPaymentRecord) {
        failedPaymentRecord.status = 'failed';
        failedPaymentRecord.failureReason = failedPayment.last_payment_error?.message;
        await failedPaymentRecord.save();
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Get tutor earnings
router.get('/tutor/earnings', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'tutor') {
      return res.status(403).json({ message: 'Tutor access required' });
    }

    const { startDate, endDate } = req.query;
    const dateFilter = {};
    
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchFilter = {
      tutor: req.user.userId,
      status: 'completed'
    };

    if (Object.keys(dateFilter).length > 0) {
      matchFilter.completedAt = dateFilter;
    }

    const earnings = await Payment.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount' },
          totalSessions: { $sum: 1 },
          averageSessionValue: { $avg: '$amount' }
        }
      }
    ]);

    const monthlyEarnings = await Payment.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' }
          },
          earnings: { $sum: '$amount' },
          sessions: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      summary: earnings[0] || {
        totalEarnings: 0,
        totalSessions: 0,
        averageSessionValue: 0
      },
      monthlyBreakdown: monthlyEarnings
    });
  } catch (error) {
    console.error('Earnings fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch earnings' });
  }
});

module.exports = router;