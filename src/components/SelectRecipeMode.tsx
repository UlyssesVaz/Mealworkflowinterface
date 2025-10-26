import { useState } from 'react';
import { Recipe } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Clock, Users, ArrowLeft, Star } from 'lucide-react';

interface SelectRecipeModeProps {
  recipes: Recipe[];
  mode: 'star' | 'stitch';
  onSelect: (recipes: Recipe[]) => void;
  onBack: () => void;
}

export function SelectRecipeMode({ recipes, mode, onSelect, onBack }: SelectRecipeModeProps) {
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);

  const isStar = mode === 'star';
  const maxSelection = isStar ? 1 : 4;

  const handleToggleRecipe = (recipeId: string) => {
    if (isStar) {
      setSelectedRecipes([recipeId]);
    } else {
      setSelectedRecipes((prev) =>
        prev.includes(recipeId)
          ? prev.filter((id) => id !== recipeId)
          : prev.length < maxSelection
          ? [...prev, recipeId]
          : prev
      );
    }
  };

  const handleContinue = () => {
    const selected = recipes.filter((r) => selectedRecipes.includes(r.id));
    onSelect(selected);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="flex items-center gap-2">
            {isStar ? (
              <>
                <Star className="h-5 w-5 text-orange-600" />
                Make It the Star of the Week
              </>
            ) : (
              <>
                <Star className="h-5 w-5 text-green-600" />
                Stitch Your Favorites
              </>
            )}
          </h2>
          <p className="text-sm text-gray-600">
            {isStar
              ? 'Select one recipe to build your week around'
              : `Select up to ${maxSelection} recipes to include in your week`}
          </p>
        </div>
      </div>

      {/* Recipe Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe) => {
          const isSelected = selectedRecipes.includes(recipe.id);
          return (
            <Card
              key={recipe.id}
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-md'
              }`}
              onClick={() => handleToggleRecipe(recipe.id)}
            >
              <div className="p-4 space-y-3">
                {/* Header with Checkbox */}
                <div className="flex items-start gap-3">
                  {!isStar && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleRecipe(recipe.id)}
                      className="mt-1"
                    />
                  )}
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
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-600">
          {selectedRecipes.length} of {maxSelection} selected
        </div>
        <Button
          size="lg"
          disabled={selectedRecipes.length === 0}
          onClick={handleContinue}
        >
          Continue to Build Week
        </Button>
      </div>
    </div>
  );
}
