
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, MessageCircle, Heart, Globe, MapPin, Shield } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-gray-800">
              Cozy Circles
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            Build authentic connections through shared interests and local meetups, 
            all while staying completely anonymous.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/auth"
              className="bg-amber-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Join the Community</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/auth"
              className="bg-white text-amber-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all border-2 border-amber-200 hover:border-amber-300 flex items-center justify-center space-x-2"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-blue-600" size={24} />
            </div>
            <h3 className="font-heading font-semibold text-lg text-gray-800 mb-3">
              Complete Anonymity
            </h3>
            <p className="text-gray-600 text-sm">
              No photos, real names, or personal data. Just authentic conversations with randomly generated usernames.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-purple-600" size={24} />
            </div>
            <h3 className="font-heading font-semibold text-lg text-gray-800 mb-3">
              Interest-Based Groups
            </h3>
            <p className="text-gray-600 text-sm">
              Join communities around your hobbies, passions, and interests. From photography to cooking to books.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-green-600" size={24} />
            </div>
            <h3 className="font-heading font-semibold text-lg text-gray-800 mb-3">
              Local Meetups
            </h3>
            <p className="text-gray-600 text-sm">
              Find people in your city for real-world activities. Groups that don't meet regularly are automatically archived.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-heading font-bold text-center text-gray-800 mb-12">
            How Anonymous Connection Works
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-amber-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Join Interest Groups</h4>
                  <p className="text-gray-600 text-sm">
                    Browse and join groups based on your hobbies and interests. Each group gives you a unique anonymous identity.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-amber-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Share & Interact</h4>
                  <p className="text-gray-600 text-sm">
                    Post content, comment on others' posts, and like what resonates with you. Build relationships through meaningful interactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-amber-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Unlock Messaging</h4>
                  <p className="text-gray-600 text-sm">
                    After 3+ mutual interactions with someone, direct messaging unlocks so you can have private conversations.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-semibold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Local Meetups</h4>
                  <p className="text-gray-600 text-sm">
                    Join local groups in your city and organize real-world meetups. Perfect for hiking, board games, coffee walks, and more.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-semibold text-sm">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Stay Active</h4>
                  <p className="text-gray-600 text-sm">
                    Local groups have 4 weeks to organize a meetup or they're archived. This keeps communities active and engaged.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-semibold text-sm">6</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Build Real Connections</h4>
                  <p className="text-gray-600 text-sm">
                    Move from anonymous interactions to real friendships, all while maintaining the privacy and safety you want.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft max-w-2xl mx-auto">
          <h3 className="text-2xl font-heading font-bold text-gray-800 mb-4">
            Ready to Connect Authentically?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of people building meaningful relationships through shared interests, 
            all while staying completely anonymous.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center space-x-2 bg-amber-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl"
          >
            <span>Start Your Anonymous Journey</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
