import { Recipe } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Users, Heart } from 'lucide-react';

interface RecipeHistoryProps {
  recipes: Recipe[];
  onAddToWeek: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string) => void;
}

export function RecipeHistory({ recipes, onAddToWeek, onToggleFavorite }: RecipeHistoryProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No saved recipes yet</p>
        <p className="text-sm mt-1">Add your favorite recipes to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-gray-600" />
        <h3>Recipe History</h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Previously saved recipes you can add back to this week
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="mb-1">{recipe.name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {recipe.mainIngredients?.slice(0, 3).map((ingredient, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                    {recipe.mainIngredients && recipe.mainIngredients.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{recipe.mainIngredients.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mt-1"
                  onClick={() => onToggleFavorite(recipe.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </Button>
              </div>

              {/* Meal Framework */}
              {(recipe.protein || recipe.grain || recipe.vegetable) && (
                <div className="flex flex-wrap gap-1 text-xs">
                  {recipe.protein && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {recipe.protein}
                    </Badge>
                  )}
                  {recipe.grain && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      {recipe.grain}
                    </Badge>
                  )}
                  {recipe.vegetable && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {recipe.vegetable}
                    </Badge>
                  )}
                </div>
              )}

              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.cookTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings}</span>
                </div>
              </div>

              {/* Add to Week Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onAddToWeek(recipe)}
              >
                Add to This Week
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
