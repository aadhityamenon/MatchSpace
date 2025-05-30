import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Users, BookOpen, Award, ChevronRight, Play, CheckCircle, ArrowRight, Sparkles, Trophy, Target, Zap, Clock, Shield, Headphones, Globe } from 'lucide-react';

const Home = () => {
  const subjectAreas = [
    { name: 'Mathematics', icon: '📊', color: 'from-blue-500 to-indigo-600', students: '2.3k+', tutors: '450+' },
    { name: 'Science', icon: '🧬', color: 'from-green-500 to-emerald-600', students: '1.8k+', tutors: '320+' },
    { name: 'Languages', icon: '🌍', color: 'from-purple-500 to-violet-600', students: '3.1k+', tutors: '580+' },
    { name: 'Humanities', icon: '📜', color: 'from-orange-500 to-amber-600', students: '1.5k+', tutors: '290+' },
    { name: 'Test Prep', icon: '🎯', color: 'from-red-500 to-pink-600', students: '2.7k+', tutors: '410+' },
    { name: 'Arts', icon: '🎨', color: 'from-teal-500 to-cyan-600', students: '1.2k+', tutors: '180+' }
  ];

  const features = [
    { 
      icon: <Target className="w-7 h-7" />, 
      title: 'AI-Powered Matching', 
      desc: 'Advanced algorithm finds your perfect tutor based on learning style, goals, and preferences',
      color: 'from-purple-500 to-indigo-600'
    },
    { 
      icon: <Zap className="w-7 h-7" />, 
      title: 'Instant Booking', 
      desc: 'Schedule sessions in seconds with real-time availability and flexible timing options',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      icon: <Shield className="w-7 h-7" />, 
      title: 'Verified Experts', 
      desc: 'All tutors undergo rigorous background checks, certification, and skill assessments',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      icon: <Star className="w-7 h-7" />, 
      title: '5-Star Experience', 
      desc: 'Consistently rated excellent by 98% of students with personalized learning paths',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  const stats = [
    { number: '15K+', label: 'Active Students', icon: <Users className="w-6 h-6" /> },
    { number: '3K+', label: 'Expert Tutors', icon: <BookOpen className="w-6 h-6" /> },
    { number: '250K+', label: 'Sessions Completed', icon: <Trophy className="w-6 h-6" /> },
    { number: '4.9', label: 'Average Rating', icon: <Star className="w-6 h-6" /> }
  ];

  const testimonials = [
    { 
      name: "Sarah Johnson", 
      role: "High School Student", 
      image: "SJ", 
      content: "TutorMatch transformed my calculus grades from C's to A's! The personalized approach and instant feedback helped me understand complex concepts that seemed impossible before.", 
      rating: 5,
      subject: "Mathematics",
      improvement: "+2 Grade Levels"
    },
    { 
      name: "James Wilson", 
      role: "Parent of Maria", 
      image: "JW", 
      content: "Finding a quality Spanish tutor was challenging until we discovered TutorMatch. Maria's confidence and fluency have skyrocketed in just 3 months!", 
      rating: 5,
      subject: "Spanish",
      improvement: "98% Session Attendance"
    },
    { 
      name: "Dr. Michael Chen", 
      role: "Computer Science Tutor", 
      image: "MC", 
      content: "The platform's matching system is incredible. I'm paired with students who genuinely benefit from my teaching style, making every session rewarding and effective.", 
      rating: 5,
      subject: "Computer Science",
      improvement: "500+ Hours Taught"
    }
  ];

  const howItWorks = [
    { 
      step: "01", 
      title: "Search & Filter", 
      desc: "Use our smart filters to find tutors by subject, experience level, availability, and teaching style preference.", 
      icon: <Search className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-600"
    },
    { 
      step: "02", 
      title: "Connect & Book", 
      desc: "Browse detailed profiles, read reviews, and book your first session with instant confirmation and calendar sync.", 
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-600"
    },
    { 
      step: "03", 
      title: "Learn & Grow", 
      desc: "Attend personalized sessions, track your progress with detailed analytics, and achieve your learning goals faster.", 
      icon: <Trophy className="w-8 h-8" />,
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Enhanced Left Content */}
            <div className="text-white space-y-8">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-fit border border-white/20">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-blue-100">Trusted by 15,000+ students worldwide</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  Find Your
                  <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                    Perfect Tutor
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-lg font-light">
                  Connect with world-class tutors and unlock your full potential with personalized, AI-matched learning experiences.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/search" 
                  className="group bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-white text-gray-900 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 border border-white/20"
                >
                  <Search className="w-6 h-6 text-blue-600" />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Find a Tutor
                  </span>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/apply" 
                  className="group border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl"
                >
                  <Users className="w-6 h-6" />
                  <span>Become a Tutor</span>
                </Link>
              </div>
              
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                    <div className="flex items-center justify-center mb-2 text-blue-300 group-hover:text-white transition-colors">
                      {stat.icon}
                    </div>
                    <div className="text-center">
                      <div className="text-2xl lg:text-3xl font-black text-white">{stat.number}</div>
                      <div className="text-xs text-blue-200 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enhanced Right Content - Floating Cards */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px]">
                {/* Mathematics Card */}
                <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl animate-float border border-gray-100 max-w-xs">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">Mathematics</div>
                      <div className="text-sm text-gray-600">2,300+ tutors available</div>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700 ml-1">4.9 rating</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Rating Card */}
                <div className="absolute top-32 right-4 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl animate-float-delayed border border-gray-100">
                  <div className="text-center">
                    <div className="flex justify-center -space-x-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-3 border-white shadow-lg"></div>
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full border-3 border-white shadow-lg"></div>
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-3 border-white shadow-lg"></div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">4.9</div>
                    <div className="flex justify-center text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Average Rating</div>
                  </div>
                </div>
                
                {/* Success Stats Card */}
                <div className="absolute bottom-8 left-4 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl animate-float border border-gray-100">
                  <div className="space-y-3">
                    <div className="text-3xl font-black text-gray-900">250K+</div>
                    <div className="text-gray-600 font-medium">Successful Sessions</div>
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-bold">98% Success Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-2">
                <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Why Choose TutorMatch?
                </span>
              </div>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6">
              Revolutionary <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Learning Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've transformed online tutoring with cutting-edge AI technology and a curated network of exceptional educators.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compact How It Works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your learning experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative group">
                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-gray-200 to-transparent transform translate-x-4 z-0"></div>
                )}
                
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative z-10">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white mr-4 shadow-lg`}>
                      {item.icon}
                    </div>
                    <div className="text-5xl font-black text-gray-100">{item.step}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Compact Subject Areas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6">Explore Subject Areas</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert tutors across every field of study
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectAreas.map((subject, index) => (
              <Link 
                key={index}
                to={`/search?subject=${subject.name}`} 
                className="group relative overflow-hidden bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="text-5xl mb-4">{subject.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{subject.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Active Students:</span>
                      <span className="font-bold text-gray-900">{subject.students}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available Tutors:</span>
                      <span className="font-bold text-gray-900">{subject.tutors}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
                    <span>Explore Tutors</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real results from our thriving learning community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                    {testimonial.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{testimonial.subject}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">{testimonial.improvement}</span>
                    </div>
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

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        </div>
        
        <div className="relative container mx-auto px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Learning Journey?
              </span>
            </h2>
            <p className="text-xl lg:text-2xl mb-10 text-blue-100 font-light leading-relaxed">
              Join thousands of successful learners and start your personalized education experience today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/register" 
                className="group bg-gradient-to-r from-white to-blue-50 text-gray-900 hover:from-blue-50 hover:to-white py-5 px-10 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/search" 
                className="group border-2 border-white/30 hover:border-white/50 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white py-5 px-10 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Play className="w-6 h-6" />
                <span>Watch Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;