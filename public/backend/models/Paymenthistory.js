import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, User, DollarSign, Download, Eye, RefreshCw, Filter, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/payments/history?page=${currentPage}&limit=10&status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setPayments(data.payments);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'refunded':
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const viewPaymentDetails = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedPayment(data);
        setShowDetails(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch payment details');
    }
  };

  const downloadReceipt = (payment) => {
    // Create a simple receipt download
    const receiptContent = `
      TutorMatch Payment Receipt
      ========================
      
      Payment ID: ${payment._id}
      Date: ${new Date(payment.createdAt).toLocaleDateString()}
      
      Student: ${payment.student.name}
      Tutor: ${payment.tutor.name}
      Subject: ${payment.booking.subject}
      Duration: ${payment.booking.duration} minutes
      
      Amount: $${payment.amount}
      Status: ${payment.status.toUpperCase()}
      
      Thank you for using TutorMatch!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment._id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment History</h2>
        <p className="text-gray-600">View and manage your payment transactions</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payments</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <button
          onClick={fetchPayments}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-500">You haven't made any payments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(payment.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.tutor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.booking.subject} • {payment.booking.duration}min
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          ${payment.amount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewPaymentDetails(payment._id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        {payment.status === 'completed' && (
                          <button
                            onClick={() => downloadReceipt(payment)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Receipt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Payment Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment ID</label>
                <p className="text-sm text-gray-600 font-mono">{selectedPayment._id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Tutor</label>
                <p className="text-sm text-gray-900">{selectedPayment.tutor.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <p className="text-sm text-gray-900">{selectedPayment.booking.subject}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <p className="text-sm text-gray-900">${selectedPayment.amount}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="flex items-center">
                  {getStatusIcon(selectedPayment.status)}
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedPayment.createdAt).toLocaleString()}
                </p>
              </div>
              
              {selectedPayment.status === 'completed' && (
                <button
                  onClick={() => downloadReceipt(selectedPayment)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;