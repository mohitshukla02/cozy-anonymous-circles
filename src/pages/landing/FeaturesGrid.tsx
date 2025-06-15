
import React from 'react';
import { Calendar, Users, MapPin, Heart, Shield, MessageCircle } from 'lucide-react';

const FEATURES = [
  {
    icon: <Calendar className="text-red-600" size={20} />,
    title: "28‑Day Meetup Cycle",
    colorClass: "bg-red-100",
    desc: "Keeps the energy alive—no abandoned chat threads."
  },
  {
    icon: <Users className="text-blue-600" size={20} />,
    title: "Anonymous by Default",
    colorClass: "bg-blue-100",
    desc: "Share your interests first. Reveal yourself later."
  },
  {
    icon: <MapPin className="text-green-600" size={20} />,
    title: "Built‑In Planning Tools",
    colorClass: "bg-green-100",
    desc: "Pick dates, venues, RSVP—all in a few taps."
  },
  {
    icon: <Heart className="text-purple-600" size={20} />,
    title: "Streak Badges & Celebrations",
    colorClass: "bg-purple-100",
    desc: "Celebrate every successful meetup with your crew."
  },
  {
    icon: <Shield className="text-orange-600" size={20} />,
    title: "Safety First",
    colorClass: "bg-orange-100",
    desc: "Meet in public spots; guidelines to keep things comfortable."
  },
  {
    icon: <MessageCircle className="text-indigo-600" size={20} />,
    title: "Private Messaging",
    colorClass: "bg-indigo-100",
    desc: "Unlock direct messaging by engaging with group members."
  },
];

const FeaturesGrid: React.FC = () => (
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {FEATURES.map(f => (
          <div
            className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-200 flex flex-col items-center"
            key={f.title}
          >
            <div className={`w-10 h-10 ${f.colorClass} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
              {f.icon}
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {f.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-xs">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesGrid;
