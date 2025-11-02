import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
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
    cookingDays: 7,
    prepStyle: 'daily-cooking',
    timePerDay: 30,
    anchorRecipes: anchorRecipes,
  });
  const [selectedCookingDays, setSelectedCookingDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);

  const totalSteps = 3;

  const vibeOptions = [
    { value: 'inspire', label: 'Inspire me - suggest new recipes' },
    { value: 'simple', label: 'Keep it simple - quick & easy meals' },
    { value: 'healthy', label: 'Healthy focus - lighter, nutritious meals' },
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

  const toggleCookingDay = (day: string) => {
    setSelectedCookingDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
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
            {step === 1 && 'How should we plan your week?'}
            {step === 2 && 'Any must-haves or constraints?'}
            {step === 3 && 'Plan your week'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Choose the approach that works best for you'}
            {step === 2 && 'Ingredients to use or avoid'}
            {step === 3 && 'Tell us about your cooking schedule'}
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

          {/* Step 1: Planning Approach */}
          {step === 1 && (
            <div className="space-y-4">
              <RadioGroup 
                value={preferences.vibe} 
                onValueChange={(value) => toggleVibe(value)}
              >
                {vibeOptions.map(option => (
                  <div 
                    key={option.value}
                    className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toggleVibe(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label 
                      htmlFor={option.value} 
                      className="cursor-pointer flex-1"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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

          {/* Step 3: Plan Your Week */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>How many meals do you need?</Label>
                <div className="flex gap-2">
                  {[5, 7, 10, 14].map(meals => (
                    <Button
                      key={meals}
                      variant={preferences.cookingDays === meals ? 'default' : 'outline'}
                      onClick={() => setPreferences({ ...preferences, cookingDays: meals })}
                    >
                      {meals} meals
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>When will you cook? (Select {selectedCookingDays.length} days)</Label>
                <div className="flex gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <Button
                      key={day}
                      variant={selectedCookingDays.includes(day) ? 'default' : 'outline'}
                      onClick={() => toggleCookingDay(day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Average time per meal:</Label>
                <div className="flex gap-2">
                  {[15, 30, 45, 60].map(minutes => (
                    <Button
                      key={minutes}
                      variant={preferences.timePerDay === minutes ? 'default' : 'outline'}
                      onClick={() => setPreferences({ 
                        ...preferences, 
                        timePerDay: minutes 
                      })}
                    >
                      {minutes === 60 ? '60+ min' : `${minutes} min`}
                    </Button>
                  ))}
                </div>
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