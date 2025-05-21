import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const subjectAreas = [
    { name: 'Mathematics', icon: '➗' },
    { name: 'Science', icon: '🔬' },
    { name: 'Languages', icon: '🗣️' },
    { name: 'Humanities', icon: '📚' },
    { name: 'Test Prep', icon: '✏️' },
    { name: 'Arts', icon: '🎨' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Tutor Today</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with expert tutors and coaches in any subject. Personalized learning experiences tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/search" className="bg-white text-blue-600 hover:bg-blue-100 py-3 px-8 rounded-lg font-bold text-lg">
              Find a Tutor
            </Link>
            <Link to="/apply" className="bg-blue-800 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-bold text-lg">
              Become a Tutor
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Search for Tutors</h3>
              <p className="text-gray-600">Browse our extensive network of qualified tutors by subject, experience, or availability.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Connect and Schedule</h3>
              <p className="text-gray-600">Message tutors, check their availability, and schedule your sessions directly on our platform.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Learn and Succeed</h3>
              <p className="text-gray-600">Enjoy personalized tutoring sessions and track your progress toward your academic goals.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Subject Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Subject Areas</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjectAreas.map((subject, index) => (
              <Link 
                key={index}
                to={`/search?subject=${subject.name}`} 
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{subject.icon}</div>
                <h3 className="font-semibold">{subject.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Student</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I was struggling with calculus until I found my tutor through TutorMatch. Now I'm acing all my tests!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">James Wilson</h4>
                  <p className="text-gray-600 text-sm">Parent</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The platform made it easy to find a qualified Spanish tutor for my daughter. Her confidence has improved tremendously."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-600 text-sm">Tutor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As a tutor, TutorMatch has connected me with students who really benefit from my teaching style. It's been rewarding for everyone."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their perfect academic match.
          </p>
          <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-100 py-3 px-8 rounded-lg font-bold text-lg inline-block">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;