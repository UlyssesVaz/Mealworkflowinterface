import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { RecipePreferences } from '../types';

interface NewRecipeWorkflowProps {
  onComplete: (preferences: RecipePreferences) => void;
  onCancel: () => void;
}

export function NewRecipeWorkflow({ onComplete, onCancel }: NewRecipeWorkflowProps) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<RecipePreferences>({
    timeAvailable: 30,
    dietConstraints: ['Vegetarian'], // Mock from profile
    flavors: [],
    quickMealRatio: 0.5,
  });

  const totalSteps = 4;

  const commonFlavors = ['Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 'Indian', 'Thai'];
  const commonDiets = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];

  const toggleFlavor = (flavor: string) => {
    setPreferences(prev => ({
      ...prev,
      flavors: prev.flavors.includes(flavor)
        ? prev.flavors.filter(f => f !== flavor)
        : [...prev.flavors, flavor]
    }));
  };

  const toggleDiet = (diet: string) => {
    setPreferences(prev => ({
      ...prev,
      dietConstraints: prev.dietConstraints.includes(diet)
        ? prev.dietConstraints.filter(d => d !== diet)
        : [...prev.dietConstraints, diet]
    }));
  };

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
            {step === 1 && 'How much time do you have?'}
            {step === 2 && 'Dietary Constraints'}
            {step === 3 && 'Flavors & Cuisine'}
            {step === 4 && 'Quick vs Prep Meals'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'How much time can you spend cooking per day on average?'}
            {step === 2 && 'Based on your profile. Edit if needed.'}
            {step === 3 && 'What cuisines or flavors do you prefer?'}
            {step === 4 && 'Balance between quick meals and larger prep sessions'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Time */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Minutes per day</Label>
                <Input
                  type="number"
                  value={preferences.timeAvailable}
                  onChange={(e) => setPreferences({ ...preferences, timeAvailable: parseInt(e.target.value) || 0 })}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Slider
                    value={[preferences.timeAvailable]}
                    onValueChange={(value) => setPreferences({ ...preferences, timeAvailable: value[0] })}
                    max={120}
                    min={10}
                    step={5}
                  />
                </div>
                <p className="text-sm text-gray-500">{preferences.timeAvailable} minutes</p>
              </div>
            </div>
          )}

          {/* Step 2: Diet Constraints */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {commonDiets.map(diet => (
                  <Badge
                    key={diet}
                    variant={preferences.dietConstraints.includes(diet) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleDiet(diet)}
                  >
                    {diet}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Flavors */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {commonFlavors.map(flavor => (
                  <Badge
                    key={flavor}
                    variant={preferences.flavors.includes(flavor) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleFlavor(flavor)}
                  >
                    {flavor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Quick vs Prep Ratio */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Quick Meals vs Large Prep</Label>
                <Slider
                  value={[preferences.quickMealRatio * 100]}
                  onValueChange={(value) => setPreferences({ ...preferences, quickMealRatio: value[0] / 100 })}
                  max={100}
                  min={0}
                  step={10}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>More Quick Meals</span>
                  <span>More Prep Sessions</span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['S', 'M', 'T', 'W', 'Th', 'F', 'S'].map((day, idx) => {
                  const isQuickDay = idx < (preferences.quickMealRatio * 7);
                  return (
                    <div key={day} className="text-center">
                      <div className="text-sm mb-2">{day}</div>
                      <div className={`p-2 rounded border text-xs ${isQuickDay ? 'bg-green-100 border-green-300' : 'bg-orange-100 border-orange-300'}`}>
                        {isQuickDay ? 'Quick' : 'Prep'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-600">
                Suggestion: Quick meals for breakfast, larger prep for lunch/dinner
              </p>
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
          {step === totalSteps ? 'Generate Recipes' : 'Next'}
          {step < totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
