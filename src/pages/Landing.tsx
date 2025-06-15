
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
                Sign in
              </Link>
              <Link
                to="/auth"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Join now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
            Real Connections.<br />
            <span className="text-gray-600">Real Places.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join small, interest‑driven groups that live and breathe offline. Organize a meetup in 28 days—or the group quietly vanishes. No scrolling, no likes—just face‑to‑face friendship.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/auth"
              className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Join a Group Near You</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/auth"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2"
            >
              <span>Start Your Own Meetup</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">28 Days</div>
              <div className="text-gray-600">To Meet or Fade Away</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">Real Friends</div>
              <div className="text-gray-600">Not Digital Noise</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">Face-to-Face</div>
              <div className="text-gray-600">Where Friendship Lives</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              From Digital Chatter to Genuine Bonds
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Social media gave us noise. We give you real moments. Here, every conversation leads somewhere tangible—a coffee, a hike, a shared bookshelf. Because friendship isn't something you like. It's something you live.
            </p>
          </div>

          {/* Features You'll Love */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                28‑Day Meetup Cycle
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Keeps the energy alive—no abandoned chat threads.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Anonymous by Default
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Share your interests first. Reveal yourself later.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Built‑In Planning Tools
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Pick dates, venues, RSVP—all in a few taps.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Streak Badges & Celebrations
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Celebrate every successful meetup with your crew.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Safety First
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Meet in public spots; guidelines to keep things comfortable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Three Steps to Your Next Friend
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Find Your Tribe</h4>
                  <p className="text-gray-600">
                    Explore local groups around your passions—photography, cooking, board games, you name it.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Plan Together</h4>
                  <p className="text-gray-600">
                    Chat anonymously, then schedule a public meetup with ease.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Meet IRL or Move On</h4>
                  <p className="text-gray-600">
                    When three people check in at your meetup, the clock resets. Skip it, and the group fades away.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-gray-50 rounded-2xl p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="text-white" size={40} />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Ready to Connect?</h4>
                <p className="text-gray-600 mb-6">Your next friendship is just three steps away.</p>
                <Link
                  to="/auth"
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Promise Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              More Than an App—it's a Movement
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're done watching good conversations die online. Here, your time turns into memories. Your group isn't just another forum—it's a living community that thrives on real‑world connection.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Clock's Ticking—But You're in Control
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              You have four weeks to make it count. That's plenty of time to turn "hello" into "see you Saturday." And once you do, you're not starting over—you're one meetup stronger.
            </p>
            <Link
              to="/auth"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 inline-flex items-center space-x-2"
            >
              <span>See Groups Ending Soon</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 border border-gray-200">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">
              Stop Collecting Followers. Start Making Friends.
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join a community that demands you show up—in person, heart first. Your next best friend awaits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Find Your People Today</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
