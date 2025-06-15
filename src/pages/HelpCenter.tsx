
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Users, Shield, Settings, BookOpen, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-8 shadow-lg">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions and learn how to make the most of Convene
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {helpTopics.map((topic, index) => (
            <Card key={index} className="border-0 shadow-soft hover:shadow-soft-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mr-4">
                    {topic.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{topic.title}</CardTitle>
                </div>
                <CardDescription className="text-gray-600">{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {topic.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <button className="text-amber-600 hover:text-amber-700 font-medium transition-colors text-left hover:underline">
                        {article}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-soft-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Still need help?</h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Contact Support
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;
