import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowLeft, ArrowRight, X, Star } from 'lucide-react';
import { Recipe, WeekPreferences } from '../types';

interface WeekPlanWorkflowProps {
  onComplete: (preferences: WeekPreferences) => void;
  onCancel: () => void;
  pantryItems?: string[]; // expiring items to suggest
  anchorRecipes?: Recipe[]; // recipes to build around
}

export function WeekPlanWorkflow({ onComplete, onCancel, pantryItems = [], anchorRecipes = [] }: WeekPlanWorkflowProps) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<WeekPreferences>({
    vibe: '',
    mustUseIngredients: pantryItems,
    avoidIngredients: [],
    cookingDays: 5,
    prepStyle: 'daily-cooking',
    timePerDay: 30,
    anchorRecipes: anchorRecipes,
  });

  const totalSteps = 3;

  const vibeOptions = [
    'Light & Healthy',
    'Comfort Food', 
    'Quick & Easy',
    'Try New Things',
    'Meal Prep Heavy',
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleVibe = (vibe: string) => {
    setPreferences(prev => ({ ...prev, vibe }));
  };

  const addMustUse = (ingredient: string) => {
    if (!ingredient.trim()) return;
    setPreferences(prev => ({
      ...prev,
      mustUseIngredients: [...prev.mustUseIngredients, ingredient]
    }));
  };

  const removeMustUse = (ingredient: string) => {
    setPreferences(prev => ({
      ...prev,
      mustUseIngredients: prev.mustUseIngredients.filter(i => i !== ingredient)
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "What's your vibe this week?"}
            {step === 2 && 'Any must-haves or constraints?'}
            {step === 3 && 'Time & cooking style'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Set the tone for your meal plan'}
            {step === 2 && 'Ingredients to use or avoid'}
            {step === 3 && 'How much time can you dedicate?'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Anchor Recipes Banner */}
          {anchorRecipes.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-orange-600" />
                <p className="font-medium">
                  {anchorRecipes.length === 1 
                    ? 'Building week around your star recipe' 
                    : `Building week with ${anchorRecipes.length} favorite recipes`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {anchorRecipes.map(recipe => (
                  <Badge key={recipe.id} variant="secondary" className="bg-white">
                    {recipe.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Vibe */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {vibeOptions.map(vibe => (
                  <Card
                    key={vibe}
                    className={`cursor-pointer transition-all ${
                      preferences.vibe === vibe 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => toggleVibe(vibe)}
                  >
                    <CardContent className="pt-6 text-center">
                      <p>{vibe}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Must-haves / Avoid */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Must-use ingredients</Label>
                {pantryItems.length > 0 && (
                  <p className="text-sm text-orange-600">
                    💡 You have items expiring soon - consider using them!
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {preferences.mustUseIngredients.map(ing => (
                    <Badge 
                      key={ing}
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => removeMustUse(ing)}
                    >
                      {ing} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add ingredient (e.g., chicken)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addMustUse(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Things to avoid (optional)</Label>
                <Textarea
                  placeholder="Any ingredients or dishes to skip this week?"
                  value={preferences.avoidIngredients.join(', ')}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    avoidIngredients: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Time & Style */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>How many nights can you cook?</Label>
                <div className="flex gap-2">
                  {[3, 4, 5, 6, 7].map(days => (
                    <Button
                      key={days}
                      variant={preferences.cookingDays === days ? 'default' : 'outline'}
                      onClick={() => setPreferences({ ...preferences, cookingDays: days })}
                    >
                      {days}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Other days will be leftovers or quick meals
                </p>
              </div>

              <div className="space-y-3">
                <Label>Cooking style preference</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Card
                    className={`cursor-pointer transition-all ${
                      preferences.prepStyle === 'one-big-prep'
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setPreferences({ ...preferences, prepStyle: 'one-big-prep' })}
                  >
                    <CardContent className="pt-6">
                      <p className="mb-2">One Big Prep Session</p>
                      <p className="text-sm text-gray-600">
                        Cook/prep on Sunday, assemble during week
                      </p>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all ${
                      preferences.prepStyle === 'daily-cooking'
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setPreferences({ ...preferences, prepStyle: 'daily-cooking' })}
                  >
                    <CardContent className="pt-6">
                      <p className="mb-2">Daily Cooking</p>
                      <p className="text-sm text-gray-600">
                        Fresh meals each night, minimal prep
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Average time per day (minutes)</Label>
                <Input
                  type="number"
                  value={preferences.timePerDay}
                  onChange={(e) => setPreferences({ 
                    ...preferences, 
                    timePerDay: parseInt(e.target.value) || 0 
                  })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext}>
          {step === totalSteps ? 'Generate My Week' : 'Next'}
          {step < totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}