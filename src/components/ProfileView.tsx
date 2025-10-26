import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ChevronRight, User, Apple, Calendar, Settings as SettingsIcon, Heart, Activity, AlertCircle, Package } from 'lucide-react';
import { UserProfile } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onResetOnboarding?: () => void;
  onNavigateToPantry?: () => void;
}

type DialogMode = 'diet-type' | 'exclusions' | 'nutrition' | 'weight-goal' | 'generator' | 'meal-layout' | null;

export function ProfileView({ profile, onUpdateProfile, onResetOnboarding, onNavigateToPantry }: ProfileViewProps) {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [tempProfile, setTempProfile] = useState<Partial<UserProfile>>({});

  const handleOpenDialog = (mode: DialogMode) => {
    setTempProfile({});
    setDialogMode(mode);
  };

  const handleSave = () => {
    onUpdateProfile(tempProfile);
    setDialogMode(null);
  };

  const activityLevelLabels = {
    sedentary: 'Sedentary',
    light: 'Light',
    moderate: 'Moderate',
    'very-active': 'Very Active',
    athlete: 'Athlete',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="h-10 w-10 text-purple-600" />
        </div>
        <h2>Profile & Settings</h2>
        <p className="text-sm text-gray-600">Manage your preferences and goals</p>
      </div>

      {/* Preferences Section */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="text-sm text-gray-500">Preferences</h3>
          </div>

          <button
            onClick={() => handleOpenDialog('diet-type')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Apple className="h-5 w-5 text-orange-600" />
              </div>
              <span>Diet Profile</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <button
            onClick={() => handleOpenDialog('generator')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SettingsIcon className="h-5 w-5 text-blue-600" />
              </div>
              <span>Generator Settings</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          {onNavigateToPantry && (
            <button
              onClick={onNavigateToPantry}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <span>Pantry Management</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </CardContent>
      </Card>

      {/* Diet & Nutrition */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="text-sm text-gray-500">Diet & Nutrition</h3>
          </div>

          <button
            onClick={() => handleOpenDialog('diet-type')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b"
          >
            <div>
              <div className="text-left mb-1">Primary Diet Type</div>
              <div className="text-sm text-gray-500">
                {profile.primaryDietType || 'Not set'}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <button
            onClick={() => handleOpenDialog('exclusions')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b"
          >
            <div>
              <div className="text-left mb-1">Food Exclusions</div>
              <div className="text-sm text-gray-500">
                {profile.foodExclusions.length > 0 
                  ? `${profile.foodExclusions.length} items` 
                  : 'None'}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <button
            onClick={() => handleOpenDialog('nutrition')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b"
          >
            <div>
              <div className="text-left mb-1">Nutrition Targets</div>
              <div className="text-sm text-gray-500">
                {profile.nutritionTargets?.calories 
                  ? `${profile.nutritionTargets.calories} cal/day` 
                  : 'Not set'}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <button
            onClick={() => handleOpenDialog('weight-goal')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div>
              <div className="text-left mb-1">Weight and Goal</div>
              <div className="text-sm text-gray-500">
                {profile.bodyWeight ? `${profile.bodyWeight} lbs` : 'Not set'} · {profile.goals?.join(', ') || 'No goals'}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </CardContent>
      </Card>

      {/* Meals & Schedule */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="text-sm text-gray-500">Meals & Schedule</h3>
          </div>

          <button
            onClick={() => handleOpenDialog('meal-layout')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b"
          >
            <div>
              <div className="text-left mb-1">Meal Layout</div>
              <div className="text-sm text-gray-500 capitalize">
                {profile.mealLayout?.replace('-', ' ') || 'Not set'}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1">Activity Level</div>
                <div className="text-sm text-gray-500">
                  {activityLevelLabels[profile.activityLevel]}
                </div>
              </div>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1">Favorite Ingredients</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {profile.favoriteIngredients.slice(0, 5).map(ing => (
                    <Badge key={ing} variant="secondary" className="text-xs">
                      {ing}
                    </Badge>
                  ))}
                  {profile.favoriteIngredients.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{profile.favoriteIngredients.length - 5}
                    </Badge>
                  )}
                </div>
              </div>
              <Heart className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs for editing */}
      <Dialog open={dialogMode === 'diet-type'} onOpenChange={() => setDialogMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Primary Diet Type</DialogTitle>
            <DialogDescription>Select your primary dietary preference</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select
              value={tempProfile.primaryDietType || profile.primaryDietType || ''}
              onValueChange={(value) => setTempProfile({ ...tempProfile, primaryDietType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="omnivore">Omnivore</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="pescatarian">Pescatarian</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogMode === 'nutrition'} onOpenChange={() => setDialogMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nutrition Targets</DialogTitle>
            <DialogDescription>Set your daily nutrition goals</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Daily Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="2000"
                value={tempProfile.nutritionTargets?.calories || profile.nutritionTargets?.calories || ''}
                onChange={(e) => setTempProfile({
                  ...tempProfile,
                  nutritionTargets: {
                    ...profile.nutritionTargets,
                    ...tempProfile.nutritionTargets,
                    calories: parseInt(e.target.value) || undefined
                  }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                placeholder="150"
                value={tempProfile.nutritionTargets?.protein || profile.nutritionTargets?.protein || ''}
                onChange={(e) => setTempProfile({
                  ...tempProfile,
                  nutritionTargets: {
                    ...profile.nutritionTargets,
                    ...tempProfile.nutritionTargets,
                    protein: parseInt(e.target.value) || undefined
                  }
                })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogMode === 'meal-layout'} onOpenChange={() => setDialogMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Meal Layout</DialogTitle>
            <DialogDescription>How do you prefer to structure your meals?</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {[
              { value: 'breakfast-lunch-dinner', label: 'Three Meals', desc: 'Breakfast, Lunch, Dinner' },
              { value: 'two-meals', label: 'Two Meals', desc: 'Intermittent fasting style' },
              { value: 'omad', label: 'One Meal', desc: 'One meal a day' },
              { value: 'flexible', label: 'Flexible', desc: 'Varies by day' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setTempProfile({ ...tempProfile, mealLayout: option.value as any })}
                className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                  (tempProfile.mealLayout || profile.mealLayout) === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Onboarding Button */}
      {onResetOnboarding && (
        <div className="text-center">
          <Button
            variant="destructive"
            onClick={onResetOnboarding}
            className="mt-6"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Reset Onboarding
          </Button>
        </div>
      )}
    </div>
  );
}