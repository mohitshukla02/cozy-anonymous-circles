
import React, { useState } from 'react';
import { MessageSquare, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../hooks/use-toast';

interface MeetupRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetupTitle: string;
  onSubmitRecap: (recap: string) => void;
}

const MeetupRecapModal = ({ isOpen, onClose, meetupTitle, onSubmitRecap }: MeetupRecapModalProps) => {
  const { toast } = useToast();
  const [recap, setRecap] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!recap.trim()) {
      toast({
        title: "Missing recap",
        description: "Please share how the meetup went!",
        variant: "destructive"
      });
      return;
    }

    if (recap.length > 200) {
      toast({
        title: "Too long",
        description: "Please keep your recap to 200 characters or less",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRecap(recap);
      toast({
        title: "Recap shared!",
        description: "Your meetup recap has been posted to the group"
      });
      onClose();
      setRecap('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share recap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart size={20} className="text-red-500" />
            How was "{meetupTitle}"?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share a quick recap with your group! What was the highlight?
          </p>
          
          <div className="space-y-2">
            <Textarea
              value={recap}
              onChange={(e) => setRecap(e.target.value)}
              placeholder="Great coffee and conversation! Looking forward to the next one..."
              rows={4}
              maxLength={200}
              className="resize-none"
            />
            <div className="text-xs text-gray-500 text-right">
              {recap.length}/200 characters
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Skip for now
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !recap.trim()}
              className="flex-1"
            >
              <MessageSquare size={14} className="mr-1" />
              {isSubmitting ? 'Sharing...' : 'Share recap'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetupRecapModal;
