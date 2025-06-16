
import React, { useState } from 'react';
import { Upload, Search, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

interface GroupImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (imageUrl: string) => void;
  currentImage?: string;
}

const GroupImageSelector = ({ isOpen, onClose, onImageSelected, currentImage }: GroupImageSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const searchUnsplash = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-unsplash', {
        body: { 
          query: searchTerm,
          per_page: 20
        }
      });

      if (error) {
        throw error;
      }
      
      setUnsplashImages(data.results || []);
    } catch (error) {
      console.error('Error searching Unsplash:', error);
      toast({
        title: "Error",
        description: "Failed to search images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('group-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('group-images')
        .getPublicUrl(fileName);

      setSelectedImage(publicUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onImageSelected(selectedImage);
      onClose();
      setSelectedImage(null);
      setUnsplashImages([]);
      setSearchTerm('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Group Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Custom Image</h3>
            <p className="text-sm text-gray-500 mb-4">Choose a file from your computer (max 5MB)</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={uploading}
              variant="outline"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </Button>
          </div>

          {/* Unsplash Search */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Search Unsplash</h3>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search for images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUnsplash()}
              />
              <Button onClick={searchUnsplash} disabled={loading}>
                <Search size={16} />
              </Button>
            </div>
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Searching images...</p>
              </div>
            )}
            
            {unsplashImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {unsplashImages.map((image) => (
                  <div
                    key={image.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === image.urls.regular
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleImageSelect(image.urls.regular)}
                  >
                    <img
                      src={image.urls.small}
                      alt={image.alt_description || 'Unsplash image'}
                      className="w-full h-32 object-cover"
                    />
                    {selectedImage === image.urls.regular && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <Check className="h-8 w-8 text-blue-600" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                      by {image.user.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Image Preview */}
          {selectedImage && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selected Image</h3>
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedImage}
          >
            Use This Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupImageSelector;
