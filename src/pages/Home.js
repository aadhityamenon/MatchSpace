import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Users, BookOpen, Award, ChevronRight, Play, CheckCircle, ArrowRight, Sparkles, Trophy, Target, Zap } from 'lucide-react';

const Home = () => {
  const subjectAreas = [
    { name: 'Mathematics', icon: '📊', color: 'from-blue-500 to-indigo-600', students: '2.3k+' },
    { name: 'Science', icon: '🧬', color: 'from-green-500 to-emerald-600', students: '1.8k+' },
    { name: 'Languages', icon: '🌍', color: 'from-purple-500 to-violet-600', students: '3.1k+' },
    { name: 'Humanities', icon: '📜', color: 'from-orange-500 to-amber-600', students: '1.5k+' },
    { name: 'Test Prep', icon: '🎯', color: 'from-red-500 to-pink-600', students: '2.7k+' },
    { name: 'Arts', icon: '🎨', color: 'from-teal-500 to-cyan-600', students: '1.2k+' }
  ];

  const features = [
    { icon: <Target className="w-6 h-6" />, title: 'Personalized Matching', desc: 'AI-powered algorithm finds your perfect tutor match' },
    { icon: <Zap className="w-6 h-6" />, title: 'Instant Booking', desc: 'Schedule sessions with just a few clicks' },
    { icon: <Trophy className="w-6 h-6" />, title: 'Verified Experts', desc: 'All tutors are background-checked and certified' },
    { icon: <Star className="w-6 h-6" />, title: '5-Star Experience', desc: 'Rated excellent by 98% of our students' }
  ];

  const stats = [
    { number: '15K+', label: 'Active Students' },
    { number: '3K+', label: 'Expert Tutors' },
    { number: '250K+', label: 'Sessions Completed' },
    { number: '4.9', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="flex items-center space-x-2 text-blue-200">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">Trusted by 15,000+ students worldwide</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Find Your
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Perfect Tutor
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-lg">
                Connect with world-class tutors and unlock your full potential with personalized learning experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/search" 
                  className="group bg-white hover:bg-blue-50 text-gray-900 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-blue-100"
                >
                  <Search className="w-5 h-5 text-blue-600" />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Find a Tutor
                  </span>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/apply" 
                  className="group border-2 border-blue-200 bg-white/90 hover:border-blue-300 text-gray-900 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Become a Tutor
                  </span>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <div className="text-2xl lg:text-3xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Content - Hero Image/Graphics */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-96 lg:h-[500px]">
                {/* Floating Cards */}
                <div className="absolute top-10 left-10 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl animate-float border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Mathematics</div>
                      <div className="text-sm text-gray-600">2,300+ tutors</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-32 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl animate-float-delayed border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">4.9</div>
                      <div className="flex text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-10 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl animate-float border border-gray-100">
                  <div className="text-3xl font-bold text-gray-900 mb-2">250K+</div>
                  <div className="text-gray-600">Successful Sessions</div>
                  <div className="flex items-center mt-2 text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">98% Success Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-blue-600">TutorMatch?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've revolutionized online tutoring with cutting-edge technology and a network of exceptional educators.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these three steps to begin your learning journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: "01", title: "Search & Discover", desc: "Browse our curated network of expert tutors using advanced filters for subject, experience, and availability.", icon: <Search className="w-8 h-8" /> },
              { step: "02", title: "Connect & Schedule", desc: "Message tutors directly, review their profiles, and book sessions that fit your schedule seamlessly.", icon: <Users className="w-8 h-8" /> },
              { step: "03", title: "Learn & Succeed", desc: "Enjoy personalized tutoring sessions and track your progress with our comprehensive learning analytics.", icon: <Trophy className="w-8 h-8" /> }
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent transform translate-x-4"></div>
                )}
                
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mr-4">
                      {item.icon}
                    </div>
                    <div className="text-4xl font-bold text-blue-100">{item.step}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Subject Areas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Explore Subject Areas</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From mathematics to creative arts, find expert tutors in every field of study.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectAreas.map((subject, index) => (
              <Link 
                key={index}
                to={`/search?subject=${subject.name}`} 
                className="group relative overflow-hidden bg-gradient-to-br bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="text-5xl mb-4">{subject.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                  <p className="text-gray-600 mb-4">{subject.students} active students</p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Explore tutors</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">What Our Community Says</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of students and tutors who have transformed their learning experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "High School Student", image: "SJ", content: "I was struggling with calculus until I found my tutor through TutorMatch. The personalized approach helped me understand complex concepts, and now I'm acing all my tests! The platform made it so easy to find the perfect match.", rating: 5 },
              { name: "James Wilson", role: "Parent", image: "JW", content: "As a parent, I was looking for quality Spanish tutoring for my daughter. TutorMatch connected us with an amazing tutor who not only improved her grades but also boosted her confidence in speaking Spanish.", rating: 5 },
              { name: "Dr. Michael Chen", role: "Computer Science Tutor", image: "MC", content: "As an educator, TutorMatch has provided me with a platform to reach students who truly benefit from my teaching style. The matching system works incredibly well, and I love seeing my students succeed.", rating: 5 }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4 text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        
        <div className="relative container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Ready to Transform Your
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Learning Journey?
            </span>
          </h2>
          <p className="text-xl lg:text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
            Join our community of learners and educators. Start your personalized learning experience today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="group bg-white text-gray-900 hover:bg-gray-50 py-4 px-10 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/search" 
              className="group border-2 border-white/30 hover:border-white/50 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white py-4 px-10 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;