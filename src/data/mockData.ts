import { Recipe, PantryItem, WeekPlan } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Chicken Pasta',
    cookTime: 30,
    servings: 4,
    calories: 450,
    ingredients: ['chicken breast', 'pasta', 'tomatoes', 'garlic', 'olive oil'],
    mainIngredients: ['chicken breast', 'pasta', 'tomatoes'],
    instructions: [
      'Cook pasta according to package directions',
      'Sauté chicken in olive oil until cooked through',
      'Add tomatoes and garlic, cook 5 minutes',
      'Toss with pasta and serve'
    ],
    tags: ['quick', 'dinner', 'protein'],
    prepComplexity: 'quick',
    protein: 'Chicken',
    grain: 'Pasta',
    vegetable: 'Tomatoes',
  },
  {
    id: '2',
    name: 'Tomato Soup',
    cookTime: 25,
    servings: 4,
    calories: 180,
    ingredients: ['tomatoes', 'onion', 'garlic', 'vegetable broth', 'cream'],
    mainIngredients: ['tomatoes', 'onion', 'garlic'],
    instructions: [
      'Sauté onions and garlic',
      'Add tomatoes and broth, simmer 15 minutes',
      'Blend until smooth',
      'Stir in cream and serve'
    ],
    tags: ['soup', 'vegetarian', 'comfort'],
    prepComplexity: 'prep',
    protein: 'Cream',
    vegetable: 'Tomatoes',
  },
  {
    id: '3',
    name: 'Chicken Stir-fry',
    cookTime: 20,
    servings: 4,
    calories: 380,
    ingredients: ['chicken breast', 'bell peppers', 'broccoli', 'soy sauce', 'garlic'],
    mainIngredients: ['chicken breast', 'bell peppers', 'broccoli'],
    instructions: [
      'Cut chicken and vegetables into bite-sized pieces',
      'Stir-fry chicken until cooked',
      'Add vegetables and cook 5 minutes',
      'Add soy sauce and garlic, toss and serve'
    ],
    tags: ['quick', 'healthy', 'dinner'],
    prepComplexity: 'quick',
    protein: 'Chicken',
    grain: 'Rice',
    vegetable: 'Bell Peppers',
  },
  {
    id: '4',
    name: 'Greek Salad',
    cookTime: 10,
    servings: 2,
    calories: 220,
    ingredients: ['cucumber', 'tomatoes', 'feta cheese', 'olives', 'olive oil'],
    mainIngredients: ['cucumber', 'tomatoes', 'feta cheese'],
    instructions: [
      'Chop cucumber and tomatoes',
      'Add olives and feta cheese',
      'Drizzle with olive oil',
      'Toss and serve'
    ],
    tags: ['salad', 'vegetarian', 'quick'],
    prepComplexity: 'quick',
    protein: 'Feta',
    vegetable: 'Cucumber',
  },
];

export const mockPantryItems: PantryItem[] = [
  {
    id: '1',
    name: 'chicken breast',
    quantity: 2,
    unit: 'lbs',
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
    category: 'protein',
    storageLocation: 'fridge',
    addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'pasta',
    quantity: 1,
    unit: 'box',
    category: 'grain',
    storageLocation: 'pantry',
    addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'tomatoes',
    quantity: 5,
    unit: 'pieces',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    category: 'vegetable',
    storageLocation: 'fridge',
    addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    name: 'garlic',
    quantity: 1,
    unit: 'bulb',
    category: 'vegetable',
    storageLocation: 'pantry',
    addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    name: 'olive oil',
    quantity: 1,
    unit: 'bottle',
    category: 'pantry',
    storageLocation: 'pantry',
    addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: '6',
    name: 'ground beef',
    quantity: 3,
    unit: 'lbs',
    category: 'protein',
    storageLocation: 'freezer',
    addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: '7',
    name: 'spinach',
    quantity: 1,
    unit: 'bag',
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    category: 'vegetable',
    storageLocation: 'fridge',
    addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '8',
    name: 'rice',
    quantity: 5,
    unit: 'lbs',
    category: 'grain',
    storageLocation: 'pantry',
    addedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
];

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'] as const;

// Mock favorite recipes
export const mockFavoriteRecipes: Recipe[] = [
  {
    id: 'fav-1',
    name: 'Chicken Pasta',
    cookTime: 30,
    servings: 4,
    calories: 450,
    ingredients: ['chicken breast', 'pasta', 'tomatoes', 'garlic', 'olive oil', 'basil', 'parmesan'],
    mainIngredients: ['chicken breast', 'pasta', 'tomatoes'],
    instructions: [
      'Cook pasta according to package directions',
      'Sauté chicken in olive oil until cooked through',
      'Add tomatoes and garlic, cook 5 minutes',
      'Toss with pasta, basil, and parmesan'
    ],
    tags: ['quick', 'dinner', 'italian'],
    cuisine: 'Italian',
    prepComplexity: 'quick',
    isFavorite: true,
    protein: 'Chicken',
    grain: 'Pasta',
    vegetable: 'Tomatoes',
  },
  {
    id: 'fav-2',
    name: 'Tomato Soup',
    cookTime: 25,
    servings: 4,
    calories: 180,
    ingredients: ['tomatoes', 'onion', 'garlic', 'vegetable broth', 'cream', 'basil'],
    mainIngredients: ['tomatoes', 'onion', 'garlic'],
    instructions: [
      'Sauté onions and garlic',
      'Add tomatoes and broth, simmer 15 minutes',
      'Blend until smooth',
      'Stir in cream and basil'
    ],
    tags: ['soup', 'vegetarian', 'comfort'],
    cuisine: 'American',
    prepComplexity: 'prep',
    isFavorite: true,
    protein: 'Cream',
    grain: null,
    vegetable: 'Tomatoes',
  },
  {
    id: 'fav-3',
    name: 'Chicken Stir-fry',
    cookTime: 20,
    servings: 4,
    calories: 380,
    ingredients: ['chicken breast', 'bell peppers', 'broccoli', 'soy sauce', 'garlic', 'ginger', 'rice'],
    mainIngredients: ['chicken breast', 'bell peppers', 'broccoli'],
    instructions: [
      'Cut chicken and vegetables into bite-sized pieces',
      'Stir-fry chicken until cooked',
      'Add vegetables and cook 5 minutes',
      'Add soy sauce, garlic, and ginger, toss and serve over rice'
    ],
    tags: ['quick', 'healthy', 'dinner', 'asian'],
    cuisine: 'Asian',
    prepComplexity: 'quick',
    isFavorite: true,
    protein: 'Chicken',
    grain: 'Rice',
    vegetable: 'Bell Peppers',
  },
];

// Mock week history
export const mockWeekHistory: WeekPlan[] = [
  {
    id: 'week-1',
    weekOf: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
    meals: [
      { id: 'm1', recipeId: 'fav-1', day: 'Monday', mealType: 'dinner' },
      { id: 'm2', recipeId: 'fav-3', day: 'Tuesday', mealType: 'dinner' },
      { id: 'm3', recipeId: 'fav-2', day: 'Wednesday', mealType: 'lunch' },
      { id: 'm4', recipeId: 'fav-1', day: 'Thursday', mealType: 'dinner' },
      { id: 'm5', recipeId: 'fav-3', day: 'Friday', mealType: 'dinner' },
    ],
    sharedIngredients: ['chicken breast', 'tomatoes', 'garlic'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'week-2',
    weekOf: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // Two weeks ago
    meals: [
      { id: 'm6', recipeId: 'fav-2', day: 'Monday', mealType: 'lunch' },
      { id: 'm7', recipeId: 'fav-3', day: 'Tuesday', mealType: 'dinner' },
      { id: 'm8', recipeId: 'fav-1', day: 'Wednesday', mealType: 'dinner' },
      { id: 'm9', recipeId: 'fav-2', day: 'Thursday', mealType: 'lunch' },
    ],
    sharedIngredients: ['tomatoes', 'garlic', 'onion'],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
];