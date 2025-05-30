import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, Menu, X, User, Bell, Settings, LogOut, BookOpen, Users, Award, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled || location.pathname !== '/' 
          ? 'bg-white/90 backdrop-blur-xl shadow-2xl border-b border-purple-100/50' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-18 lg:h-20">
            {/* Enhanced Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  TutorMatch
                </span>
                <span className={`text-xs font-medium -mt-1 transition-colors duration-300 ${
                  scrolled || location.pathname !== '/' ? 'text-purple-500' : 'text-purple-200'
                }`}>
                  Learn • Teach • Grow
                </span>
              </div>
            </Link>
            
            {/* Compact Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-2xl p-1 border border-purple-200/30">
                <Link 
                  to="/search" 
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isActiveLink('/search') 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : (scrolled || location.pathname !== '/' 
                          ? 'text-gray-700 hover:bg-purple-50 hover:text-purple-700' 
                          : 'text-white/90 hover:bg-white/10')
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Find Tutors</span>
                </Link>
                
                <Link 
                  to="/apply" 
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isActiveLink('/apply') 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : (scrolled || location.pathname !== '/' 
                          ? 'text-gray-700 hover:bg-purple-50 hover:text-purple-700' 
                          : 'text-white/90 hover:bg-white/10')
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Become Tutor</span>
                </Link>
              </div>
              
              {currentUser ? (
                <div className="flex items-center space-x-3 ml-4">
                  {/* Compact Dashboard Link */}
                  <Link 
                    to={currentUser.role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard'} 
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isActiveLink('/tutor-dashboard') || isActiveLink('/student-dashboard') 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                        : (scrolled || location.pathname !== '/' 
                            ? 'text-gray-700 hover:bg-purple-50 hover:text-purple-700' 
                            : 'text-white/90 hover:bg-white/10')
                    } bg-white/10 backdrop-blur-lg border border-purple-200/30`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  
                  {/* Enhanced Notifications */}
                  <button className={`relative p-3 rounded-xl transition-all duration-300 bg-white/10 backdrop-blur-lg border border-purple-200/30 hover:bg-purple-50 hover:border-purple-300 group ${
                    scrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white/90'
                  }`}>
                    <Bell className="w-5 h-5 group-hover:animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold animate-bounce">
                      3
                    </span>
                  </button>
                  
                  {/* Enhanced Profile Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 bg-white/10 backdrop-blur-lg border border-purple-200/30 hover:bg-purple-50 hover:border-purple-300 ${
                        scrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white/90'
                      }`}
                    >
                      <div className="relative">
                        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="hidden xl:block text-left">
                        <div className="font-semibold text-sm">{currentUser.name?.split(' ')[0] || 'User'}</div>
                        <div className="text-xs opacity-75 capitalize">{currentUser.role}</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Enhanced Profile Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100 py-3 z-50 animate-in slide-in-from-top-5 duration-200">
                        <div className="px-6 py-4 border-b border-purple-100/50">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{currentUser.name || 'User'}</div>
                              <div className="text-sm text-gray-600">{currentUser.email}</div>
                              <div className="flex items-center mt-1">
                                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  currentUser.role === 'tutor' 
                                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700' 
                                    : 'bg-gradient-to-r from-green-100 to-teal-100 text-green-700'
                                }`}>
                                  {currentUser.role === 'tutor' ? '👨‍🏫 Tutor' : '👨‍🎓 Student'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          <Link 
                            to="/profile" 
                            className="flex items-center space-x-4 px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 transition-all duration-200 group"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <User className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="font-medium">My Profile</span>
                          </Link>
                          <Link 
                            to="/settings" 
                            className="flex items-center space-x-4 px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 transition-all duration-200 group"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <Settings className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="font-medium">Settings</span>
                          </Link>
                          {currentUser.role === 'tutor' && (
                            <Link 
                              to="/earnings" 
                              className="flex items-center space-x-4 px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 transition-all duration-200 group"
                            >
                              <div className="w-8 h-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <Award className="w-4 h-4 text-orange-600" />
                              </div>
                              <span className="font-medium">Earnings</span>
                            </Link>
                          )}
                        </div>
                        
                        <div className="border-t border-purple-100/50 pt-2">
                          <button 
                            onClick={handleLogout}
                            className="flex items-center space-x-4 px-6 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 w-full text-left group"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <LogOut className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <Link 
                    to="/login"
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isActiveLink('/login') 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                        : (scrolled || location.pathname !== '/' 
                            ? 'text-gray-700 hover:bg-purple-50 hover:text-purple-700' 
                            : 'text-white/90 hover:bg-white/10')
                    } bg-white/10 backdrop-blur-lg border border-purple-200/30`}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 border border-purple-400/30"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
            
            {/* Enhanced Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-3 rounded-xl transition-all duration-300 bg-white/10 backdrop-blur-lg border border-purple-200/30 ${
                scrolled || location.pathname !== '/' 
                  ? 'text-gray-700 hover:bg-purple-50' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-purple-100/50 animate-in slide-in-from-top-5 duration-200">
            <div className="container mx-auto px-6 py-6">
              <div className="space-y-3">
                <Link 
                  to="/search" 
                  className={`flex items-center space-x-4 py-4 px-5 rounded-2xl transition-all duration-300 ${
                    isActiveLink('/search') 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActiveLink('/search') 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-r from-purple-100 to-blue-100'
                  }`}>
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold">Find Tutors</div>
                    <div className="text-sm opacity-75">Discover expert tutors</div>
                  </div>
                </Link>
                
                <Link 
                  to="/apply" 
                  className={`flex items-center space-x-4 py-4 px-5 rounded-2xl transition-all duration-300 ${
                    isActiveLink('/apply') 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActiveLink('/apply') 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-r from-purple-100 to-blue-100'
                  }`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold">Become a Tutor</div>
                    <div className="text-sm opacity-75">Start teaching today</div>
                  </div>
                </Link>
                
                {currentUser ? (
                  <>
                    <Link 
                      to={currentUser.role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard'} 
                      className={`flex items-center space-x-4 py-4 px-5 rounded-2xl transition-all duration-300 ${
                        isActiveLink('/tutor-dashboard') || isActiveLink('/student-dashboard') 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isActiveLink('/tutor-dashboard') || isActiveLink('/student-dashboard') 
                          ? 'bg-white/20' 
                          : 'bg-gradient-to-r from-purple-100 to-blue-100'
                      }`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold">Dashboard</div>
                        <div className="text-sm opacity-75">Your control center</div>
                      </div>
                    </Link>
                    
                    <div className="border-t border-purple-100 pt-4 mt-4">
                      <div className="flex items-center space-x-4 py-4 px-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{currentUser.name || 'User'}</div>
                          <div className="text-sm text-gray-600 capitalize">{currentUser.role}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <Link 
                          to="/profile" 
                          className="flex items-center space-x-4 py-3 px-5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 transition-all duration-200"
                        >
                          <User className="w-5 h-5" />
                          <span className="font-medium">Profile</span>
                        </Link>
                        
                        <Link 
                          to="/settings" 
                          className="flex items-center space-x-4 py-3 px-5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 transition-all duration-200"
                        >
                          <Settings className="w-5 h-5" />
                          <span className="font-medium">Settings</span>
                        </Link>
                        
                        <button 
                          onClick={handleLogout}
                          className="flex items-center space-x-4 py-3 px-5 rounded-xl text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 w-full text-left"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 border-t border-purple-100 pt-4 mt-4">
                    <Link 
                      to="/login"
                      className={`block py-4 px-5 rounded-2xl font-bold transition-all duration-300 text-center ${
                        isActiveLink('/login') 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 hover:from-purple-100 hover:to-blue-100'
                      }`}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register"
                      className="block bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-800 text-white py-4 px-5 rounded-2xl font-bold transition-all duration-300 text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    >
                      Get Started Free
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-18 lg:h-20"></div>
    </>
  );
};

export default Navbar;