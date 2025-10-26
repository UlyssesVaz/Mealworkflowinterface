import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { mockPantryItems, mockFavoriteRecipes } from '../data/mockData';
import { RecipeDetailView } from './RecipeDetailView';
import { Recipe } from '../types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function CookView() {
  const [pantryItems] = useState(mockPantryItems);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Mock this week's planned meals - map to actual recipes
  const weekMeals = [
    { day: 'Monday', meal: 'Chicken Pasta', completed: true, protein: 'Chicken', grain: 'Pasta', vegetable: 'Tomatoes', recipeId: 'fav-1' },
    { day: 'Tuesday', meal: 'Chicken Stir-fry', completed: false, protein: 'Chicken', grain: 'Rice', vegetable: 'Bell Peppers', recipeId: 'fav-3' },
    { day: 'Wednesday', meal: 'Tomato Soup', completed: false, protein: 'Cream', grain: null, vegetable: 'Tomatoes', recipeId: 'fav-2' },
    { day: 'Thursday', meal: 'Chicken Pasta', completed: false, protein: 'Chicken', grain: 'Pasta', vegetable: 'Tomatoes', recipeId: 'fav-1' },
    { day: 'Friday', meal: 'Leftover day', completed: false, protein: null, grain: null, vegetable: null, recipeId: null },
  ];

  const today = 'Tuesday';

  const handleViewRecipe = (recipeId: string | null) => {
    if (!recipeId) return;
    const recipe = mockFavoriteRecipes.find(r => r.id === recipeId);
    if (recipe) {
      setSelectedRecipe(recipe);
    }
  };

  // If a recipe is selected, show the detail view
  if (selectedRecipe) {
    return <RecipeDetailView recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;
  }

  // Find items expiring soon
  const expiringItems = pantryItems.filter(item => {
    if (!item.expiresAt) return false;
    const daysUntilExpiration = (item.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiration <= 3 && daysUntilExpiration >= 0;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2>Cook</h2>
        <p className="text-gray-600">Execute your meal plan</p>
      </div>

      {/* Expiration Alerts */}
      {expiringItems.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span>Items expiring soon: </span>
            {expiringItems.map((item, idx) => (
              <span key={item.id}>
                {item.name}
                {idx < expiringItems.length - 1 ? ', ' : ''}
              </span>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* This Week's Meals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                This Week's Meals
              </CardTitle>
              <CardDescription>Your planned meals for the week</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weekMeals.map(({ day, meal, completed, protein, grain, vegetable }) => {
              const isToday = day === today;
              return (
                <div
                  key={day}
                  className={`p-4 border rounded-lg transition-all ${
                    isToday ? 'border-blue-500 bg-blue-50' : completed ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-500 min-w-24">{day}</span>
                        <span className={completed ? 'line-through' : ''}>
                          {meal}
                        </span>
                        {isToday && (
                          <Badge variant="default">Today</Badge>
                        )}
                        {completed && (
                          <Badge variant="secondary">✓ Done</Badge>
                        )}
                      </div>
                      
                      {/* Meal components */}
                      {(protein || grain || vegetable) && (
                        <div className="flex flex-wrap gap-1 ml-28">
                          {protein && (
                            <Badge variant="outline" className="text-xs bg-red-50">
                              🥩 {protein}
                            </Badge>
                          )}
                          {grain && (
                            <Badge variant="outline" className="text-xs bg-yellow-50">
                              🌾 {grain}
                            </Badge>
                          )}
                          {vegetable && (
                            <Badge variant="outline" className="text-xs bg-green-50">
                              🥬 {vegetable}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {!completed && meal !== 'Leftover day' && (
                      <Button 
                        variant={isToday ? 'default' : 'outline'}
                        onClick={() => handleViewRecipe(weekMeals.find(m => m.day === day)?.recipeId || null)}
                      >
                        {isToday ? 'Start Cooking' : 'View Recipe'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pantry Quick View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pantry</CardTitle>
              <CardDescription>{pantryItems.length} items in stock</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {pantryItems.map(item => {
              const isExpiring = expiringItems.some(e => e.id === item.id);
              return (
                <div key={item.id} className={`p-2 border rounded-lg ${isExpiring ? 'border-orange-500 bg-orange-50' : ''}`}>
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} {item.unit}
                  </p>
                  {isExpiring && (
                    <Badge variant="destructive" className="text-xs mt-1">Expiring soon</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
