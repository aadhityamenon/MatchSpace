import React, { useState, useEffect } from 'react';
import { 
  User, 
  Camera, 
  Lock, 
  Bell, 
  CreditCard, 
  Book, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Upload,
  Star,
  DollarSign,
  Clock,
  Award
} from 'lucide-react';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Mock user data - in real app, fetch from API
  const [userData, setUserData] = useState({
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced mathematics tutor with 8+ years of teaching experience.',
    profilePicture: null,
    location: 'New York, NY',
    dateJoined: '2023-01-15',
    userType: 'tutor',
    isVerified: true,
    rating: 4.8,
    totalSessions: 156,
    hourlyRate: 45
  });

  const [tutorData, setTutorData] = useState({
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    availability: {
      monday: { available: true, start: '09:00', end: '17:00' },
      tuesday: { available: true, start: '09:00', end: '17:00' },
      wednesday: { available: true, start: '09:00', end: '17:00' },
      thursday: { available: true, start: '09:00', end: '17:00' },
      friday: { available: true, start: '09:00', end: '17:00' },
      saturday: { available: false, start: '', end: '' },
      sunday: { available: false, start: '', end: '' }
    },
    qualifications: [
      { id: '1', title: 'Master of Science in Mathematics', institution: 'MIT', year: '2018' },
      { id: '2', title: 'Teaching Certificate', institution: 'Education Board', year: '2019' }
    ],
    languages: ['English', 'Spanish'],
    teachingExperience: '8+ years'
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailMessages: true,
    emailPayments: true,
    pushBookings: true,
    pushMessages: false,
    pushPayments: true,
    smsReminders: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = async (section) => {
    setLoading(true);
    setMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage(`${section} updated successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData(prev => ({ ...prev, profilePicture: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addQualification = () => {
    const newQual = {
      id: Date.now().toString(),
      title: '',
      institution: '',
      year: ''
    };
    setTutorData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, newQual]
    }));
  };

  const updateQualification = (id, field, value) => {
    setTutorData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map(qual =>
        qual.id === id ? { ...qual, [field]: value } : qual
      )
    }));
  };

  const removeQualification = (id) => {
    setTutorData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter(qual => qual.id !== id)
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    ...(userData.userType === 'tutor' ? [{ id: 'tutor', label: 'Tutor Settings', icon: Book }] : []),
    { id: 'payments', label: 'Payments', icon: CreditCard }
  ];

  const TabButton = ({ tab, isActive, onClick }) => {
    const Icon = tab.icon;
    return (
      <button
        onClick={() => onClick(tab.id)}
        className={`flex items-center space-x-3 w-full p-3 rounded-lg text-left transition-all ${
          isActive 
            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{tab.label}</span>
      </button>
    );
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {userData.profilePicture ? (
              <img src={userData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{userData.name}</h3>
          <p className="text-gray-600">{userData.userType === 'tutor' ? 'Tutor' : 'Student'}</p>
          {userData.isVerified && (
            <div className="flex items-center space-x-1 text-green-600 mt-1">
              <Award className="w-4 h-4" />
              <span className="text-sm">Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <div className="relative">
            <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="tel"
              value={userData.phone}
              onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={userData.location}
              onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={userData.bio}
          onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Stats for Tutors */}
      {userData.userType === 'tutor' && (
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-lg font-semibold">{userData.rating}</span>
            </div>
            <p className="text-sm text-gray-600">Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-semibold">{userData.totalSessions}</span>
            </div>
            <p className="text-sm text-gray-600">Sessions</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
              <DollarSign className="w-5 h-5" />
              <span className="text-lg font-semibold">${userData.hourlyRate}</span>
            </div>
            <p className="text-sm text-gray-600">Per Hour</p>
          </div>
        </div>
      )}

      <button
        onClick={() => handleSave('Profile')}
        disabled={loading}
        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
      </button>
    </div>
  );

  const AccountTab = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => handleSave('Password')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Account Type</span>
            <span className="font-medium capitalize">{userData.userType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium">{new Date(userData.dateJoined).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Verification Status</span>
            <span className={`font-medium ${userData.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
              {userData.isVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Deactivate Account</h4>
            <p className="text-sm text-gray-600 mb-3">
              Temporarily disable your account. You can reactivate it anytime.
            </p>
            <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              Deactivate Account
            </button>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Delete Account</h4>
            <p className="text-sm text-gray-600 mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailBookings', label: 'Booking confirmations and updates' },
            { key: 'emailMessages', label: 'New messages from students/tutors' },
            { key: 'emailPayments', label: 'Payment confirmations and receipts' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-gray-700">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'pushBookings', label: 'Booking requests and confirmations' },
            { key: 'pushMessages', label: 'New messages' },
            { key: 'pushPayments', label: 'Payment notifications' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-gray-700">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">SMS Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Session reminders</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.smsReminders}
                onChange={(e) => setNotifications(prev => ({ ...prev, smsReminders: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleSave('Notifications')}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Preferences
      </button>
    </div>
  );

  const TutorTab = () => (
    <div className="space-y-6">
      {/* Hourly Rate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
        <input
          type="number"
          value={userData.hourlyRate}
          onChange={(e) => setUserData(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) }))}
          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="10"
          max="200"
        />
      </div>

      {/* Subjects */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tutorData.subjects.map((subject, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
              <span>{subject}</span>
              <button
                onClick={() => setTutorData(prev => ({
                  ...prev,
                  subjects: prev.subjects.filter((_, i) => i !== index)
                }))}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add new subject and press Enter"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              setTutorData(prev => ({
                ...prev,
                subjects: [...prev.subjects, e.target.value.trim()]
              }));
              e.target.value = '';
            }
          }}
        />
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Availability</h3>
        <div className="space-y-3">
          {Object.entries(tutorData.availability).map(([day, schedule]) => (
            <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={schedule.available}
                  onChange={(e) => setTutorData(prev => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      [day]: { ...schedule, available: e.target.checked }
                    }
                  }))}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium capitalize w-20">{day}</span>
              </div>
              {schedule.available && (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={schedule.start}
                    onChange={(e) => setTutorData(prev => ({
                      ...prev,
                      availability: {
                        ...prev.availability,
                        [day]: { ...schedule, start: e.target.value }
                      }
                    }))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={schedule.end}
                    onChange={(e) => setTutorData(prev => ({
                      ...prev,
                      availability: {
                        ...prev.availability,
                        [day]: { ...schedule, end: e.target.value }
                      }
                    }))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Qualifications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Qualifications</h3>
          <button
            onClick={addQualification}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Add Qualification
          </button>
        </div>
        <div className="space-y-4">
          {tutorData.qualifications.map((qual) => (
            <div key={qual.id} className="border rounded-lg p-4">
              <div className="grid md:grid-cols-3 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Qualification Title"
                  value={qual.title}
                  onChange={(e) => updateQualification(qual.id, 'title', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={qual.institution}
                  onChange={(e) => updateQualification(qual.id, 'institution', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={qual.year}
                  onChange={(e) => updateQualification(qual.id, 'year', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => removeQualification(qual.id)}
                className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => handleSave('Tutor Settings')}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );

  const PaymentsTab = () => (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
        <div className="border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Default</span>
          </div>
        </div>
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
          <span>+ Add New Payment Method</span>
        </button>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Billing History</h3>
        <div className="space-y-3">
          {[
            { id: '1', date: '2024-01-15', amount: 45, description: 'Math Tutoring Session - John Doe', status: 'Completed' },
            { id: '2', date: '2024-01-10', amount: 90, description: 'Physics Tutoring - 2 Sessions', status: 'Completed' },
            { id: '3', date: '2024-01-05', amount: 45, description: 'Chemistry Tutoring Session', status: 'Completed' }
          ].map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${transaction.amount}</p>
                <span className="text-sm text-green-600">{transaction.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout Settings (for tutors) */}
      {userData.userType === 'tutor' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Payout Settings</h3>
          <div className="border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Bank Account</p>
                <p className="text-sm text-gray-600">•••• •••• •••• 1234</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payout Schedule</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>$25</option>
                  <option>$50</option>
                  <option>$100</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Earnings Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">$1,245</p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">$340</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">$12,890</p>
              <p className="text-sm text-gray-600">All Time</p>
            </div>
          </div>
        </div>
      )}

      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Save Payment Settings
      </button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'account':
        return <AccountTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'tutor':
        return <TutorTab />;
      case 'payments':
        return <PaymentsTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <TabButton
                    key={tab.id}
                    tab={tab}
                    isActive={activeTab === tab.id}
                    onClick={setActiveTab}
                  />
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;