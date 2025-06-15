
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Users, Heart, MessageCircle } from 'lucide-react';

interface MessagingGuidelinesModalProps {
  open: boolean;
  onClose: () => void;
}

const MessagingGuidelinesModal = ({ open, onClose }: MessagingGuidelinesModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />,
      title: "Interact in Groups",
      description: "Like and comment on posts from others in shared groups to build connections"
    },
    {
      icon: <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />,
      title: "Build Trust",
      description: "After 3+ mutual interactions, messaging unlocks between you and that person"
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />,
      title: "Start Chatting",
      description: "Send direct messages with your anonymous group identity while maintaining respect"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 p-0 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              How Anonymous Messaging Works
            </h2>
            <p className="text-blue-100 text-sm">
              Learn how to connect safely and meaningfully
            </p>
          </div>

          <Carousel className="w-full max-w-sm mx-auto">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="text-center py-8">
                    {slide.icon}
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {slide.title}
                    </h3>
                    <p className="text-blue-100 leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
            <CarouselNext className="right-2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
          </Carousel>

          <div className="flex justify-center gap-2 my-6">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-white text-blue-600 hover:bg-blue-50 transition-colors font-semibold py-3 px-6 rounded-xl"
          >
            I understand. Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagingGuidelinesModal;
