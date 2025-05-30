import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const StudentDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentTutors, setRecentTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [bookingsRes, messagesRes, favoritesRes, recentTutorsRes] = await Promise.all([
          api.get('/bookings/student'),
          api.get('/messages'),
          api.get('/favorites'),
          api.get('/tutors/recent')
        ]);
        
        setBookings(bookingsRes.data);
        setMessages(messagesRes.data);
        setFavorites(favoritesRes.data);
        setRecentTutors(recentTutorsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        setBookings(bookings.filter(booking => booking._id !== bookingId));
        alert('Booking cancelled successfully');
      } catch (err) {
        console.error('Error cancelling booking:', err);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const removeFavorite = async (tutorId) => {
    try {
      await api.delete(`/favorites/${tutorId}`);
      setFavorites(favorites.filter(fav => fav.tutor._id !== tutorId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert('Failed to remove favorite. Please try again.');
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'bookings':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Your Upcoming Sessions</h2>
            
            {bookings.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">You don't have any upcoming sessions.</p>
                <Link to="/search" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
                  Find a Tutor
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white group">
                    <div className="md:flex justify-between items-center">
                      <div className="md:flex items-center mb-4 md:mb-0">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mr-4 flex items-center justify-center">
                          {booking.tutor.profileImage && (
                            <img 
                              src={booking.tutor.profileImage} 
                              alt={booking.tutor.firstName} 
                              className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{booking.tutor.firstName} {booking.tutor.lastName}</h3>
                          <p className="text-blue-600 text-sm font-medium">{booking.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {new Date(booking.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-gray-600">
                          {new Date(booking.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - 
                          {new Date(booking.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-3">
                      <button 
                        onClick={() => window.location.href = booking.meetingLink}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm shadow-md hover:shadow-lg transition-all"
                      >
                        Join Session
                      </button>
                      <button 
                        onClick={() => cancelBooking(booking._id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg text-sm shadow-md hover:shadow-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'messages':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Your Messages</h2>
            
            {messages.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">You don't have any messages yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(message => (
                  <div key={message._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mr-3 flex items-center justify-center">
                          {message.sender.profileImage && (
                            <img 
                              src={message.sender.profileImage} 
                              alt={message.sender.firstName} 
                              className="w-10 h-10 rounded-lg object-cover border-2 border-white"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{message.sender.firstName} {message.sender.lastName}</h3>
                          <div className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Link 
                        to={`/messages/${message.conversationId}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Conversation
                      </Link>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{message.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'favorites':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Your Favorite Tutors</h2>
            
            {favorites.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">You haven't added any tutors to your favorites yet.</p>
                <Link to="/search" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
                  Browse Tutors
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(fav => (
                  <div key={fav._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mr-4 flex items-center justify-center">
                          {fav.tutor.profileImage && (
                            <img 
                              src={fav.tutor.profileImage} 
                              alt={fav.tutor.firstName} 
                              className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{fav.tutor.firstName} {fav.tutor.lastName}</h3>
                          <p className="text-blue-600 text-sm font-medium">{fav.tutor.subjects.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span>{fav.tutor.rating.toFixed(1)}</span>
                        </div>
                        <div className="font-semibold text-gray-900">${fav.tutor.hourlyRate}/hr</div>
                      </div>
                      
                      <div className="flex justify-between mt-6">
                        <Link 
                          to={`/tutors/${fav.tutor._id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm shadow-md hover:shadow-lg transition-all"
                        >
                          View Profile
                        </Link>
                        <button 
                          onClick={() => removeFavorite(fav.tutor._id)}
                          className="text-gray-600 hover:text-red-600 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 text-white">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-blue-100">Welcome back, {currentUser?.firstName || 'Student'}!</p>
        </div>
        
        {/* Dashboard Navigation Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button 
              className={`px-6 py-4 text-center font-medium ${activeTab === 'bookings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('bookings')}
            >
              Upcoming Sessions
            </button>
            <button 
              className={`px-6 py-4 text-center font-medium ${activeTab === 'messages' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('messages')}
            >
              Messages
            </button>
            <button 
              className={`px-6 py-4 text-center font-medium ${activeTab === 'favorites' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </button>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>
      
      {/* Recommended Tutors Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-8">Recommended Tutors For You</h2>
        
        {recentTutors.length === 0 ? (
          <div className="text-center py-8 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-600">No recommendations available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentTutors.map(tutor => (
              <div key={tutor._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mr-4 flex items-center justify-center">
                      {tutor.profileImage && (
                        <img 
                          src={tutor.profileImage} 
                          alt={`${tutor.firstName} ${tutor.lastName}`} 
                          className="w-14 h-14 rounded-lg object-cover border-2 border-white"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{tutor.firstName} {tutor.lastName}</h3>
                      <p className="text-blue-600 text-sm font-medium">{tutor.subjects.join(', ')}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span>{tutor.rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm ml-1">({tutor.reviewCount})</span>
                    </div>
                    <div className="font-semibold text-gray-900">${tutor.hourlyRate}/hr</div>
                  </div>
                  
                  <Link 
                    to={`/tutors/${tutor._id}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;