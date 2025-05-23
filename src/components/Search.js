import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Clock, DollarSign, User, BookOpen, Award, ChevronDown, X, SlidersHorizontal } from 'lucide-react';

const EnhancedTutorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subjects: [],
    priceRange: [0, 100],
    rating: 0,
    availability: [],
    location: '',
    experience: '',
    tutorType: '',
    sessionType: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock tutor data
  const mockTutors = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 45,
      subjects: ["Mathematics", "Physics", "Chemistry"],
      experience: "5+ years",
      location: "New York, NY",
      availability: ["Monday", "Wednesday", "Friday"],
      sessionTypes: ["Online", "In-person"],
      tutorType: "Professional",
      bio: "PhD in Mathematics with 5+ years of tutoring experience. Specializing in advanced calculus and physics.",
      responseTime: "Usually responds within 2 hours",
      completedSessions: 450,
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: 35,
      subjects: ["Computer Science", "Programming", "Web Development"],
      experience: "3+ years",
      location: "San Francisco, CA",
      availability: ["Tuesday", "Thursday", "Saturday"],
      sessionTypes: ["Online"],
      tutorType: "Student",
      bio: "Computer Science student at Stanford. Expert in Python, JavaScript, and web development.",
      responseTime: "Usually responds within 1 hour",
      completedSessions: 200,
      verified: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      reviewCount: 156,
      hourlyRate: 55,
      subjects: ["English", "Literature", "Writing"],
      experience: "7+ years",
      location: "Chicago, IL",
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      sessionTypes: ["Online", "In-person"],
      tutorType: "Professional",
      bio: "English Literature professor with extensive experience in academic writing and test prep.",
      responseTime: "Usually responds within 3 hours",
      completedSessions: 600,
      verified: true
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.6,
      reviewCount: 73,
      hourlyRate: 40,
      subjects: ["Biology", "Chemistry", "Pre-Med"],
      experience: "4+ years",
      location: "Boston, MA",
      availability: ["Wednesday", "Friday", "Sunday"],
      sessionTypes: ["Online", "In-person"],
      tutorType: "Graduate Student",
      bio: "Medical student with strong background in biological sciences. Helped 100+ students with MCAT prep.",
      responseTime: "Usually responds within 4 hours",
      completedSessions: 280,
      verified: false
    },
    {
      id: 5,
      name: "Jessica Park",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviewCount: 201,
      hourlyRate: 50,
      subjects: ["SAT Prep", "ACT Prep", "Test Prep"],
      experience: "6+ years",
      location: "Los Angeles, CA",
      availability: ["Monday", "Tuesday", "Thursday", "Saturday"],
      sessionTypes: ["Online", "In-person"],
      tutorType: "Professional",
      bio: "Certified test prep specialist. Average score improvement of 200+ points on SAT.",
      responseTime: "Usually responds within 1 hour",
      completedSessions: 800,
      verified: true
    }
  ];

  const subjects = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Programming", "Web Development", "English", "Literature", "Writing", "Biology", "Pre-Med", "SAT Prep", "ACT Prep", "Test Prep"];
  const availabilityOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sessionTypeOptions = ["Online", "In-person"];
  const tutorTypeOptions = ["Professional", "Student", "Graduate Student"];

  useEffect(() => {
    setTutors(mockTutors);
    setFilteredTutors(mockTutors);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, sortBy, tutors]);

  const applyFilters = () => {
    setLoading(true);
    
    setTimeout(() => {
      let filtered = [...tutors];

      // Search query filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(tutor =>
          tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tutor.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
          tutor.bio.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Subject filter
      if (filters.subjects.length > 0) {
        filtered = filtered.filter(tutor =>
          filters.subjects.some(subject => tutor.subjects.includes(subject))
        );
      }

      // Price range filter
      filtered = filtered.filter(tutor =>
        tutor.hourlyRate >= filters.priceRange[0] && tutor.hourlyRate <= filters.priceRange[1]
      );

      // Rating filter
      if (filters.rating > 0) {
        filtered = filtered.filter(tutor => tutor.rating >= filters.rating);
      }

      // Availability filter
      if (filters.availability.length > 0) {
        filtered = filtered.filter(tutor =>
          filters.availability.some(day => tutor.availability.includes(day))
        );
      }

      // Location filter
      if (filters.location.trim()) {
        filtered = filtered.filter(tutor =>
          tutor.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      // Experience filter
      if (filters.experience) {
        filtered = filtered.filter(tutor => tutor.experience === filters.experience);
      }

      // Tutor type filter
      if (filters.tutorType) {
        filtered = filtered.filter(tutor => tutor.tutorType === filters.tutorType);
      }

      // Session type filter
      if (filters.sessionType.length > 0) {
        filtered = filtered.filter(tutor =>
          filters.sessionType.some(type => tutor.sessionTypes.includes(type))
        );
      }

      // Sort results
      switch (sortBy) {
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'price-low':
          filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
          break;
        case 'experience':
          filtered.sort((a, b) => b.completedSessions - a.completedSessions);
          break;
        case 'reviews':
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        default:
          // Relevance - keep original order
          break;
      }

      setFilteredTutors(filtered);
      setLoading(false);
    }, 300);
  };

  const handleSubjectToggle = (subject) => {
    setFilters(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleAvailabilityToggle = (day) => {
    setFilters(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
  };

  const handleSessionTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      sessionType: prev.sessionType.includes(type)
        ? prev.sessionType.filter(t => t !== type)
        : [...prev.sessionType, type]
    }));
  };

  const clearFilters = () => {
    setFilters({
      subjects: [],
      priceRange: [0, 100],
      rating: 0,
      availability: [],
      location: '',
      experience: '',
      tutorType: '',
      sessionType: []
    });
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.subjects.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) count++;
    if (filters.rating > 0) count++;
    if (filters.availability.length > 0) count++;
    if (filters.location.trim()) count++;
    if (filters.experience) count++;
    if (filters.tutorType) count++;
    if (filters.sessionType.length > 0) count++;
    return count;
  };

  const TutorCard = ({ tutor }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={tutor.avatar}
            alt={tutor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {tutor.verified && (
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
              <Award className="w-3 h-3" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">${tutor.hourlyRate}</div>
              <div className="text-sm text-gray-500">per hour</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{tutor.rating}</span>
              <span className="ml-1 text-sm text-gray-500">({tutor.reviewCount})</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {tutor.location}
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {tutor.subjects.slice(0, 3).map((subject, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {subject}
                </span>
              ))}
              {tutor.subjects.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{tutor.subjects.length - 3} more
                </span>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tutor.bio}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {tutor.responseTime}
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {tutor.completedSessions} sessions
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              View Profile
            </button>
            <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Tutor</h1>
          <p className="text-gray-600">Discover qualified tutors for any subject</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by subject, tutor name, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filter Toggle & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
            
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="experience">Most Experienced</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Subjects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {subjects.map((subject) => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.subjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                    }))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                    }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="0">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <div className="space-y-2">
                  {availabilityOptions.map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.availability.includes(day)}
                        onChange={() => handleAvailabilityToggle(day)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter city or state"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tutor Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tutor Type</label>
                <select
                  value={filters.tutorType}
                  onChange={(e) => setFilters(prev => ({ ...prev, tutorType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Type</option>
                  {tutorTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? 'Searching...' : `${filteredTutors.length} tutors found`}
          </h2>
        </div>

        {/* Tutor Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredTutors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTutorSearch;