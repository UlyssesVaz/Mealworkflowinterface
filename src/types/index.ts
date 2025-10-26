// Core data types
export interface Recipe {
  id: string;
  name: string;
  cookTime: number; // minutes
  servings: number;
  calories: number;
  ingredients: string[];
  mainIngredients: string[]; // meat, grains, etc (not salt/pepper)
  instructions: string[];
  image?: string;
  tags: string[];
  cuisine?: string;
  prepComplexity: 'quick' | 'prep'; // quick meal or large prep
  url?: string;
  isFavorite?: boolean;
  // Meal framework components
  protein?: string;
  grain?: string;
  vegetable?: string;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiresAt?: Date;
  category: 'protein' | 'grain' | 'vegetable' | 'dairy' | 'pantry' | 'other';
  storageLocation: 'pantry' | 'fridge' | 'freezer';
  addedAt: Date;
}

export interface MealPlan {
  id: string;
  recipeId: string;
  day: string; // e.g., "Monday"
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

export interface WeekPlan {
  id: string;
  weekOf: Date;
  meals: MealPlan[];
  sharedIngredients: string[]; // ingredients used across multiple meals
  createdAt: Date;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  purchased: boolean;
  fromRecipes: string[]; // which recipes need this
}

export interface WeekPreferences {
  vibe: string; // "Light & healthy", "Comfort food", etc
  mustUseIngredients: string[]; // from pantry/expiring
  avoidIngredients: string[];
  cookingDays: number; // how many days can cook
  prepStyle: 'one-big-prep' | 'daily-cooking';
  timePerDay: number; // minutes
  starRecipe?: Recipe; // Optional: build week around this recipe
  anchorRecipes?: Recipe[]; // Optional: recipes to include in the week
}

// For building weeks from history
export type WeekCreationMode = 'fresh' | 'star-recipe' | 'recreate' | 'resausify' | 'stitch-favorites';

export interface WeekCreationOptions {
  mode: WeekCreationMode;
  sourceWeekId?: string; // for recreate/resausify
  starRecipe?: Recipe; // for star-recipe mode
  anchorRecipes?: Recipe[]; // for stitch-favorites mode
  modifications?: {
    swapProtein?: string;
    swapGrain?: string;
    swapVegetable?: string;
  }; // for resausify mode
}

// User Profile & Onboarding
export interface UserProfile {
  // Basic Info (Onboarding)
  hasCompletedOnboarding: boolean;
  goals: string[]; // 'lose-weight', 'gain-muscle', 'maintain', 'eat-healthy'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very-active' | 'athlete';
  bodyWeight?: number;
  favoriteIngredients: string[];
  favoriteMeals: string[];
  favoriteStores: string[];
  
  // Detailed Settings (Profile Page)
  primaryDietType?: string; // 'omnivore', 'vegetarian', 'vegan', 'pescatarian', etc
  foodExclusions: string[]; // allergies, dislikes
  nutritionTargets?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  budget?: 'low' | 'moderate' | 'flexible';
  kitchenSize?: 'minimal' | 'standard' | 'full';
  cookingLevel?: 'beginner' | 'intermediate' | 'advanced';
  availableUtensils?: string[];
  
  // Meals & Schedule
  mealLayout: 'breakfast-lunch-dinner' | 'two-meals' | 'omad' | 'flexible';
  preferredCookingDays: string[]; // days of week
  typicalPrepTime: number; // minutes per day
}

// Partner Mode - Simplified recipe instructions
export interface PartnerModeStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  duration?: number; // minutes
  tips?: string[];
  visual?: string; // Optional visual cue
}

// Notes feature
export interface RecipeNote {
  id: string;
  recipeId?: string; // Optional: attached to a recipe
  title: string;
  content: string;
  type: 'recipe-note' | 'shopping-note' | 'general';
  createdAt: Date;
  updatedAt: Date;
  sharedWith?: string[]; // user IDs
  contributions?: NoteContribution[];
}

export interface NoteContribution {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}