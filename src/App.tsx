import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Calendar, ShoppingCart, ChefHat, Home, User, LogOut, LogIn, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    hasCompletedOnboarding: false,
    userId: '',
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

  // Load full profile from Auth0 metadata when user authenticates
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        console.log('Loading profile for user:', user.sub);
        const namespace = "http://localhost:5173/";
        const appMetadata = user[`${namespace}app_metadata`];
        
        console.log('Received metadata:', appMetadata);
        
        if (appMetadata?.profile) {
          console.log('Found full profile in metadata');
          // Restore FULL profile from Auth0
          setUserProfile({
            ...appMetadata.profile,
            userId: user.sub,
            hasCompletedOnboarding: appMetadata.hasCompletedOnboarding || false
          });
        } else if (appMetadata?.hasCompletedOnboarding) {
          console.log('Found legacy profile (flag only)');
          // Legacy support: only flag was saved
          setUserProfile(prev => ({
            ...prev,
            userId: user.sub,
            hasCompletedOnboarding: true
          }));
        } else {
          console.log('No profile found, treating as new user');
          // New user
          setUserProfile(prev => ({
            ...prev,
            userId: user.sub
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleCompleteOnboarding = async (profile: Partial<UserProfile>) => {
    const toastId = toast.loading('Saving your preferences...');
    
    try {
      // Get token for our backend API only
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `http://localhost:3000`, // This should match your backend API identifier
        }
      });

      // Prepare complete profile
      const completeProfile: UserProfile = {
        ...userProfile,
        ...profile,
        hasCompletedOnboarding: true,
        userId: user?.sub
      };

      // Save to Auth0 FIRST
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/complete-onboarding`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profile: completeProfile })
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${await response.text()}`);
      }

      // ONLY update local state after successful save
      setUserProfile(completeProfile);
      toast.success('Your preferences have been saved!', { id: toastId });
      
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast.error('Failed to save your preferences. Please try again.', { id: toastId });
      // Don't update local state on error
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

  // 1. First, show Auth0 loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 2. Then show login if not authenticated
  if (!isAuthenticated || !user) {
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

  // 3. Show loading while fetching profile
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // 4. Only then check onboarding status
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