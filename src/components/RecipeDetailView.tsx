import { Recipe, PartnerModeStep } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  UtensilsCrossed, 
  ChefHat, 
  Share2,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
}

export function RecipeDetailView({ recipe, onBack }: RecipeDetailViewProps) {

  // Generate simplified partner mode steps from recipe instructions
  const generatePartnerModeSteps = (recipe: Recipe): PartnerModeStep[] => {
    const steps: PartnerModeStep[] = [];
    
    // Prep step
    steps.push({
      id: 'prep',
      stepNumber: 1,
      title: '🔪 Prep Your Ingredients',
      description: `Gather all ingredients: ${recipe.ingredients.slice(0, 5).join(', ')}${recipe.ingredients.length > 5 ? '...' : ''}`,
      duration: 5,
      tips: [
        'Read through ALL steps before starting',
        'Measure everything out (mise en place)',
        'Set out all your tools'
      ]
    });

    // Convert recipe instructions to simplified steps
    recipe.instructions.forEach((instruction, idx) => {
      steps.push({
        id: `step-${idx}`,
        stepNumber: idx + 2,
        title: `Step ${idx + 2}`,
        description: instruction,
        duration: Math.ceil(recipe.cookTime / recipe.instructions.length),
        tips: []
      });
    });

    // Final step
    steps.push({
      id: 'final',
      stepNumber: steps.length + 1,
      title: '✨ Plate & Serve',
      description: 'Plate your dish beautifully and serve immediately for best results.',
      tips: [
        'Taste and adjust seasoning if needed',
        'Garnish if desired',
        'Enjoy your creation!'
      ]
    });

    return steps;
  };

  const partnerModeSteps = generatePartnerModeSteps(recipe);

  const handleShare = () => {
    // Generate a shareable version with all the partner mode details
    const shareText = `${recipe.name}\n\n${partnerModeSteps.map(step => 
      `${step.stepNumber}. ${step.title}\n${step.description}${step.tips && step.tips.length > 0 ? '\n💡 ' + step.tips.join('\n💡 ') : ''}${step.duration ? `\n⏱️ ~${step.duration} min` : ''}`
    ).join('\n\n')}`;

    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: shareText,
      }).then(() => {
        toast.success('Recipe shared successfully!');
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        toast.success('Recipe copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Recipe copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cook
          </Button>
          <h2>{recipe.name}</h2>
          <p className="text-gray-600">{recipe.cuisine || 'Delicious Recipe'}</p>
        </div>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Cook Time</p>
            <p>{recipe.cookTime} minutes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Servings</p>
            <p>{recipe.servings}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Complexity</p>
            <Badge variant={recipe.prepComplexity === 'quick' ? 'default' : 'secondary'}>
              {recipe.prepComplexity || 'moderate'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Meal Framework */}
      {(recipe.protein || recipe.grain || recipe.vegetable) && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm mb-2">Meal Framework</p>
            <div className="flex flex-wrap gap-2">
              {recipe.protein && (
                <Badge variant="outline" className="bg-red-50">
                  🥩 Protein: {recipe.protein}
                </Badge>
              )}
              {recipe.grain && (
                <Badge variant="outline" className="bg-yellow-50">
                  🌾 Grain: {recipe.grain}
                </Badge>
              )}
              {recipe.vegetable && (
                <Badge variant="outline" className="bg-green-50">
                  🥬 Vegetable: {recipe.vegetable}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}



      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
          <CardDescription>Everything you'll need</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recipe.ingredients.map((ingredient, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 border rounded">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="capitalize">{ingredient}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions - Enhanced Partner Mode Style */}
      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Instructions</CardTitle>
          <CardDescription>Detailed guide for cooking success</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {partnerModeSteps.map((step) => (
              <div 
                key={step.id} 
                className="border-l-4 border-purple-300 pl-4"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700 shrink-0">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{step.title}</h4>
                      {step.duration && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          ~{step.duration} min
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{step.description}</p>
                    
                    {step.tips && step.tips.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm">Pro Tips</span>
                        </div>
                        {step.tips.map((tip, idx) => (
                          <p key={idx} className="text-sm text-gray-600 ml-6">• {tip}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
