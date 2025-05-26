import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, Users, Settings, Bell, Star, BookOpen, TrendingUp, MessageCircle } from 'lucide-react';
import TutorVerification from '../components/TutorVerification';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useContext(AuthContext);
  const [tutorData, setTutorData] = useState({
    name: 'Dr. Sarah Johnson',
    avatar: '/api/placeholder/80/80',
    rating: 4.8,
    totalStudents: 124,
    totalEarnings: 15420,
    monthlyEarnings: 2340,
    upcomingSessions: 8,
    completedSessions: 156
  });

  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: 1,
      student: 'Alex Chen',
      subject: 'Advanced Calculus',
      date: '2024-05-22',
      time: '10:00 AM',
      duration: '1 hour',
      type: 'Video Call',
      status: 'confirmed'
    },
    {
      id: 2,
      student: 'Maria Rodriguez',
      subject: 'Physics - Quantum Mechanics',
      date: '2024-05-22',
      time: '2:00 PM',
      duration: '1.5 hours',
      type: 'In Person',
      status: 'pending'
    },
    {
      id: 3,
      student: 'James Wilson',
      subject: 'Mathematics',
      date: '2024-05-23',
      time: '9:00 AM',
      duration: '1 hour',
      type: 'Video Call',
      status: 'confirmed'
    }
  ]);

  const [recentReviews, setRecentReviews] = useState([
    {
      id: 1,
      student: 'Emily Davis',
      rating: 5,
      comment: 'Excellent explanation of complex topics. Very patient and knowledgeable.',
      date: '2024-05-20',
      subject: 'Calculus'
    },
    {
      id: 2,
      student: 'Michael Brown',
      rating: 4,
      comment: 'Great tutor! Helped me understand physics concepts clearly.',
      date: '2024-05-18',
      subject: 'Physics'
    }
  ]);

  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '10:00', end: '15:00' },
    sunday: { enabled: false, start: '10:00', end: '15:00' }
  });

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Monthly Earnings"
          value={`$${tutorData.monthlyEarnings}`}
          subtitle="This month"
          color="green"
        />
        <StatCard
          icon={Users}
          title="Active Students"
          value={tutorData.totalStudents}
          subtitle="Total students"
          color="blue"
        />
        <StatCard
          icon={Calendar}
          title="Upcoming Sessions"
          value={tutorData.upcomingSessions}
          subtitle="Next 7 days"
          color="purple"
        />
        <StatCard
          icon={Star}
          title="Average Rating"
          value={tutorData.rating}
          subtitle={`${tutorData.completedSessions} sessions`}
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Calendar className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">Schedule Session</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Settings className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-700">Update Profile</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">View Analytics</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <MessageCircle className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-700">Messages</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
          <div className="space-y-4">
            {upcomingSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{session.student}</p>
                  <p className="text-sm text-gray-600">{session.subject}</p>
                  <p className="text-sm text-gray-500">{session.date} at {session.time}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{review.student}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                <p className="text-xs text-gray-500">{review.subject} • {review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const SessionsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Sessions</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Schedule New Session
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {upcomingSessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.student}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.date} {session.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AvailabilityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Set Your Availability</h3>
        
        <div className="space-y-4">
          {Object.entries(availability).map(([day, schedule]) => (
            <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={schedule.enabled}
                  onChange={(e) => setAvailability(prev => ({
                    ...prev,
                    [day]: { ...schedule, enabled: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-900 capitalize">{day}</span>
              </div>
              
              {schedule.enabled && (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={schedule.start}
                    onChange={(e) => setAvailability(prev => ({
                      ...prev,
                      [day]: { ...schedule, start: e.target.value }
                    }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={schedule.end}
                    onChange={(e) => setAvailability(prev => ({
                      ...prev,
                      [day]: { ...schedule, end: e.target.value }
                    }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Save Availability
          </button>
        </div>
      </div>
    </div>
  );

  const EarningsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={DollarSign}
          title="This Month"
          value={`$${tutorData.monthlyEarnings}`}
          subtitle="May 2024"
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Earnings"
          value={`$${tutorData.totalEarnings}`}
          subtitle="All time"
          color="blue"
        />
        <StatCard
          icon={BookOpen}
          title="Sessions This Month"
          value="18"
          subtitle="Completed"
          color="purple"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-05-20</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Alex Chen</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Advanced Calculus</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 hour</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">$80</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-05-18</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maria Rodriguez</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Physics</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.5 hours</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">$120</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={tutorData.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
            <input
              type="number"
              defaultValue="80"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              rows={4}
              defaultValue="Experienced mathematics and physics tutor with PhD in Applied Mathematics. I specialize in helping students understand complex concepts through practical examples and patient guidance."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
            <input
              type="text"
              defaultValue="Mathematics, Physics, Calculus"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
            <input
              type="number"
              defaultValue="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <TutorVerification tutorId={user._id} /> {/* Replace with real ID */}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img
                src={tutorData.avatar}
                alt="Profile"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {tutorData.name}</h1>
                <p className="text-gray-600">Tutor Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                New Session
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'sessions' && <SessionsTab />}
        {activeTab === 'availability' && <AvailabilityTab />}
        {activeTab === 'earnings' && <EarningsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>
    </div>
  );
};

export default TutorDashboard;