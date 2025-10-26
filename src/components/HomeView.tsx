import { Button } from './ui/button';
import { Calendar, ShoppingCart, ChefHat } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl">Welcome to Meal Planner</h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Plan your meals, shop smarter, and cook with what you have
          </p>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-3 max-w-4xl mx-auto">
            <Button
              variant="outline"
              className="flex-1 h-auto py-6 flex items-center justify-center gap-3 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={() => onNavigate('plan')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div>Plan</div>
                  <div className="text-xs text-gray-500">Your Week</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex-1 h-auto py-6 flex items-center justify-center gap-3 hover:bg-green-50 hover:border-green-300 transition-colors"
              onClick={() => onNavigate('shop')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <div>Shop</div>
                  <div className="text-xs text-gray-500">What You Need</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex-1 h-auto py-6 flex items-center justify-center gap-3 hover:bg-orange-50 hover:border-orange-300 transition-colors"
              onClick={() => onNavigate('cook')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <ChefHat className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-left">
                  <div>View Recipes</div>
                  <div className="text-xs text-gray-500">What You Have</div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
