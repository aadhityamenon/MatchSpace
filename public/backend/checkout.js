import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { CreditCard, Lock, Check, AlertCircle } from 'lucide-react';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ booking, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentId, setPaymentId] = useState('');

  useEffect(() => {
    createPaymentIntent();
  }, [booking]);

  const createPaymentIntent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: booking._id,
          amount: booking.totalCost,
          currency: 'usd'
        })
      });

      const data = await response.json();
      if (response.ok) {
        setClientSecret(data.clientSecret);
        setPaymentId(data.paymentId);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to initialize payment');
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: booking.student.name,
            email: booking.student.email
          }
        }
      }
    );

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else if (paymentIntent.status === 'succeeded') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/payments/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            paymentId: paymentId
          })
        });

        const data = await response.json();
        if (response.ok) {
          onSuccess(data.payment);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Payment confirmation failed');
      }
      setIsLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#9e2146'
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 flex items-center">
          <CreditCard className="mr-2" />
          Payment Details
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Session with {booking.tutor.name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subject:</span>
            <span className="font-medium">{booking.subject}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{booking.duration} minutes</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {new Date(booking.dateTime).toLocaleDateString()}
            </span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>${booking.totalCost}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="p-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
        <Lock className="h-4 w-4 text-green-600 mr-2" />
        <span className="text-green-700 text-sm">
          Your payment information is secure and encrypted
        </span>
      </div>

      <button
        onClick={handlePayment}
        disabled={!stripe || isLoading || !clientSecret}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        ) : (
          <CreditCard className="h-5 w-5 mr-2" />
        )}
        {isLoading ? 'Processing...' : `Pay $${booking.totalCost}`}
      </button>

      <p className="text-xs text-gray-500 mt-4 text-center">
        By completing this payment you agree to our terms of service
      </p>
    </div>
  );
};

const Checkout = ({ booking, onSuccess, onError, onCancel }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handleSuccess = (payment) => {
    setPaymentDetails(payment);
    setShowSuccess(true);
    if (onSuccess) onSuccess(payment);
  };

  const handleError = (error) => {
    if (onError) onError(error);
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600 mb-4">
          Your tutoring session has been booked and confirmed.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600">
            Payment ID: {paymentDetails?._id}
          </p>
          <p className="text-sm text-gray-600">
            Amount: ${paymentDetails?.amount}
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={onCancel}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Booking
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <p className="text-gray-600">Secure checkout for your tutoring session</p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            booking={booking}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Elements>
      </div>
    </div>
  );
};

export default Checkout;