import { useState } from 'react';
import { WeekPlan, Recipe } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Copy, Shuffle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface WeekHistoryProps {
  weeks: Array<{ plan: WeekPlan; recipes: Recipe[] }>;
  onRecreate: (weekId: string) => void;
  onResausify: (weekId: string, modifications: any) => void;
}

export function WeekHistory({ weeks, onRecreate, onResausify }: WeekHistoryProps) {
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [showResausify, setShowResausify] = useState(false);
  const [modifications, setModifications] = useState({
    swapProtein: '',
    swapGrain: '',
    swapVegetable: '',
  });

  const handleResausify = () => {
    if (selectedWeek) {
      onResausify(selectedWeek, modifications);
      setShowResausify(false);
    }
  };

  if (weeks.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h3>Past Weeks</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Recreate a successful week or resausify it with different ingredients
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeks.map(({ plan, recipes }) => (
            <Card key={plan.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500">
                      Week of {new Date(plan.weekOf).toLocaleDateString()}
                    </p>
                    <Badge variant="secondary">{plan.meals.length} meals</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recipes.slice(0, 3).map((recipe) => (
                      <Badge key={recipe.id} variant="outline" className="text-xs">
                        {recipe.name}
                      </Badge>
                    ))}
                    {recipes.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{recipes.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Shared Ingredients */}
                {plan.sharedIngredients.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Shared ingredients:</p>
                    <div className="flex flex-wrap gap-1">
                      {plan.sharedIngredients.map((ingredient) => (
                        <Badge key={ingredient} variant="secondary" className="text-xs bg-green-50">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRecreate(plan.id)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Recreate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedWeek(plan.id);
                      setShowResausify(true);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Shuffle className="h-3 w-3" />
                    Resausify
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Resausify Dialog */}
      <Dialog open={showResausify} onOpenChange={setShowResausify}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resausify This Week</DialogTitle>
            <DialogDescription>
              Swap proteins, grains, or vegetables to give this week a new feel
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Swap Protein</Label>
              <Select
                value={modifications.swapProtein}
                onValueChange={(value) =>
                  setModifications({ ...modifications, swapProtein: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Keep current proteins" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chicken">Chicken</SelectItem>
                  <SelectItem value="beef">Beef</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="tofu">Tofu</SelectItem>
                  <SelectItem value="pork">Pork</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Swap Grain</Label>
              <Select
                value={modifications.swapGrain}
                onValueChange={(value) =>
                  setModifications({ ...modifications, swapGrain: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Keep current grains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="pasta">Pasta</SelectItem>
                  <SelectItem value="quinoa">Quinoa</SelectItem>
                  <SelectItem value="bread">Bread</SelectItem>
                  <SelectItem value="tortillas">Tortillas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Swap Vegetable</Label>
              <Select
                value={modifications.swapVegetable}
                onValueChange={(value) =>
                  setModifications({ ...modifications, swapVegetable: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Keep current vegetables" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="broccoli">Broccoli</SelectItem>
                  <SelectItem value="peppers">Bell Peppers</SelectItem>
                  <SelectItem value="spinach">Spinach</SelectItem>
                  <SelectItem value="carrots">Carrots</SelectItem>
                  <SelectItem value="zucchini">Zucchini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowResausify(false)}>
              Cancel
            </Button>
            <Button onClick={handleResausify}>Generate Resausified Week</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
