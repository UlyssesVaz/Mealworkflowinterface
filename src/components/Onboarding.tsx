import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    goals: [],
    activityLevel: 'moderate',
    favoriteIngredients: [],
    favoriteMeals: [],
    favoriteStores: [],
  });

  const totalSteps = 4;

  const goalOptions = [
    { id: 'lose-weight', label: 'Lose Weight', emoji: '📉' },
    { id: 'gain-muscle', label: 'Build Muscle', emoji: '💪' },
    { id: 'maintain', label: 'Maintain Health', emoji: '⚖️' },
    { id: 'eat-healthy', label: 'Eat Healthier', emoji: '🥗' },
    { id: 'save-time', label: 'Save Time', emoji: '⏱️' },
    { id: 'reduce-waste', label: 'Reduce Waste', emoji: '♻️' },
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
    { id: 'light', label: 'Light', desc: 'Exercise 1-3 days/week' },
    { id: 'moderate', label: 'Moderate', desc: 'Exercise 3-5 days/week' },
    { id: 'very-active', label: 'Very Active', desc: 'Exercise 6-7 days/week' },
    { id: 'athlete', label: 'Athlete', desc: 'Intense training' },
  ];

  const popularIngredients = [
    'Chicken', 'Beef', 'Fish', 'Tofu', 'Eggs',
    'Rice', 'Pasta', 'Quinoa', 'Bread',
    'Broccoli', 'Spinach', 'Tomatoes', 'Peppers', 'Onions',
    'Cheese', 'Yogurt', 'Milk',
  ];

  const popularMeals = [
    'Pasta Dishes', 'Stir-fries', 'Tacos', 'Salads', 'Soups',
    'Sandwiches', 'Bowls', 'Casseroles', 'Grilled Meats',
  ];

  const popularStores = [
    'Walmart', 'Target', 'Whole Foods', 'Trader Joe\'s',
    'Kroger', 'Safeway', 'Costco', 'Aldi', 'Local Market',
  ];

  const toggleGoal = (goalId: string) => {
    const goals = profile.goals || [];
    if (goals.includes(goalId)) {
      setProfile({ ...profile, goals: goals.filter(g => g !== goalId) });
    } else {
      setProfile({ ...profile, goals: [...goals, goalId] });
    }
  };

  const toggleItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      return [...array, item];
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({ ...profile, hasCompletedOnboarding: true });
    }
  };

  const canProceed = () => {
    if (step === 1) return (profile.goals?.length || 0) > 0;
    if (step === 2) return (profile.favoriteIngredients?.length || 0) > 0;
    if (step === 3) return (profile.favoriteMeals?.length || 0) > 0;
    return true; // Step 4 is optional
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Step {step} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
        </div>

        {/* Content Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">
                {step === 1 && 'Welcome! What are your goals?'}
                {step === 2 && 'What ingredients do you love?'}
                {step === 3 && 'What meals do you enjoy?'}
                {step === 4 && 'Where do you shop?'}
              </CardTitle>
            </div>
            <CardDescription>
              {step === 1 && 'Help us personalize your meal plans'}
              {step === 2 && 'We\'ll prioritize these in your weekly plans'}
              {step === 3 && 'We\'ll suggest more meals like these'}
              {step === 4 && 'Optional: We can optimize for your favorite stores'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Goals & Activity */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Select your goals (choose all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map(goal => (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          profile.goals?.includes(goal.id)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{goal.emoji}</div>
                        <div className="text-sm">{goal.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Activity Level</Label>
                  <div className="space-y-2">
                    {activityLevels.map(level => (
                      <button
                        key={level.id}
                        onClick={() => setProfile({ ...profile, activityLevel: level.id as any })}
                        className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                          profile.activityLevel === level.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{level.label}</div>
                        <div className="text-xs text-gray-600">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="weight">Body Weight (optional)</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="weight"
                      type="number"
                      placeholder="150"
                      value={profile.bodyWeight || ''}
                      onChange={(e) => setProfile({ ...profile, bodyWeight: parseInt(e.target.value) || undefined })}
                    />
                    <span className="text-sm text-gray-600">lbs</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Favorite Ingredients */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {popularIngredients.map(ingredient => (
                    <Badge
                      key={ingredient}
                      variant={profile.favoriteIngredients?.includes(ingredient) ? 'default' : 'outline'}
                      className="cursor-pointer text-sm py-2 px-3"
                      onClick={() => setProfile({
                        ...profile,
                        favoriteIngredients: toggleItem(profile.favoriteIngredients || [], ingredient)
                      })}
                    >
                      {ingredient}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Add your own (press Enter)</Label>
                  <Input
                    placeholder="e.g., Avocado"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        setProfile({
                          ...profile,
                          favoriteIngredients: [...(profile.favoriteIngredients || []), e.currentTarget.value.trim()]
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Favorite Meals */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {popularMeals.map(meal => (
                    <Badge
                      key={meal}
                      variant={profile.favoriteMeals?.includes(meal) ? 'default' : 'outline'}
                      className="cursor-pointer text-sm py-2 px-3"
                      onClick={() => setProfile({
                        ...profile,
                        favoriteMeals: toggleItem(profile.favoriteMeals || [], meal)
                      })}
                    >
                      {meal}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Add your own (press Enter)</Label>
                  <Input
                    placeholder="e.g., Pizza"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        setProfile({
                          ...profile,
                          favoriteMeals: [...(profile.favoriteMeals || []), e.currentTarget.value.trim()]
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Favorite Stores */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {popularStores.map(store => (
                    <Badge
                      key={store}
                      variant={profile.favoriteStores?.includes(store) ? 'default' : 'outline'}
                      className="cursor-pointer text-sm py-2 px-3"
                      onClick={() => setProfile({
                        ...profile,
                        favoriteStores: toggleItem(profile.favoriteStores || [], store)
                      })}
                    >
                      {store}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Add your own (press Enter)</Label>
                  <Input
                    placeholder="e.g., Local Co-op"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        setProfile({
                          ...profile,
                          favoriteStores: [...(profile.favoriteStores || []), e.currentTarget.value.trim()]
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === totalSteps ? 'Get Started' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}