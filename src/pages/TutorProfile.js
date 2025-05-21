import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const TutorProfile = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('about');
  const [message, setMessage] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tutors/${id}`);
        setTutor(res.data);
        
        // Fetch available times
        const timesRes = await api.get(`/tutors/${id}/availability`);
        setAvailableTimes(timesRes.data);
      } catch (err) {
        console.error('Error fetching tutor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    try {
      await api.post(`/messages/send`, {
        recipient: tutor._id,
        content: message
      });
      
      setMessage('');
      alert('Message sent successfully!');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleBookSession = async () => {
    if (!selectedTime) {
      alert('Please select a time slot first.');
      return;
    }
    
    try {
      await api.post('/bookings/create', {
        tutorId: tutor._id,
        timeSlot: selectedTime
      });
      
      alert('Session booked successfully!');
      setSelectedTime('');
    } catch (err) {
      console.error('Error booking session:', err);
      alert('Failed to book session. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Tutor Not Found</h2>
        <p className="mb-6">The tutor profile you're looking for doesn't exist or has been removed.</p>
        <Link to="/search" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to search link */}
      <Link to="/search" className="inline-flex items-center text-blue-600 mb-6">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Search
      </Link>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 text-white">
          <div className="md:flex items-center">
            <div className="w-32 h-32 bg-white rounded-full flex-shrink-0 mb-4 md:mb-0 mr-6">
              {tutor.profileImage ? (
                <img 
                  src={tutor.profileImage} 
                  alt={`${tutor.firstName} ${tutor.lastName}`}
                  className="w-32 h-32 rounded-full object-cover" 
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-300 flex items-center justify-center text-blue-700 text-3xl font-bold">
                  {tutor.firstName.charAt(0)}{tutor.lastName.charAt(0)}
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-2">{tutor.firstName} {tutor.lastName}</h1>
              <p className="text-xl opacity-90 mb-2">{tutor.subjects.join(', ')} Tutor</p>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center mr-4">
                  <span className="text-yellow-300 mr-1">★</span>
                  <span>{tutor.rating.toFixed(1)}</span>
                  <span className="opacity-75 ml-1">({tutor.reviewCount} reviews)</span>
                </div>
                <div className="opacity-75">{tutor.sessionsCompleted} sessions completed</div>
              </div>
              
              <div className="flex flex-wrap items-center">
                {tutor.badges && tutor.badges.map((badge, index) => (
                  <span key={index} className="bg-blue-800 text-white text-xs px-2 py-1 rounded mr-2 mb-2">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button 
              className={`px-6 py-3 text-center font-medium ${selectedTab === 'about' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSelectedTab('about')}
            >
              About
            </button>
            <button 
              className={`px-6 py-3 text-center font-medium ${selectedTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSelectedTab('reviews')}
            >
              Reviews
            </button>
            <button 
              className={`px-6 py-3 text-center font-medium ${selectedTab === 'subjects' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSelectedTab('subjects')}
            >
              Subjects & Expertise
            </button>
            <button 
              className={`px-6 py-3 text-center font-medium ${selectedTab === 'schedule' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSelectedTab('schedule')}
            >
              Schedule
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* About Tab */}
          {selectedTab === 'about' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">About {tutor.firstName}</h2>
              <p className="mb-6">{tutor.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Education</h3>
                  {tutor.education && tutor.education.map((edu, index) => (
                    <div key={index} className="mb-3">
                      <div className="font-medium">{edu.degree}</div>
                      <div className="text-gray-600">{edu.institution}, {edu.year}</div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Experience</h3>
                  {tutor.experience && tutor.experience.map((exp, index) => (
                    <div key={index} className="mb-3">
                      <div className="font-medium">{exp.title}</div>
                      <div className="text-gray-600">{exp.organization}, {exp.years}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Teaching Style</h3>
                <p>{tutor.teachingStyle}</p>
              </div>
            </div>
          )}
          
          {/* Reviews Tab */}
          {selectedTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-800 p-2 rounded flex items-center mr-4">
                    <span className="text-2xl font-bold mr-1">{tutor.rating.toFixed(1)}</span>
                    <div>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(tutor.rating))}
                        {'☆'.repeat(5 - Math.floor(tutor.rating))}
                      </div>
                      <div className="text-xs text-gray-600">{tutor.reviewCount} reviews</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {tutor.reviews && tutor.reviews.length > 0 ? (
                <div className="space-y-6">
                  {tutor.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                          <div>
                            <div className="font-medium">{review.studentName}</div>
                            <div className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No reviews yet for this tutor.
                </div>
              )}
            </div>
          )}
          
          {/* Subjects Tab */}
          {selectedTab === 'subjects' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Subjects & Expertise</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Main Subjects</h3>
                  <ul className="space-y-2">
                    {tutor.subjects.map((subject, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {subject}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Special Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.skills && tutor.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Levels Taught</h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.levels && tutor.levels.map((level, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {level}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Languages Spoken</h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.languages && tutor.languages.map((language, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Schedule Tab */}
          {selectedTab === 'schedule' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Book a Session</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Available Times</h3>
                  
                  {availableTimes.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {availableTimes.map((time, index) => (
                        <div 
                          key={index}
                          className={`border p-3 rounded cursor-pointer ${selectedTime === time.id ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-50'}`}
                          onClick={() => setSelectedTime(time.id)}
                        >
                          <div className="font-medium">{new Date(time.startTime).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                          <div className="text-gray-600">
                            {new Date(time.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - 
                            {new Date(time.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mb-4">No available time slots at the moment.</p>
                  )}
                  
                  {availableTimes.length > 0 && (
                    <>
                      <button
                        onClick={handleBookSession}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4"
                      >
                        Book Selected Time Slot
                      </button>
                      
                      <div className="text-sm text-gray-500">
                        <p>Session Price: ${tutor.hourlyRate} per hour</p>
                        <p>Duration: 1 hour (standard session)</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact {tutor.firstName}</h3>
                  
                  {currentUser ? (
                    <form onSubmit={handleMessageSubmit}>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Message</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded min-h-32"
                          placeholder={`Hi ${tutor.firstName}, I'm interested in tutoring sessions...`}
                          required
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                      >
                        Send Message
                      </button>
                    </form>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded text-center">
                      <p className="mb-4">Please log in to contact this tutor or book sessions.</p>
                      <Link
                        to="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded inline-block"
                      >
                        Log In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;