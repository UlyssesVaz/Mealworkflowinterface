import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, UtensilsCrossed, ArrowRight, Repeat } from 'lucide-react';
import { Recipe, WeekPlan } from '../types';

interface WeekPlanViewProps {
  weekPlan: WeekPlan;
  recipes: Recipe[];
  onModify: () => void;
  onRegenerate: () => void;
  onGoToShop: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeekPlanView({ weekPlan, recipes, onModify, onRegenerate, onGoToShop }: WeekPlanViewProps) {
  const getRecipeById = (id: string) => recipes.find(r => r.id === id);
  
  const getMealsForDay = (day: string) => {
    return weekPlan.meals
      .filter(m => m.day === day)
      .map(m => ({ ...m, recipe: getRecipeById(m.recipeId) }))
      .filter(m => m.recipe);
  };

  // Group shared ingredients by type for visualization
  const ingredientConnections = weekPlan.sharedIngredients;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Your Week Plan</h2>
          <p className="text-gray-600">
            {ingredientConnections.length} ingredients used across multiple meals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRegenerate}>
            <Repeat className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button onClick={onGoToShop}>
            Go to Shop
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Ingredient Reuse Highlight */}
      {ingredientConnections.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm mb-2">💡 Smart ingredient reuse this week:</p>
            <div className="flex flex-wrap gap-2">
              {ingredientConnections.map(ing => (
                <Badge key={ing} variant="secondary">
                  {ing}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {DAYS.map(day => {
          const meals = getMealsForDay(day);
          return (
            <Card key={day} className="overflow-hidden">
              <CardHeader className="pb-3 bg-gray-50">
                <CardTitle className="text-sm">{day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                {meals.length === 0 ? (
                  <p className="text-xs text-gray-400">Leftover day</p>
                ) : (
                  meals.map(({ mealType, recipe }) => (
                    <div key={mealType} className="space-y-1">
                      <p className="text-xs text-gray-500 capitalize">{mealType}</p>
                      <div className="border rounded p-2 space-y-2">
                        <p className="text-sm">{recipe!.name}</p>
                        
                        {/* Meal Framework Components */}
                        {(recipe!.protein || recipe!.grain || recipe!.vegetable) && (
                          <div className="flex flex-wrap gap-1">
                            {recipe!.protein && (
                              <Badge variant="outline" className="text-xs bg-red-50">
                                {recipe!.protein}
                              </Badge>
                            )}
                            {recipe!.grain && (
                              <Badge variant="outline" className="text-xs bg-yellow-50">
                                {recipe!.grain}
                              </Badge>
                            )}
                            {recipe!.vegetable && (
                              <Badge variant="outline" className="text-xs bg-green-50">
                                {recipe!.vegetable}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {recipe!.cookTime}m
                          </span>
                          {recipe!.prepComplexity && (
                            <Badge variant={recipe!.prepComplexity === 'quick' ? 'default' : 'secondary'} className="text-xs">
                              {recipe!.prepComplexity}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recipe Details */}
      <div>
        <h3 className="mb-4">All Recipes This Week</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map(recipe => (
            <Card key={recipe.id}>
              <CardHeader>
                <CardTitle className="text-base">{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Framework components */}
                <div className="flex flex-wrap gap-1">
                  {recipe.protein && (
                    <Badge variant="outline" className="text-xs bg-red-50">
                      🥩 {recipe.protein}
                    </Badge>
                  )}
                  {recipe.grain && (
                    <Badge variant="outline" className="text-xs bg-yellow-50">
                      🌾 {recipe.grain}
                    </Badge>
                  )}
                  {recipe.vegetable && (
                    <Badge variant="outline" className="text-xs bg-green-50">
                      🥬 {recipe.vegetable}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recipe.cookTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <UtensilsCrossed className="h-4 w-4" />
                    {recipe.servings}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
