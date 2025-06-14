
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users, MessageCircle, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Cozy Circles</span>
            </div>
            <Link 
              to="/signup" 
              className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition-colors font-medium"
            >
              Join Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Connect Authentically,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Without the Noise
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A social platform designed to combat loneliness through genuine connections. 
            No photos, no real names, no superficial judgments—just authentic conversations 
            with people who share your interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all font-semibold text-lg inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Start Connecting</span>
              <ArrowRight size={20} />
            </Link>
            <button className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-full hover:bg-amber-600 hover:text-white transition-all font-semibold text-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Cozy Circles is Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Anonymous by Design</h3>
              <p className="text-gray-600 text-sm">No photos, real names, or personal data. Just your randomly generated username and authentic thoughts.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Quality Over Quantity</h3>
              <p className="text-gray-600 text-sm">Meaningful connections with a few rather than shallow interactions with many.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Interest-Based Matching</h3>
              <p className="text-gray-600 text-sm">Connect with people who share your passions, hobbies, and genuine interests.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Distraction-Free</h3>
              <p className="text-gray-600 text-sm">No endless scrolling, no algorithms pushing content. Just focused, intentional conversations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Mission</h2>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              In a world where social media often makes us feel more isolated than connected, 
              Cozy Circles offers a different approach. We believe that removing the pressure 
              of appearance and identity allows for more honest, vulnerable, and ultimately 
              meaningful relationships.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Here, you're valued for your thoughts, your kindness, and your authentic self—
              not your photos, follower count, or social status. Welcome to a cozier corner 
              of the internet.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Find Your Circle?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Join thousands of people building authentic connections, one conversation at a time.
          </p>
          <Link 
            to="/signup" 
            className="bg-white text-amber-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors font-semibold text-lg inline-flex items-center space-x-2 shadow-lg"
          >
            <span>Get Started</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
