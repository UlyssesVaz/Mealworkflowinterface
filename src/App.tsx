import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Calendar, ShoppingCart, ChefHat, Home, User } from 'lucide-react';
import { HomeView } from './components/HomeView';
import { PlanView } from './components/PlanView';
import { ShopView } from './components/ShopView';
import { CookView } from './components/CookView';
import { Onboarding } from './components/Onboarding';
import { ProfileView } from './components/ProfileView';
import { PantryView } from './components/PantryView';
import { NotesPanel } from './components/NotesPanel';
import { UserProfile, PantryItem } from './types';
import { Toaster } from './components/ui/sonner';
import { mockPantryItems } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(mockPantryItems);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    hasCompletedOnboarding: false,
    goals: [],
    activityLevel: 'moderate',
    favoriteIngredients: [],
    favoriteMeals: [],
    favoriteStores: [],
    foodExclusions: [],
    mealLayout: 'breakfast-lunch-dinner',
    preferredCookingDays: [],
    typicalPrepTime: 30,
  });

  const handleCompleteOnboarding = (profile: Partial<UserProfile>) => {
    setUserProfile({ ...userProfile, ...profile, hasCompletedOnboarding: true });
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile({ ...userProfile, ...updates });
  };

  const handleResetOnboarding = () => {
    setUserProfile({
      hasCompletedOnboarding: false,
      goals: [],
      activityLevel: 'moderate',
      favoriteIngredients: [],
      favoriteMeals: [],
      favoriteStores: [],
      foodExclusions: [],
      mealLayout: 'breakfast-lunch-dinner',
      preferredCookingDays: [],
      typicalPrepTime: 30,
    });
    setActiveTab('home');
  };

  const handleUpdatePantryItem = (id: string, updates: Partial<PantryItem>) => {
    setPantryItems(items =>
      items.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeletePantryItem = (id: string) => {
    setPantryItems(items => items.filter(item => item.id !== id));
  };

  const handleClearExpiringItems = () => {
    setPantryItems(items => {
      const expiringItems = items.filter(item => {
        if (item.storageLocation === 'freezer') return false;
        if (!item.expiresAt) return false;
        const days = Math.ceil((item.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days <= 3;
      });
      return items.filter(item => !expiringItems.includes(item));
    });
  };

  // Show onboarding if not completed
  if (!userProfile.hasCompletedOnboarding) {
    return <Onboarding onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <NotesPanel />
      
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <div className="flex-1 text-center">
              <h1>Meal Planner</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {activeTab !== 'home' && activeTab !== 'profile' && (
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="plan" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Plan
              </TabsTrigger>
              <TabsTrigger value="shop" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Shop
              </TabsTrigger>
              <TabsTrigger value="cook" className="flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Cook
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="home">
            <HomeView onNavigate={setActiveTab} />
          </TabsContent>

          <TabsContent value="plan">
            <PlanView onNavigateToShop={() => setActiveTab('shop')} />
          </TabsContent>

          <TabsContent value="shop">
            <ShopView />
          </TabsContent>

          <TabsContent value="cook">
            <CookView />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileView 
              profile={userProfile} 
              onUpdateProfile={handleUpdateProfile} 
              onResetOnboarding={handleResetOnboarding}
              onNavigateToPantry={() => setActiveTab('pantry')}
            />
          </TabsContent>

          <TabsContent value="pantry">
            <PantryView 
              items={pantryItems}
              onUpdateItem={handleUpdatePantryItem}
              onDeleteItem={handleDeletePantryItem}
              onClearExpiring={handleClearExpiringItems}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}