import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { ShoppingCart, Plus, ExternalLink } from 'lucide-react';
import { ShoppingListItem } from '../types';

export function ShopView() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([
    { id: '1', name: 'chicken breast', quantity: 2, unit: 'lbs', purchased: false, fromRecipe: 'Chicken Pasta' },
    { id: '2', name: 'bell peppers', quantity: 3, unit: 'pieces', purchased: false, fromRecipe: 'Chicken Stir-fry' },
    { id: '3', name: 'vegetable broth', quantity: 1, unit: 'carton', purchased: false, fromRecipe: 'Tomato Soup' },
    { id: '4', name: 'feta cheese', quantity: 1, unit: 'container', purchased: false, fromRecipe: 'Greek Salad' },
  ]);
  const [newItem, setNewItem] = useState('');

  const togglePurchased = (id: string) => {
    setShoppingList(list =>
      list.map(item =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    
    const item: ShoppingListItem = {
      id: Date.now().toString(),
      name: newItem,
      quantity: 1,
      unit: 'item',
      purchased: false,
    };
    
    setShoppingList([...shoppingList, item]);
    setNewItem('');
  };

  const removeItem = (id: string) => {
    setShoppingList(list => list.filter(item => item.id !== id));
  };

  const unpurchasedItems = shoppingList.filter(item => !item.purchased);
  const purchasedItems = shoppingList.filter(item => item.purchased);

  return (
    <div className="space-y-6">
      <div>
        <h2>Shopping List</h2>
        <p className="text-gray-600">Items you need to buy</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping List ({unpurchasedItems.length} items)
          </CardTitle>
          <CardDescription>Generated from your meal plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Item */}
          <div className="flex gap-2">
            <Input
              placeholder="Add item manually..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <Button onClick={addItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Shopping List Items */}
          <div className="space-y-2">
            <h3 className="text-sm">To Buy</h3>
            {unpurchasedItems.length === 0 ? (
              <p className="text-gray-500 text-sm">All items purchased!</p>
            ) : (
              unpurchasedItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 border rounded-lg">
                  <Checkbox
                    checked={item.purchased}
                    onCheckedChange={() => togglePurchased(item.id)}
                  />
                  <div className="flex-1">
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} {item.unit}
                      {item.fromRecipe && ` • from ${item.fromRecipe}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>

          {purchasedItems.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm text-gray-500">Purchased</h3>
              {purchasedItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 border rounded-lg opacity-50">
                  <Checkbox
                    checked={item.purchased}
                    onCheckedChange={() => togglePurchased(item.id)}
                  />
                  <div className="flex-1">
                    <p className="line-through">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Actions */}
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm">Order Options:</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                Instacart
              </Button>
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                Amazon Fresh
              </Button>
            </div>
            <Button className="w-full" disabled>
              Auto-Order (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
