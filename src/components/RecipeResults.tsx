import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, UtensilsCrossed, Edit, Trash2, Plus } from 'lucide-react';
import { Recipe } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RecipeResultsProps {
  recipes: Recipe[];
  onAddToWeek: (recipeId: string) => void;
  onModify: (recipeId: string) => void;
  onDelete: (recipeId: string) => void;
  onBack: () => void;
}

export function RecipeResults({ recipes, onAddToWeek, onModify, onDelete, onBack }: RecipeResultsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Recipe Suggestions</h2>
          <p className="text-gray-600">Select recipes to add to your meal plan</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Planning
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map(recipe => (
          <Card key={recipe.id} className="overflow-hidden">
            {recipe.image && (
              <div className="aspect-video w-full overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-start justify-between gap-2">
                <span className="text-base">{recipe.name}</span>
                {recipe.prepComplexity && (
                  <Badge variant={recipe.prepComplexity === 'quick' ? 'default' : 'secondary'} className="text-xs">
                    {recipe.prepComplexity}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Ingredients */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Main Ingredients</p>
                <div className="flex flex-wrap gap-1">
                  {recipe.mainIngredients.slice(0, 4).map((ing, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {ing}
                    </Badge>
                  ))}
                  {recipe.mainIngredients.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{recipe.mainIngredients.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {recipe.cookTime} min
                </span>
                <span className="flex items-center gap-1">
                  <UtensilsCrossed className="h-4 w-4" />
                  {recipe.servings} meals
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onModify(recipe.id)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Modify
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(recipe.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Button
                className="w-full"
                onClick={() => onAddToWeek(recipe.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to This Week
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
