import { useState, useRef, useEffect } from 'react';
import { RecipeNote } from '../types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { 
  StickyNote, 
  ShoppingCart,
  ChefHat,
  GripVertical,
  Lightbulb,
  Sparkles,
  X,
  Share2,
  Copy,
  Plus
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface NotesPanelProps {
  currentRecipeId?: string;
  currentRecipeName?: string;
}

export function NotesPanel({ currentRecipeId, currentRecipeName }: NotesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<RecipeNote[]>([
    {
      id: '1',
      title: '',
      content: "Don't forget cilantro",
      type: 'shopping-note',
      recipeId: undefined,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      userId: 'current-user',
      userName: 'You',
    },
    {
      id: '2',
      title: '',
      content: 'Korean eggplant next week',
      type: 'general',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      userId: 'partner',
      userName: 'Partner',
    },
    {
      id: '3',
      title: '',
      content: 'Less spicy',
      type: 'recipe-note',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      userId: 'partner',
      userName: 'Partner',
    }
  ]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedType, setSelectedType] = useState<'recipe-note' | 'shopping-note' | 'general' | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [sharedWith, setSharedWith] = useState([
    { id: '1', name: 'Partner', email: 'partner@email.com' }
  ]);
  const [newPersonEmail, setNewPersonEmail] = useState('');

  // Floating button position
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(e.clientX - dragStart.x, window.innerWidth - 64));
      const newY = Math.max(0, Math.min(e.clientY - dragStart.y, window.innerHeight - 64));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast.error('Please write a note');
      return;
    }

    let noteType: 'recipe-note' | 'shopping-note' | 'general' = 'general';
    
    // If user selected a type, use it
    if (selectedType) {
      noteType = selectedType;
    } else {
      // AI decides - simple heuristic
      const content = newNoteContent.toLowerCase();
      if (content.includes('buy') || content.includes('get') || content.includes('need') || content.includes('forget')) {
        noteType = 'shopping-note';
      } else if (content.includes('recipe') || content.includes('cook') || content.includes('spicy') || content.includes('heat')) {
        noteType = 'recipe-note';
      }
    }

    const newNote: RecipeNote = {
      id: Date.now().toString(),
      title: '',
      content: newNoteContent,
      type: noteType,
      recipeId: noteType === 'recipe-note' ? currentRecipeId : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'current-user',
      userName: 'You',
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setSelectedType(null);
    toast.success('Note added!');
  };

  const getNoteIcon = (type: RecipeNote['type']) => {
    switch (type) {
      case 'recipe-note':
        return '🍳';
      case 'shopping-note':
        return '🛒';
      default:
        return '💡';
    }
  };

  const handleCopyLink = async () => {
    const shareLink = `${window.location.origin}/shared-notes/abc123`;
    
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      // Fallback for when clipboard API is blocked
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Link copied to clipboard!');
      } catch (e) {
        toast.error('Failed to copy link');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleAddPerson = () => {
    if (!newPersonEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    // Simple email validation
    if (!newPersonEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    const newPerson = {
      id: Date.now().toString(),
      name: newPersonEmail.split('@')[0],
      email: newPersonEmail
    };

    setSharedWith([...sharedWith, newPerson]);
    setNewPersonEmail('');
    toast.success(`Invited ${newPersonEmail}`);
  };

  const handleRemovePerson = (id: string) => {
    setSharedWith(sharedWith.filter(p => p.id !== id));
    toast.success('Person removed');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          if (!isDragging) {
            setIsOpen(true);
          }
        }}
        className="fixed z-50 h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center cursor-move group"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          userSelect: 'none',
        }}
      >
        <div className="relative">
          <StickyNote className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
            {notes.length}
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors" />
        <GripVertical className="absolute bottom-1 h-3 w-3 opacity-50" />
      </button>

      {/* Notes Panel Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                Quick Note
              </SheetTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShareDialog(true)}
                  className="h-8"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            {/* Quick Note Input */}
            <div className="space-y-4">
              <Textarea
                placeholder="Type your note..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={3}
                className="resize-none"
              />

              <div>
                <p className="text-sm text-gray-600 mb-3">What's this about?</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedType === 'shopping-note' ? 'default' : 'outline'}
                    onClick={() => setSelectedType(selectedType === 'shopping-note' ? null : 'shopping-note')}
                    className="justify-start"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Shopping
                  </Button>
                  <Button
                    variant={selectedType === 'recipe-note' ? 'default' : 'outline'}
                    onClick={() => setSelectedType(selectedType === 'recipe-note' ? null : 'recipe-note')}
                    className="justify-start"
                  >
                    <ChefHat className="h-4 w-4 mr-2" />
                    Recipe
                  </Button>
                  <Button
                    variant={selectedType === 'general' ? 'default' : 'outline'}
                    onClick={() => setSelectedType(selectedType === 'general' ? null : 'general')}
                    className="justify-start"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Idea
                  </Button>
                  <Button
                    variant={selectedType === null ? 'default' : 'outline'}
                    onClick={() => setSelectedType(null)}
                    className="justify-start"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Let AI decide
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleAddNote} 
                className="w-full"
                disabled={!newNoteContent.trim()}
              >
                Add Note
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t pt-6">
              <h3 className="text-sm text-gray-600 mb-4">Recent</h3>
              
              {notes.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  No notes yet
                </p>
              ) : (
                <div className="space-y-3">
                  {notes.map(note => (
                    <div 
                      key={note.id} 
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="text-lg flex-shrink-0">
                        {getNoteIcon(note.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-700">"{note.content}"</span>
                        <span className="text-gray-400"> • {note.userName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Notes</DialogTitle>
            <DialogDescription>
              Anyone with the link can view and add notes to your meal plan
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">

            <div className="space-y-3">
              <h4 className="text-sm">Currently shared with:</h4>
              {sharedWith.length === 0 ? (
                <p className="text-sm text-gray-400">No one yet</p>
              ) : (
                <div className="space-y-2">
                  {sharedWith.map(person => (
                    <div 
                      key={person.id} 
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="flex-1">
                        <p className="text-sm">{person.name}</p>
                        <p className="text-xs text-gray-500">{person.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePerson(person.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={newPersonEmail}
                onChange={(e) => setNewPersonEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddPerson();
                  }
                }}
              />
              <Button onClick={handleAddPerson} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add person
              </Button>
            </div>

            <Button 
              onClick={handleCopyLink} 
              variant="outline" 
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
