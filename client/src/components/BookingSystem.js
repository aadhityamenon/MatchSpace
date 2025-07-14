import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatISO, parseISO, format, addHours } from 'date-fns';

const BookingSystem = ({ tutorId }) => {
  const { currentUser } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch tutor's available slots when date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!tutorId) return;
      
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For now we'll simulate it with mock data
        const dateString = formatISO(selectedDate, { representation: 'date' });
        const response = await fetch(`/api/tutors/${tutorId}/availability?date=${dateString}`);
        
        // Simulate API response with mock data
        setTimeout(() => {
          // Mock data - in a real app this would come from the backend
          const mockSlots = [
            { id: 1, startTime: '09:00', endTime: '10:00', available: true },
            { id: 2, startTime: '10:00', endTime: '11:00', available: true },
            { id: 3, startTime: '11:00', endTime: '12:00', available: false },
            { id: 4, startTime: '13:00', endTime: '14:00', available: true },
            { id: 5, startTime: '14:00', endTime: '15:00', available: true },
            { id: 6, startTime: '15:00', endTime: '16:00', available: false },
          ];
          
          setAvailableSlots(mockSlots);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching tutor availability:', error);
        setMessage('Failed to fetch availability. Please try again.');
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [tutorId, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelection = (slot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setMessage('Please log in to book a session.');
      return;
    }
    
    if (!selectedSlot) {
      setMessage('Please select a time slot.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format booking data
      const bookingData = {
        tutorId,
        studentId: currentUser.id,
        date: formatISO(selectedDate, { representation: 'date' }),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        topic: bookingTopic,
        notes: bookingNotes
      };
      
      // In a real implementation, this would be an API call
      // For now we'll simulate it
      setTimeout(() => {
        console.log('Booking submitted:', bookingData);
        setMessage('Session booked successfully! The tutor will be notified.');
        setBookingTopic('');
        setBookingNotes('');
        setSelectedSlot(null);
        
        // Refresh available slots (mark the booked slot as unavailable)
        setAvailableSlots(prevSlots => 
          prevSlots.map(slot => 
            slot.id === selectedSlot.id ? { ...slot, available: false } : slot
          )
        );
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error booking session:', error);
      setMessage('Failed to book session. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="booking-system container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Book a Session</h2>
      
      {!currentUser && (
        <div className="bg-yellow-100 p-4 mb-4 rounded-md">
          <p>Please log in to book a session with this tutor.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="calendar-container">
          <h3 className="text-lg font-semibold mb-2">1. Select a Date</h3>
          <Calendar 
            onChange={handleDateChange} 
            value={selectedDate}
            minDate={new Date()}
            className="rounded-md shadow-md"
          />
        </div>
        
        <div className="time-slots">
          <h3 className="text-lg font-semibold mb-2">2. Select a Time Slot</h3>
          
          {isLoading ? (
            <p>Loading available slots...</p>
          ) : availableSlots.length === 0 ? (
            <p>No time slots available for this date.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableSlots.map(slot => (
                <button
                  key={slot.id}
                  className={`p-2 rounded-md text-center transition-colors ${
                    !slot.available 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : selectedSlot && selectedSlot.id === slot.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                  }`}
                  onClick={() => handleSlotSelection(slot)}
                  disabled={!slot.available}
                >
                  {slot.startTime} - {slot.endTime}
                  {!slot.available && <span> (Booked)</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {selectedSlot && (
        <div className="booking-form mt-6 p-4 bg-gray-50 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold mb-2">3. Session Details</h3>
          <form onSubmit={handleBookSession}>
            <div className="mb-4">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                Topic/Subject
              </label>
              <input
                type="text"
                id="topic"
                value={bookingTopic}
                onChange={(e) => setBookingTopic(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Calculus, React Development, English Literature"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes for the Tutor (Optional)
              </label>
              <textarea
                id="notes"
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what you'd like help with..."
              />
            </div>
            
            <div className="booking-summary mb-4 p-3 bg-blue-50 rounded-md">
              <h4 className="font-medium text-blue-800">Booking Summary</h4>
              <p>Date: {format(selectedDate, 'MMMM dd, yyyy')}</p>
              <p>Time: {selectedSlot.startTime} - {selectedSlot.endTime}</p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading || !currentUser}
            >
              {isLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      )}
      
      {message && (
        <div className={`mt-4 p-4 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default BookingSystem;