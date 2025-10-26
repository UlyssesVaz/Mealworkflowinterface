import { useState, useRef, useEffect } from 'react';
import { RecipeNote, NoteContribution } from '../types';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  StickyNote, 
  Plus, 
  Share2, 
  Trash2, 
  Edit,
  ShoppingCart,
  ChefHat,
  GripVertical,
  MessageSquarePlus
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
      title: 'Korean Eggplant Notes',
      content: 'Remember to cut the eggplant into 1-inch cubes. Partner prefers less spicy - use only 1 tsp of gochugaru instead of 2.',
      type: 'recipe-note',
      recipeId: 'korean-eggplant',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      contributions: [
        {
          id: 'c1',
          userId: 'partner',
          userName: 'Partner',
          content: 'Also, I find it easier when the garlic is minced really fine!',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        }
      ]
    },
    {
      id: '2',
      title: 'Shopping List for This Week',
      content: '- Chicken breast (2 lbs)\n- Rice (2 bags)\n- Mixed vegetables\n- Soy sauce\n- Sesame oil',
      type: 'shopping-note',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    }
  ]);
  const [editingNote, setEditingNote] = useState<RecipeNote | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState<'recipe-note' | 'shopping-note' | 'general'>('recipe-note');
  const [newContribution, setNewContribution] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);

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

  const handleCreateNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    const newNote: RecipeNote = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      type: newNoteType,
      recipeId: newNoteType === 'recipe-note' ? currentRecipeId : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([newNote, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowNewNoteForm(false);
    toast.success('Note created!');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
    toast.success('Note deleted');
  };

  const handleShareNote = (note: RecipeNote) => {
    const shareText = `${note.title}\n\n${note.content}${note.contributions && note.contributions.length > 0 ? '\n\nContributions:\n' + note.contributions.map(c => `- ${c.userName}: ${c.content}`).join('\n') : ''}`;
    
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: shareText,
      }).then(() => {
        toast.success('Note shared successfully!');
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        toast.success('Note copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Note copied to clipboard!');
    }
  };

  const handleAddContribution = (noteId: string) => {
    if (!newContribution.trim()) return;

    const contribution: NoteContribution = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      content: newContribution,
      createdAt: new Date(),
    };

    setNotes(notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          contributions: [...(note.contributions || []), contribution],
          updatedAt: new Date(),
        };
      }
      return note;
    }));

    setNewContribution('');
    toast.success('Contribution added!');
  };

  const getFilteredNotes = (type?: 'recipe-note' | 'shopping-note' | 'general') => {
    return type ? notes.filter(n => n.type === type) : notes;
  };

  const getNoteIcon = (type: RecipeNote['type']) => {
    switch (type) {
      case 'recipe-note':
        return <ChefHat className="h-4 w-4" />;
      case 'shopping-note':
        return <ShoppingCart className="h-4 w-4" />;
      default:
        return <StickyNote className="h-4 w-4" />;
    }
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
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              Notes & Contributions
            </SheetTitle>
            <SheetDescription>
              Share recipe notes and shopping lists with your cooking partner
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* New Note Button */}
            {!showNewNoteForm && (
              <Button 
                onClick={() => setShowNewNoteForm(true)} 
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Note
              </Button>
            )}

            {/* New Note Form */}
            {showNewNoteForm && (
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-base">Create New Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm mb-2 block">Note Type</label>
                    <Tabs value={newNoteType} onValueChange={(v) => setNewNoteType(v as any)}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="recipe-note">
                          <ChefHat className="h-4 w-4 mr-2" />
                          Recipe
                        </TabsTrigger>
                        <TabsTrigger value="shopping-note">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Shopping
                        </TabsTrigger>
                        <TabsTrigger value="general">
                          <StickyNote className="h-4 w-4 mr-2" />
                          General
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {currentRecipeName && newNoteType === 'recipe-note' && (
                    <Badge variant="outline">For: {currentRecipeName}</Badge>
                  )}

                  <div>
                    <label className="text-sm mb-2 block">Title</label>
                    <Input
                      placeholder="e.g., Korean Eggplant Tips"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm mb-2 block">Content</label>
                    <Textarea
                      placeholder="Write your note here..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateNote} className="flex-1">
                      Create Note
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowNewNoteForm(false);
                        setNewNoteTitle('');
                        setNewNoteContent('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Notes Tabs */}
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({notes.length})</TabsTrigger>
                <TabsTrigger value="recipe">Recipe</TabsTrigger>
                <TabsTrigger value="shopping">Shopping</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {notes.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-gray-500">
                      No notes yet. Create your first note!
                    </CardContent>
                  </Card>
                ) : (
                  notes.map(note => (
                    <Card key={note.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getNoteIcon(note.type)}
                              <CardTitle className="text-base">{note.title}</CardTitle>
                            </div>
                            <p className="text-xs text-gray-500">
                              {note.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleShareNote(note)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="whitespace-pre-wrap">{note.content}</p>

                        {/* Contributions */}
                        {note.contributions && note.contributions.length > 0 && (
                          <div className="border-t pt-4">
                            <p className="text-sm mb-2">💬 Contributions from others:</p>
                            <div className="space-y-2">
                              {note.contributions.map(contribution => (
                                <div key={contribution.id} className="bg-blue-50 p-3 rounded">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm">{contribution.userName}</span>
                                    <span className="text-xs text-gray-500">
                                      {contribution.createdAt.toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{contribution.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add Contribution */}
                        <div className="border-t pt-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a contribution..."
                              value={newContribution}
                              onChange={(e) => setNewContribution(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddContribution(note.id);
                                }
                              }}
                            />
                            <Button 
                              size="sm"
                              onClick={() => handleAddContribution(note.id)}
                            >
                              <MessageSquarePlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="recipe" className="space-y-4 mt-4">
                {getFilteredNotes('recipe-note').map(note => (
                  <Card key={note.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="shopping" className="space-y-4 mt-4">
                {getFilteredNotes('shopping-note').map(note => (
                  <Card key={note.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="general" className="space-y-4 mt-4">
                {getFilteredNotes('general').map(note => (
                  <Card key={note.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
