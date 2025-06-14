
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AnonymousJourneyModalProps {
  open: boolean;
  onClose: () => void;
}

const AnonymousJourneyModal = ({ open, onClose }: AnonymousJourneyModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 rounded-3xl bg-gradient-to-br from-amber-600 to-orange-600 text-white border-0 p-0 overflow-hidden">
        <div className="p-8">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-2xl font-bold text-white">
              Your Anonymous Journey
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            <p className="text-amber-100 leading-relaxed">
              Remember, in Cozy Circles, you're valued for your thoughts and authenticity, 
              not your appearance or status. Be yourself, be kind, and enjoy meaningful connections.
            </p>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <h3 className="font-semibold mb-3 text-white">Community Guidelines</h3>
              <ul className="text-sm text-amber-100 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-amber-200">•</span>
                  <span>Be respectful and kind</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-200">•</span>
                  <span>Keep conversations meaningful</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-200">•</span>
                  <span>Respect others' anonymity</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-amber-200">•</span>
                  <span>Report inappropriate behavior</span>
                </li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-6 bg-white text-amber-600 hover:bg-amber-50 transition-colors font-semibold py-3 px-6 rounded-2xl"
          >
            I understand. Accept
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-100 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default AnonymousJourneyModal;
