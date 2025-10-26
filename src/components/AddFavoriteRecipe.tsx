import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Image, FileText, Link as LinkIcon } from 'lucide-react';
import { Recipe } from '../types';

interface AddFavoriteRecipeProps {
  open: boolean;
  onClose: () => void;
  onAdd: (recipe: Partial<Recipe>) => void;
}

type AddMode = 'url' | 'photo' | 'manual' | null;

export function AddFavoriteRecipe({ open, onClose, onAdd }: AddFavoriteRecipeProps) {
  const [mode, setMode] = useState<AddMode>(null);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    // Mock: In real app, would parse URL or process photo
    const newRecipe: Partial<Recipe> = {
      id: Date.now().toString(),
      name: 'New Recipe',
      url: mode === 'url' ? url : undefined,
      isFavorite: true,
      // Additional fields would be populated from parsing
    };
    onAdd(newRecipe);
    handleClose();
  };

  const handleClose = () => {
    setMode(null);
    setUrl('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Favorite Recipe</DialogTitle>
          <p className="text-sm text-gray-600">
            Add a recipe from a URL, photo, or type it out manually
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recipe URL */}
          <div className="space-y-2">
            <Label htmlFor="recipe-url">Recipe URL</Label>
            <div className="flex gap-2">
              <Input
                id="recipe-url"
                type="url"
                placeholder="https://example.com/recipe"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          {/* Upload Photo or Type It Out */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode('photo')}
              className={`flex flex-col items-center justify-center gap-3 p-6 border-2 rounded-lg transition-colors hover:border-gray-400 ${
                mode === 'photo' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
              }`}
            >
              <Image className="h-8 w-8 text-gray-600" />
              <span>Upload Photo</span>
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex flex-col items-center justify-center gap-3 p-6 border-2 rounded-lg transition-colors hover:border-gray-400 ${
                mode === 'manual' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
              }`}
            >
              <FileText className="h-8 w-8 text-gray-600" />
              <span>Type It Out</span>
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about this recipe..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!url && !mode}>
            Add Recipe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
