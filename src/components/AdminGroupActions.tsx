
import React, { useState } from 'react';
import { Trash2, Settings, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminGroupActionsProps {
  groupId: string;
  groupName: string;
  isAdmin: boolean;
  onGroupDeleted: () => void;
}

const AdminGroupActions = ({ groupId, groupName, isAdmin, onGroupDeleted }: AdminGroupActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  if (!isAdmin) return null;

  const handleDeleteGroup = async () => {
    setIsDeleting(true);
    try {
      // Delete the group
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Group has been deleted successfully",
      });

      onGroupDeleted();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettingsDialog(true)}
          className="flex items-center gap-1"
        >
          <Settings size={14} />
          Settings
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="flex items-center gap-1"
        >
          <Trash2 size={14} />
          Delete Group
        </Button>
      </div>

      {/* Delete Group Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle size={20} />
              Delete Group
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{groupName}"? This action cannot be undone. All posts, comments, and meetups associated with this group will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteGroup}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? 'Deleting...' : 'Delete Group'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog - Placeholder for future settings */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Group Settings</DialogTitle>
            <DialogDescription>
              Manage group settings and preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">More group settings will be available here in future updates.</p>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowSettingsDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminGroupActions;
