
import React, { useState } from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminMeetupActionsProps {
  meetupId: string;
  meetupTitle: string;
  isAdmin: boolean;
  onMeetupCanceled: () => void;
}

const AdminMeetupActions = ({ meetupId, meetupTitle, isAdmin, onMeetupCanceled }: AdminMeetupActionsProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const { toast } = useToast();

  if (!isAdmin) return null;

  const handleCancelMeetup = async () => {
    setIsCanceling(true);
    try {
      // Update meetup status to canceled
      const { error } = await supabase
        .from('meetups')
        .update({ status: 'canceled' })
        .eq('id', meetupId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meetup has been canceled",
      });

      onMeetupCanceled();
    } catch (error) {
      console.error('Error canceling meetup:', error);
      toast({
        title: "Error",
        description: "Failed to cancel meetup",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
      setShowCancelDialog(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowCancelDialog(true)}
        className="flex items-center gap-1"
      >
        <Calendar size={14} />
        Cancel Meetup
      </Button>

      {/* Cancel Meetup Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle size={20} />
              Cancel Meetup
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel "{meetupTitle}"? This will notify all attendees and mark the meetup as canceled.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowCancelDialog(false)}
              className="flex-1"
            >
              Keep Meetup
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelMeetup}
              disabled={isCanceling}
              className="flex-1"
            >
              {isCanceling ? 'Canceling...' : 'Cancel Meetup'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminMeetupActions;
