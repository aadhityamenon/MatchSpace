import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

const TutorSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: searchParams.get('subject') || '',
    priceMin: '',
    priceMax: '',
    rating: '',
    availability: ''
  });

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        // Build query string from filters
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        
        const res = await api.get(`/tutors?${params.toString()}`);
        setTutors(res.data);
      } catch (err) {
        console.error('Error fetching tutors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update URL params
    setSearchParams(prev => {
      if (value) {
        prev.set(name, value);
      } else {
        prev.delete(name);
      }
      return prev;
    });
  };

  const resetFilters = () => {
    setFilters({
      subject: '',
      priceMin: '',
      priceMax: '',
      rating: '',
      availability: ''
    });
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Tutor</h1>
      
      {/* Filter Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Subject</label>
            <select 
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Language">Language</option>
              <option value="History">History</option>
              <option value="Arts">Arts</option>
              <option value="Test Prep">Test Prep</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Price Range ($)</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                name="priceMin"
                placeholder="Min" 
                value={filters.priceMin}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <span>-</span>
              <input 
                type="number" 
                name="priceMax"
                placeholder="Max" 
                value={filters.priceMax}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Minimum Rating</label>
            <select 
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Availability</label>
            <select 
              name="availability"
              value={filters.availability}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Any Time</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="evenings">Evenings</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={resetFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded w-full"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {loading ? "Loading tutors..." : `${tutors.length} Tutors Found`}
          </h2>
          <div>
            <select className="p-2 border border-gray-300 rounded">
              <option value="relevance">Sort by Relevance</option>
              <option value="rating">Sort by Rating</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tutors found matching your criteria.</p>
            <p className="mt-2">Try adjusting your filters or browse all available tutors.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map(tutor => (
              <div key={tutor._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4">
                      {tutor.profileImage && (
                        <img 
                          src={tutor.profileImage} 
                          alt={`${tutor.firstName} ${tutor.lastName}`} 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{tutor.firstName} {tutor.lastName}</h3>
                      <p className="text-blue-600">{tutor.subjects.join(', ')}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{tutor.bio}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="font-semibold">{tutor.rating.toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({tutor.reviewCount} reviews)</span>
                    </div>
                    <div className="font-semibold">${tutor.hourlyRate}/hr</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {tutor.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                  <a 
                    href={`/tutors/${tutor._id}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSearch;