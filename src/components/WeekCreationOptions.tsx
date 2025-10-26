import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, Star, Copy, Shuffle, ListChecks } from 'lucide-react';
import { Recipe } from '../types';

interface WeekCreationOptionsProps {
  onStartFresh: () => void;
  onStarRecipe: () => void;
  onStitchFavorites: () => void;
  hasHistory: boolean;
  favoriteRecipes: Recipe[];
}

export function WeekCreationOptions({
  onStartFresh,
  onStarRecipe,
  onStitchFavorites,
  hasHistory,
  favoriteRecipes,
}: WeekCreationOptionsProps) {
  return (
    <div className="space-y-4">
      {/* Primary Action - Start Fresh */}
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow border-2"
        onClick={onStartFresh}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <CardTitle>Start New Recipe Process</CardTitle>
              <CardDescription>AI-powered recipe suggestions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Answer a few questions and get personalized recipe recommendations
          </p>
          <Button className="w-full" size="lg">
            Get Started
          </Button>
        </CardContent>
      </Card>

      {/* Build from Favorites */}
      {favoriteRecipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onStarRecipe}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Star of the Week</CardTitle>
                  <CardDescription className="text-xs">
                    Build a week around one recipe
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">
                Pick a favorite recipe and we'll create a week that shares its ingredients
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onStitchFavorites}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg">
                  <ListChecks className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Stitch Favorites</CardTitle>
                  <CardDescription className="text-xs">
                    Combine multiple favorites
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">
                Select multiple recipes and we'll fill in the rest of the week
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
