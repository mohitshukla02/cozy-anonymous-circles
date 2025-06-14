
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, MessageCircle, Heart, Globe, MapPin, Shield, Zap, Lock, Calendar } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/lovable-uploads/ef93a52d-7a19-46ab-9703-c60bf1cfdcd7.png" alt="Circles Logo" className="w-8 h-8" />
              </div>
              <span className="font-medium text-xl text-gray-800">Circles</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/auth"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
            Build authentic connections<br />
            <span className="text-gray-600">through shared interests</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join interest-based communities, connect with like-minded people, and organize local meetups—all while maintaining complete anonymity until you're ready to share more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/auth"
              className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Start Connecting</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/auth"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2"
            >
              <span>Learn More</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600">Active Communities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">50k+</div>
              <div className="text-gray-600">Members Connected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600">Anonymous by Default</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Why choose Circles?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've reimagined how people connect online, prioritizing authenticity, privacy, and meaningful relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Complete Privacy
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No photos, real names, or personal data required. Connect through interests and conversations, not appearances or demographics.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Interest-Based Matching
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Join communities around your passions. From photography to cooking, books to hiking—find your people through shared interests.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Local Meetups
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Take online connections offline. Organize and join local meetups in your city for real-world activities and friendships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Circles Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              How Circles Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Building meaningful connections through a thoughtful, step-by-step process that prioritizes authenticity and safety.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Join Interest Communities</h4>
                  <p className="text-gray-600">
                    Browse communities based on your hobbies and passions. Each group gives you a unique anonymous identity to start fresh.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Share & Interact</h4>
                  <p className="text-gray-600">
                    Post content, comment thoughtfully, and engage with others' contributions. Quality interactions build your reputation within communities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">3</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Unlock Direct Messaging</h4>
                  <p className="text-gray-600">
                    After meaningful mutual interactions, private messaging becomes available for deeper conversations and connection building.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">4</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Join Local Groups</h4>
                  <p className="text-gray-600">
                    Find people in your city who share your interests. Join location-based communities for real-world meetup opportunities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">5</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Organize Meetups</h4>
                  <p className="text-gray-600">
                    Plan coffee walks, hiking trips, book clubs, or any activity. Active groups that regularly meet stay vibrant and engaged.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">6</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Build Real Friendships</h4>
                  <p className="text-gray-600">
                    Transform online connections into meaningful real-world relationships, all while maintaining the privacy and control you want.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              The difference is in the details
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've thought through every aspect of online connection to create something truly different.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Lock className="text-gray-700 mb-4" size={24} />
              <h4 className="font-semibold text-gray-900 mb-2">Anonymous by Design</h4>
              <p className="text-sm text-gray-600">No pressure to reveal personal information until you're ready.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Zap className="text-gray-700 mb-4" size={24} />
              <h4 className="font-semibold text-gray-900 mb-2">Quality Over Quantity</h4>
              <p className="text-sm text-gray-600">Meaningful interactions unlock deeper connection opportunities.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Calendar className="text-gray-700 mb-4" size={24} />
              <h4 className="font-semibold text-gray-900 mb-2">Active Communities</h4>
              <p className="text-sm text-gray-600">Groups that don't meet regularly are archived to keep things fresh.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Globe className="text-gray-700 mb-4" size={24} />
              <h4 className="font-semibold text-gray-900 mb-2">Global & Local</h4>
              <p className="text-sm text-gray-600">Connect worldwide through interests, locally through meetups.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 border border-gray-200">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">
              Ready to find your circle?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of people building authentic relationships through shared interests, 
              meaningful conversations, and real-world connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Join Circles Today</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/auth"
                className="bg-white text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
