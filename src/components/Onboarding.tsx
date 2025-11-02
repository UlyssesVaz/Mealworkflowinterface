import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [favoritesText, setFavoritesText] = useState('');
  const [usingLocation, setUsingLocation] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    goals: [],
    activityLevel: 'light',
    favoriteIngredients: [],
    favoriteMeals: [],
    favoriteStores: [],
  });

  const totalSteps = 3;

  const goalOptions = [
    { id: 'lose-weight', label: 'Lose Weight', emoji: '📉' },
    { id: 'gain-muscle', label: 'Build Muscle', emoji: '💪' },
    { id: 'maintain', label: 'Maintain Health', emoji: '⚖️' },
  ];

  const activityLevels = [
    { id: 'light', label: 'Light', desc: 'Exercise 1-3 days/week' },
    { id: 'moderate', label: 'Moderate', desc: 'Exercise 3-5 days/week' },
    { id: 'very-active', label: 'Very Active', desc: 'Exercise 6-7 days/week' }
  ];



  const popularStores = [
    'Walmart', 'Target', 'Whole Foods', 'Trader Joe\'s',
    'Kroger', 'Safeway', 'Costco', 'Aldi', 'Local Market',
  ];

  const toggleGoal = (goalId: string) => {
    // Only allow one goal selection
    setProfile({ ...profile, goals: [goalId] });
  };

  const toggleItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      return [...array, item];
    }
  };

  const handleUseLocation = () => {
    // Placeholder for location-based store detection
    setUsingLocation(true);
    // In a real app, this would use geolocation API to find nearby stores
    // For now, just set a flag that location is being used
  };



  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Store the free-form text in favoriteIngredients as a single item for AI parsing
      const updatedProfile: Partial<UserProfile> = {
        ...profile,
        favoriteIngredients: favoritesText.trim() ? [favoritesText.trim()] : [],
        // Ensure all required fields are present with correct types
        goals: profile.goals || [],
        activityLevel: profile.activityLevel || 'moderate',
        favoriteMeals: profile.favoriteMeals || [],
        favoriteStores: profile.favoriteStores || [],
        foodExclusions: profile.foodExclusions || [],
        mealLayout: 'breakfast-lunch-dinner' as const,
        preferredCookingDays: [],
        typicalPrepTime: 30,
        hasCompletedOnboarding: true
      };
      console.log('Completing onboarding with profile:', updatedProfile);
      onComplete(updatedProfile);
    }
  };

  const canProceed = () => {
    if (step === 1) return (profile.goals?.length || 0) > 0;
    if (step === 2) return favoritesText.trim().length > 0;
    return true; // Step 3 is optional
  };

  // Simple calorie estimation (Mifflin-St Jeor equation approximation)
  const estimateCalories = () => {
    if (!profile.bodyWeight || !profile.activityLevel) return null;
    
    // Convert to kg if needed
    const weightInKg = weightUnit === 'lbs' ? profile.bodyWeight * 0.453592 : profile.bodyWeight;
    
    // Rough baseline (assuming average height/age)
    let baseCal = 1800 + (weightInKg * 10);
    
    // Activity multiplier
    if (profile.activityLevel === 'sedentary') baseCal *= 1.2;
    if (profile.activityLevel === 'light') baseCal *= 1.375;
    if (profile.activityLevel === 'moderate') baseCal *= 1.55;
    if (profile.activityLevel === 'very-active') baseCal *= 1.725;
    if (profile.activityLevel === 'athlete') baseCal *= 1.9;
    
    // Goal adjustment
    if (profile.goals?.includes('lose-weight')) baseCal *= 0.85;
    if (profile.goals?.includes('gain-muscle')) baseCal *= 1.15;
    
    return Math.round(baseCal);
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
                {step === 2 && 'List ingredients, meals, or cuisines you enjoy'}
                {step === 3 && 'Where do you shop?'}
              </CardTitle>
            </div>
            <CardDescription>
              {step === 1 && 'Help us personalize your meal plans'}
              {step === 2 && 'Add as many as you like—this helps us build plans you\'ll actually want to eat'}
              {step === 3 && 'Optional: We can optimize for your favorite stores'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Goals & Activity */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>What's your primary goal?</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {goalOptions.map(goal => (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => toggleGoal(goal.id)}
                        className={`p-4 border-2 rounded-lg text-center transition-all active:scale-95 active:bg-blue-200 ${
                          profile.goals?.includes(goal.id)
                            ? 'border-blue-600 bg-blue-100 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{goal.emoji}</div>
                        <div className={`text-sm ${profile.goals?.includes(goal.id) ? 'font-semibold' : ''}`}>{goal.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Activity Level</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {activityLevels.map(level => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, activityLevel: level.id as any })}
                        className={`p-4 border-2 rounded-lg transition-all active:scale-95 active:bg-blue-200 ${
                          profile.activityLevel === level.id
                            ? 'border-blue-600 bg-blue-100 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className={`text-sm ${profile.activityLevel === level.id ? 'font-semibold' : ''}`}>{level.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{level.desc}</div>
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
                      placeholder={weightUnit === 'lbs' ? '150' : '68'}
                      value={profile.bodyWeight || ''}
                      onChange={(e) => setProfile({ ...profile, bodyWeight: parseInt(e.target.value) || undefined })}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setWeightUnit(weightUnit === 'lbs' ? 'kg' : 'lbs')}
                      className="px-4 py-2 text-sm border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {weightUnit}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Step 2: Free-form Favorites */}
            {step === 2 && (
              <div className="space-y-3">
                <Textarea
                  id="favorites"
                  placeholder="Tell us what you like! E.g., I love Thai food, especially spicy dishes with chicken and rice. I also enjoy Italian pasta, grilled salmon, fresh vegetables like broccoli and bell peppers..."
                  value={favoritesText}
                  onChange={(e) => setFavoritesText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <p className="text-xs text-gray-500">
                  Share your favorite ingredients, meals, cuisines, or anything else you love to eat—we'll use AI to understand your preferences!
                </p>
              </div>
            )}

            {/* Step 3: Favorite Stores */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Primary Action: Use Location */}
                <div className="flex flex-col items-center">
                  <Button
                    onClick={handleUseLocation}
                    size="lg"
                    className="w-full max-w-md"
                    variant={usingLocation ? 'default' : 'default'}
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    {usingLocation ? 'Location enabled' : 'Use my location'}
                  </Button>
                  {usingLocation && (
                    <p className="text-xs text-green-600 mt-2">We'll find stores near you</p>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <Separator className="flex-1" />
                  <span className="text-sm text-gray-500">Or select from popular stores</span>
                  <Separator className="flex-1" />
                </div>

                {/* Manual Store Selection */}
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
