
import React, { useState } from 'react';
import { UserPlus, Send, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface InviteUserModalProps {
  trigger?: React.ReactNode;
  remainingInvites: number;
  onInviteSent?: () => void;
}

const InviteUserModal = ({ trigger, remainingInvites, onInviteSent }: InviteUserModalProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSendInvite = async () => {
    if (!email || !user) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-invitation', {
        body: { invitee_email: email }
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Invitation sent!',
        description: `Successfully sent invitation to ${email}`,
      });

      setEmail('');
      setOpen(false);
      onInviteSent?.();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast({
        title: 'Failed to send invitation',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="w-full">
      <UserPlus className="w-4 h-4 mr-2" />
      Invite Friends
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Invite a Friend</span>
          </DialogTitle>
          <DialogDescription>
            Share Circles with someone you think would enjoy meaningful connections.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invites remaining indicator */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Monthly invites remaining</Label>
              <span className="text-sm text-gray-600">{remainingInvites} / 5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(remainingInvites / 5) * 100}%` }}
              />
            </div>
            {remainingInvites === 0 && (
              <p className="text-sm text-red-600">
                You've used all your invites this month. More will be available next month.
              </p>
            )}
          </div>

          {remainingInvites > 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your friend receives an email with a signup link</li>
                  <li>• The invitation expires in 7 days</li>
                  <li>• They'll be able to join and explore groups</li>
                  <li>• You can track invitation status in your profile</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleSendInvite}
                  disabled={!email || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;
