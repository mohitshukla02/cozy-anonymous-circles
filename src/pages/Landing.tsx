
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
                Join Before It's Gone
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
            Meet in real life<br />
            <span className="text-gray-600">or your group dies</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Every group has 4 weeks to organize a real-world meetup. No meetup? The group vanishes forever. 
            This isn't another app for endless scrolling—it's a platform that forces online connections to become real friendships.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/auth"
              className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Join Before Groups Disappear</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/auth"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2"
            >
              <span>See What's Ending Soon</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">28 Days</div>
              <div className="text-gray-600">To Meet or Disappear</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">Real Friends</div>
              <div className="text-gray-600">Not Fake Followers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-2">No Lurking</div>
              <div className="text-gray-600">Show Up or Get Out</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              This isn't social media
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the anti-app. No infinite feeds, no fake likes, no digital zombies. 
              Either you meet in person, or you don't belong here.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                The Countdown Is Real
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every group gets exactly 28 days to organize a meetup. Miss the deadline and the group—along with all its conversations—disappears forever. No extensions, no excuses.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Anonymous Until You're Ready
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Start with complete privacy—no photos, no real names. Connect through genuine interests and conversations. Reveal yourself only when trust is earned.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Real Places, Real People
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Coffee shops, hiking trails, bookstores, parks—every connection leads to a real place where real people meet. Digital relationships that refuse to stay digital.
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
              How the clock works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple rules that force authentic connection. No hacks, no workarounds, no fake engagement. 
              Meet in person or watch your community disappear.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Find Your People, Fast</h4>
                  <p className="text-gray-600">
                    Join interest-based groups with a ticking clock. Photography, hiking, cooking, books—every group has one goal: meet in real life before time runs out.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Plan or Perish</h4>
                  <p className="text-gray-600">
                    No endless chatter. Every conversation should lead to planning a meetup. Suggest a coffee walk, organize a hiking trip, plan a book club—but plan something real.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">3</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Show Up or Disappear</h4>
                  <p className="text-gray-600">
                    The meetup happens or the group dies. No rescheduling forever, no "maybe next time." Either you care enough to show up, or you don't deserve the connection.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">4</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Tick, Tick, Tick...</h4>
                  <p className="text-gray-600">
                    Watch the countdown. 28 days, 20 days, 10 days, 3 days... The pressure builds. This isn't comfortable, and it's not supposed to be. Real friendship requires real effort.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">5</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">The Meetup Moment</h4>
                  <p className="text-gray-600">
                    Coffee in hand, face to face, no screens between you. This is where digital strangers become real friends. The group survives, resets the clock, and earns another 28 days.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">6</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Build Something That Lasts</h4>
                  <p className="text-gray-600">
                    Groups that meet regularly don't just survive—they thrive. Real friendships, regular meetups, genuine community. This is what social connection was supposed to be.
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
              Why this works when everything else fails
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional social media keeps you scrolling forever. We give you 28 days to make a real friend. 
              The time pressure changes everything.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Calendar className="text-gray-700 mb-4" size={24} />
              <h4 className="font-semibold text-gray-900 mb-2">Urgency Creates Action</h4>
              <p className="text-sm text-gray-600">Dead groups disappear. Surviving groups prove their worth. No ghost towns, no abandoned communities.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Heart className="text-gray-700 mb-4" size={24} />
              <h4 className="font-semibold text-gray-900 mb-2">Quality Over Noise</h4>
              <p className="text-sm text-gray-600">Every member has skin in the game. No lurkers, no time-wasters, no people who never show up.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Shield className="text-gray-700 mb-4" size={24} />
              <h4 className="font-semibold text-gray-900 mb-2">Safe, Then Real</h4>
              <p className="text-sm text-gray-600">Start completely anonymous. Build trust through genuine interaction. Reveal yourself when you choose.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Zap className="text-gray-700 mb-4" size={24} />
              <h4 className="font-semibold text-gray-900 mb-2">No Infinite Scroll</h4>
              <p className="text-sm text-gray-600">Purposeful interactions only. Every conversation should lead somewhere real, not nowhere digital.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 border border-gray-200">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">
              The clock is already ticking
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Right now, groups are forming, planning meetups, and racing against time. 
              Some will make it. Others will disappear forever. Don't miss your chance to find your people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Join Before It's Too Late</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/auth"
                className="bg-white text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 flex items-center justify-center"
              >
                See Groups Ending Soon
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
