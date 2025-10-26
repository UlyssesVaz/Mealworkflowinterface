import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Sparkles, Calendar, Heart } from 'lucide-react';
import { WeekPlanWorkflow } from './WeekPlanWorkflow';
import { WeekPlanView } from './WeekPlanView';
import { AddFavoriteRecipe } from './AddFavoriteRecipe';
import { RecipeHistory } from './RecipeHistory';
import { WeekCreationOptions } from './WeekCreationOptions';
import { SelectRecipeMode } from './SelectRecipeMode';
import { WeekHistory } from './WeekHistory';
import { Recipe, WeekPlan, WeekPreferences } from '../types';
import { mockFavoriteRecipes, mockWeekHistory } from '../data/mockData';

type ViewMode = 'empty' | 'workflow' | 'week-plan' | 'select-star' | 'select-stitch';

interface PlanViewProps {
  onNavigateToShop?: () => void;
}

export function PlanView({ onNavigateToShop }: PlanViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('empty');
  const [currentWeekPlan, setCurrentWeekPlan] = useState<WeekPlan | null>(null);
  const [weekRecipes, setWeekRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>(mockFavoriteRecipes);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [anchorRecipes, setAnchorRecipes] = useState<Recipe[]>([]);
  const [weekHistory] = useState(mockWeekHistory);

  // Mock pantry items that are expiring
  const expiringItems = ['chicken breast', 'tomatoes'];

  const handleGenerateWeek = (preferences: WeekPreferences) => {
    // Mock: Generate a week plan based on preferences
    // If we have anchor recipes (from star or stitch), use them
    let recipesToUse = [...mockRecipes];
    
    if (anchorRecipes.length > 0) {
      // In real app, would generate complementary recipes around anchor recipes
      recipesToUse = [...anchorRecipes, ...mockRecipes.slice(0, 7 - anchorRecipes.length)];
    }

    const mockWeekPlan: WeekPlan = {
      id: Date.now().toString(),
      weekOf: new Date(),
      meals: [
        { id: '1', recipeId: '1', day: 'Monday', mealType: 'dinner' },
        { id: '2', recipeId: '2', day: 'Tuesday', mealType: 'dinner' },
        { id: '3', recipeId: '3', day: 'Wednesday', mealType: 'lunch' },
        { id: '4', recipeId: '4', day: 'Thursday', mealType: 'dinner' },
        { id: '5', recipeId: '1', day: 'Friday', mealType: 'dinner' },
      ],
      sharedIngredients: ['chicken breast', 'tomatoes'], // Used in multiple recipes
      createdAt: new Date(),
    };

    setWeekRecipes(recipesToUse);
    setCurrentWeekPlan(mockWeekPlan);
    setViewMode('week-plan');
  };

  const handleRegenerate = () => {
    setViewMode('workflow');
    setAnchorRecipes([]);
  };

  const handleGoToShop = () => {
    if (onNavigateToShop) {
      onNavigateToShop();
    }
  };

  const handleAddFavoriteRecipe = (recipe: Partial<Recipe>) => {
    // Mock: In real app, would save to database
    const newRecipe = { ...recipe, isFavorite: true } as Recipe;
    setFavoriteRecipes([...favoriteRecipes, newRecipe]);
  };

  const handleToggleFavorite = (recipeId: string) => {
    setFavoriteRecipes((recipes) =>
      recipes.map((r) =>
        r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
      )
    );
  };

  const handleAddToWeek = (recipe: Recipe) => {
    // Navigate to workflow with this recipe as anchor
    setAnchorRecipes([recipe]);
    setViewMode('workflow');
  };

  const handleStartStarRecipe = () => {
    setViewMode('select-star');
  };

  const handleStartStitch = () => {
    setViewMode('select-stitch');
  };

  const handleSelectRecipes = (recipes: Recipe[]) => {
    setAnchorRecipes(recipes);
    setViewMode('workflow');
  };

  const handleRecreateWeek = (weekId: string) => {
    // Mock: In real app, would load the exact week and recreate it
    setViewMode('workflow');
  };

  const handleResausifyWeek = (weekId: string, modifications: any) => {
    // Mock: In real app, would modify the week plan with new ingredients
    setViewMode('workflow');
  };

  // Select recipe modes
  if (viewMode === 'select-star' || viewMode === 'select-stitch') {
    return (
      <SelectRecipeMode
        recipes={favoriteRecipes}
        mode={viewMode === 'select-star' ? 'star' : 'stitch'}
        onSelect={handleSelectRecipes}
        onBack={() => setViewMode('empty')}
      />
    );
  }

  if (viewMode === 'workflow') {
    return (
      <WeekPlanWorkflow
        onComplete={handleGenerateWeek}
        onCancel={() => {
          setViewMode(currentWeekPlan ? 'week-plan' : 'empty');
          setAnchorRecipes([]);
        }}
        pantryItems={expiringItems}
        anchorRecipes={anchorRecipes}
      />
    );
  }

  if (viewMode === 'week-plan' && currentWeekPlan) {
    return (
      <WeekPlanView
        weekPlan={currentWeekPlan}
        recipes={weekRecipes}
        onModify={() => setViewMode('workflow')}
        onRegenerate={handleRegenerate}
        onGoToShop={handleGoToShop}
      />
    );
  }

  // Empty state - no plan yet
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <Calendar className="h-16 w-16 mx-auto text-gray-300" />
        <div>
          <h2>Plan Your Week</h2>
          <p className="text-gray-600">
            Generate a personalized meal plan with smart ingredient reuse
          </p>
        </div>
      </div>

      {/* Creation Options */}
      <WeekCreationOptions
        onStartFresh={() => {
          setAnchorRecipes([]);
          setViewMode('workflow');
        }}
        onStarRecipe={handleStartStarRecipe}
        onStitchFavorites={handleStartStitch}
        hasHistory={favoriteRecipes.length > 0}
        favoriteRecipes={favoriteRecipes}
      />

      {/* Add Favorite Recipe Card */}
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowAddRecipe(true)}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-pink-100 to-red-100 rounded-lg">
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <div>
              <CardTitle>Add Favorite Recipe</CardTitle>
              <CardDescription>From URL or manual entry</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Save recipes from the web or create your own
          </p>
          <Button variant="outline" className="w-full" onClick={() => setShowAddRecipe(true)}>
            Add Recipe
          </Button>
        </CardContent>
      </Card>

      {/* Recipe History */}
      {favoriteRecipes.length > 0 && (
        <div className="space-y-4">
          <RecipeHistory
            recipes={favoriteRecipes}
            onAddToWeek={handleAddToWeek}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      )}

      {/* Expiring Items Warning */}
      {expiringItems.length > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <p className="text-sm mb-2">
              <span className="text-orange-600">⚠️ Items expiring soon:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {expiringItems.map(item => (
                <span key={item} className="text-sm">{item}</span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Generate a plan to use these ingredients!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Recipe Modal */}
      <AddFavoriteRecipe
        open={showAddRecipe}
        onClose={() => setShowAddRecipe(false)}
        onAdd={handleAddFavoriteRecipe}
      />

      {/* Week History */}
      {weekHistory.length > 0 && (
        <div className="space-y-4">
          <WeekHistory
            weeks={weekHistory.map(plan => ({
              plan,
              recipes: favoriteRecipes.filter(r => 
                plan.meals.some(m => m.recipeId === r.id)
              )
            }))}
            onRecreate={handleRecreateWeek}
            onResausify={handleResausifyWeek}
          />
        </div>
      )}
    </div>
  );
}

// Mock recipes for demonstration
const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Chicken Pasta',
    cookTime: 30,
    servings: 4,
    calories: 450,
    ingredients: ['chicken breast', 'pasta', 'tomatoes', 'garlic', 'olive oil'],
    mainIngredients: ['chicken breast', 'pasta', 'tomatoes'],
    instructions: ['Cook pasta', 'Sauté chicken', 'Combine'],
    tags: ['dinner'],
    prepComplexity: 'quick',
    protein: 'Chicken',
    grain: 'Pasta',
    vegetable: 'Tomatoes',
  },
  {
    id: '2',
    name: 'Chicken Tacos',
    cookTime: 25,
    servings: 4,
    calories: 380,
    ingredients: ['chicken breast', 'tortillas', 'lettuce', 'salsa', 'cheese'],
    mainIngredients: ['chicken breast', 'tortillas', 'lettuce'],
    instructions: ['Cook chicken', 'Assemble tacos'],
    tags: ['dinner'],
    prepComplexity: 'quick',
    protein: 'Chicken',
    grain: 'Tortillas',
    vegetable: 'Lettuce',
  },
  {
    id: '3',
    name: 'Tomato Soup',
    cookTime: 35,
    servings: 4,
    calories: 180,
    ingredients: ['tomatoes', 'onion', 'vegetable broth', 'cream', 'basil'],
    mainIngredients: ['tomatoes', 'onion', 'vegetable broth'],
    instructions: ['Sauté onions', 'Add tomatoes and broth', 'Blend'],
    tags: ['lunch'],
    prepComplexity: 'prep',
    protein: 'Cream',
    grain: null,
    vegetable: 'Tomatoes',
  },
  {
    id: '4',
    name: 'Veggie Stir-fry',
    cookTime: 20,
    servings: 4,
    calories: 280,
    ingredients: ['bell peppers', 'broccoli', 'rice', 'soy sauce', 'garlic'],
    mainIngredients: ['bell peppers', 'broccoli', 'rice'],
    instructions: ['Cook rice', 'Stir-fry vegetables'],
    tags: ['dinner'],
    prepComplexity: 'quick',
    protein: 'Tofu',
    grain: 'Rice',
    vegetable: 'Mixed Vegetables',
  },
];