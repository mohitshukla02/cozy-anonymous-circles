
import React, { useState } from 'react';
import { Settings, Trash2, Image, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { useToast } from '../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import GroupImageSelector from './GroupImageSelector';

interface AdminGroupActionsProps {
  groupId: string;
  groupName: string;
  isAdmin: boolean;
  currentImage?: string;
  onGroupDeleted: () => void;
  onImageUpdated?: () => void;
}

const AdminGroupActions = ({ 
  groupId, 
  groupName, 
  isAdmin, 
  currentImage,
  onGroupDeleted,
  onImageUpdated
}: AdminGroupActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
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

  const handleImageSelected = async (imageUrl: string) => {
    setIsUpdatingImage(true);
    try {
      const { error } = await supabase
        .from('groups')
        .update({ avatar: imageUrl })
        .eq('id', groupId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Group image has been updated",
      });

      if (onImageUpdated) {
        onImageUpdated();
      }
    } catch (error) {
      console.error('Error updating group image:', error);
      toast({
        title: "Error",
        description: "Failed to update group image",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingImage(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Settings size={14} />
            Settings
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowImageSelector(true)}>
            <Image size={14} className="mr-2" />
            Change Cover Image
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={14} className="mr-2" />
            Delete Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Image Selector Dialog */}
      <GroupImageSelector
        isOpen={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onImageSelected={handleImageSelected}
        currentImage={currentImage}
      />

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
    </>
  );
};

export default AdminGroupActions;
