
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Users, Shield, Settings, BookOpen, Mail } from 'lucide-react';

const HelpCenter = () => {
  const helpTopics = [
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Getting Started",
      description: "Learn how to create your profile and join your first group",
      articles: [
        "Creating your anonymous profile",
        "Understanding group dynamics",
        "Setting up your interests"
      ]
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      title: "Messaging & Interactions",
      description: "How anonymous messaging works and building connections",
      articles: [
        "How to unlock messaging",
        "Building trust through interactions",
        "Messaging safely and respectfully"
      ]
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "Privacy & Safety",
      description: "Protecting your privacy while building authentic connections",
      articles: [
        "How anonymity works",
        "Reporting inappropriate behavior",
        "Privacy settings and controls"
      ]
    },
    {
      icon: <Settings className="w-6 h-6 text-orange-600" />,
      title: "Account Settings",
      description: "Managing your account and preferences",
      articles: [
        "Updating your profile",
        "Notification preferences",
        "Deleting your account"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="text-center mb-12">
            <BookOpen className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions and learn how to make the most of Convene
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {helpTopics.map((topic, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                {topic.icon}
                <h3 className="text-xl font-semibold text-gray-900 ml-3">{topic.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{topic.description}</p>
              <ul className="space-y-2">
                {topic.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                      {article}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Mail className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
