import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Calendar, ShoppingCart, ChefHat, Home, User, LogOut, LogIn, Loader2 } from 'lucide-react';
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
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './components/auth/LoginButton';
import LogoutButton from './components/auth/LogoutButton';
import Profile from './components/auth/Profile';

export default function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, user, getAccessTokenSilently } = useAuth0();
  const [activeTab, setActiveTab] = useState('home');
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(mockPantryItems);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    // Try to load profile from localStorage, but only if it matches the current user
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile && user?.sub) {
      const parsedProfile = JSON.parse(savedProfile);
      if (parsedProfile.userId === user.sub) {
        return parsedProfile;
      }
    }
    // Default profile if none exists or it's a different user
    return {
      hasCompletedOnboarding: false,
      userId: user?.sub, // Add the Auth0 user ID
      goals: [],
      activityLevel: 'moderate',
      favoriteIngredients: [],
      favoriteMeals: [],
      favoriteStores: [],
      foodExclusions: [],
      mealLayout: 'breakfast-lunch-dinner',
      preferredCookingDays: [],
      typicalPrepTime: 30,
    };
  });

  // Check onboarding status from Auth0 metadata when user authenticates
  useEffect(() => {
    if (user) {
      const namespace = "https://pantheon.app/";
      const appMetadata = user[`${namespace}app_metadata`];
      
      // Debug: Log what we're receiving
      console.log('User object:', user);
      console.log('App metadata:', appMetadata);
      
      if (appMetadata?.hasCompletedOnboarding) {
        console.log('Onboarding was completed, skipping...');
        // If user has completed onboarding according to Auth0, update local state
        setUserProfile(prev => ({
          ...prev,
          hasCompletedOnboarding: true
        }));
      } else {
        console.log('Onboarding not completed in metadata');
      }
    }
  }, [user]);

  const handleCompleteOnboarding = async (profile: Partial<UserProfile>) => {
    console.log('Starting onboarding completion...', { profile });
    
    // Update local state
    setUserProfile({ 
      ...userProfile, 
      ...profile, 
      hasCompletedOnboarding: true,
      userId: user?.sub
    });
    console.log('Local state updated, user ID:', user?.sub);

    // Get the access token for the Management API
    try {
      console.log('Getting access token...');
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
          scope: 'update:current_user_metadata'
        }
      });
      console.log('Got access token');

      // Call our backend to update Auth0 metadata
      console.log('Calling backend endpoint...');
      const response = await fetch('http://localhost:3000/api/complete-onboarding', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile: {
            ...profile,
            hasCompletedOnboarding: true,
            userId: user?.sub
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update onboarding status: ${errorData}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);
      console.log('Successfully updated Auth0 metadata');
    } catch (error) {
      console.error('Failed to update Auth0 metadata:', error);
      // Log the full error for debugging
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
    }
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

  // Show loading state with spinner while Auth0 checks authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6 max-w-md px-4">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Pantheon</h1>
          <p className="text-gray-600 text-lg">Plan your meals, shop smarter, cook better</p>
          <button
            onClick={() => loginWithRedirect()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Sign In to Get Started
          </button>
        </div>
      </div>
    );
  }

  // Show onboarding if authenticated but hasn't completed onboarding
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
              <h1>Pantheon</h1>
            </div>
            <div className="flex items-center gap-2">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || 'User avatar'}
                  className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-colors duration-200"
                  onClick={() => setActiveTab('profile')}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              )}
            </div>
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
            <CookView 
              pantryItems={pantryItems}
              onUpdatePantryItem={handleUpdatePantryItem}
              onDeletePantryItem={handleDeletePantryItem}
              onClearExpiringItems={handleClearExpiringItems}
            />
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