
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Shield, HelpCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactOptions = [
    {
      icon: <HelpCircle className="w-6 h-6 text-blue-600" />,
      title: "General Support",
      description: "Questions about using Convene or need help getting started",
      category: "general"
    },
    {
      icon: <Shield className="w-6 h-6 text-red-600" />,
      title: "Report Issue",
      description: "Report inappropriate behavior or safety concerns",
      category: "report"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      title: "Feature Request",
      description: "Suggest new features or improvements",
      category: "feature"
    },
    {
      icon: <Mail className="w-6 h-6 text-purple-600" />,
      title: "Business Inquiry",
      description: "Partnerships, press, or business-related questions",
      category: "business"
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
            <Mail className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're here to help! Get in touch with us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {contactOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => setFormData({ ...formData, category: option.category })}
              className={`p-6 rounded-2xl text-left transition-all duration-300 transform hover:-translate-y-1 ${
                formData.category === option.category
                  ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-500 shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm border-2 border-transparent shadow-soft hover:shadow-soft-md'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mr-4">
                  {option.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{option.description}</p>
            </button>
          ))}
        </div>

        <Card className="border-0 shadow-soft-md bg-white/80 backdrop-blur-sm mb-12">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  placeholder="Tell us more about your question or concern..."
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft bg-gray-50/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Response Time</h3>
            <p className="text-gray-600 leading-relaxed">
              We typically respond to all inquiries within 24 hours. For urgent safety concerns, 
              we aim to respond within 2 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
