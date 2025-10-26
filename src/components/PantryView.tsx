import { useState } from 'react';
import { PantryItem } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Snowflake, 
  Refrigerator, 
  Package, 
  AlertCircle,
  Trash2,
  ArrowRightLeft,
  Plus
} from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ui/context-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

interface PantryViewProps {
  items: PantryItem[];
  onUpdateItem: (id: string, updates: Partial<PantryItem>) => void;
  onDeleteItem: (id: string) => void;
  onClearExpiring: () => void;
}

type StorageFilter = 'all' | 'pantry' | 'fridge' | 'freezer';

export function PantryView({ items, onUpdateItem, onDeleteItem, onClearExpiring }: PantryViewProps) {
  const [storageFilter, setStorageFilter] = useState<StorageFilter>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PantryItem | null>(null);
  const [clearExpiringDialogOpen, setClearExpiringDialogOpen] = useState(false);

  // Get storage icon and color
  const getStorageInfo = (location: PantryItem['storageLocation']) => {
    switch (location) {
      case 'freezer':
        return { icon: Snowflake, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Freezer' };
      case 'fridge':
        return { icon: Refrigerator, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Fridge' };
      case 'pantry':
        return { icon: Package, color: 'text-amber-600', bgColor: 'bg-amber-100', label: 'Pantry' };
    }
  };

  // Calculate days until expiration
  const getDaysUntilExpiration = (expiresAt?: Date) => {
    if (!expiresAt) return null;
    const days = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Filter items
  const filteredItems = items.filter(item => {
    if (storageFilter === 'all') return true;
    return item.storageLocation === storageFilter;
  });

  // Sort items: expiring soon first (for fridge/pantry), then by added date
  const sortedItems = [...filteredItems].sort((a, b) => {
    // Items in freezer don't prioritize expiration
    const aIsFreezeable = a.storageLocation === 'freezer';
    const bIsFreezeable = b.storageLocation === 'freezer';

    if (!aIsFreezeable && !bIsFreezeable) {
      // Both are perishable - sort by expiration
      const aDays = getDaysUntilExpiration(a.expiresAt);
      const bDays = getDaysUntilExpiration(b.expiresAt);
      
      if (aDays !== null && bDays !== null) {
        return aDays - bDays; // Closest expiration first
      }
      if (aDays !== null) return -1;
      if (bDays !== null) return 1;
    }

    // Default: sort by added date (newest first)
    return b.addedAt.getTime() - a.addedAt.getTime();
  });

  // Find expiring items (within 3 days)
  const expiringItems = items.filter(item => {
    if (item.storageLocation === 'freezer') return false;
    const days = getDaysUntilExpiration(item.expiresAt);
    return days !== null && days <= 3;
  });

  const handleMoveStorage = (item: PantryItem, newLocation: PantryItem['storageLocation']) => {
    onUpdateItem(item.id, { storageLocation: newLocation });
    const storageInfo = getStorageInfo(newLocation);
    toast.success(`Moved ${item.name} to ${storageInfo.label}`);
  };

  const handleDeleteClick = (item: PantryItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDeleteItem(itemToDelete.id);
      toast.success(`Deleted ${itemToDelete.name}`);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleClearExpiring = () => {
    setClearExpiringDialogOpen(true);
  };

  const confirmClearExpiring = () => {
    onClearExpiring();
    toast.success(`Cleared ${expiringItems.length} expiring items`);
    setClearExpiringDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2>Pantry Management</h2>
        <p className="text-sm text-gray-600 mt-1">
          Track what you have on hand across storage locations
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Items', count: items.length },
          { key: 'pantry', label: 'Pantry', icon: Package },
          { key: 'fridge', label: 'Fridge', icon: Refrigerator },
          { key: 'freezer', label: 'Freezer', icon: Snowflake },
        ].map((filter) => {
          const count = filter.key === 'all' 
            ? items.length 
            : items.filter(i => i.storageLocation === filter.key).length;
          const Icon = filter.icon;
          
          return (
            <Button
              key={filter.key}
              variant={storageFilter === filter.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStorageFilter(filter.key as StorageFilter)}
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {filter.label}
              <Badge variant="secondary" className="ml-2">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Bulk Actions */}
      {expiringItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{expiringItems.length} items</span> expiring soon
                  </p>
                  <p className="text-xs text-gray-600">
                    Use them in your next meal plan or clear them out
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearExpiring}
                className="border-orange-300 hover:bg-orange-100"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Expiring
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {sortedItems.map((item) => {
          const storageInfo = getStorageInfo(item.storageLocation);
          const StorageIcon = storageInfo.icon;
          const daysUntilExpiration = getDaysUntilExpiration(item.expiresAt);
          const isExpiringSoon = daysUntilExpiration !== null && daysUntilExpiration <= 3;

          return (
            <ContextMenu key={item.id}>
              <ContextMenuTrigger>
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isExpiringSoon ? 'border-orange-300 bg-orange-50' : ''
                  }`}
                >
                  <CardContent className="pt-4 pb-3 px-3">
                    <div className="space-y-2">
                      {/* Storage Badge */}
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={`text-xs ${storageInfo.bgColor} ${storageInfo.color}`}>
                          <StorageIcon className="h-3 w-3 mr-1" />
                          {storageInfo.label}
                        </Badge>
                        {isExpiringSoon && (
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                        )}
                      </div>

                      {/* Item Name */}
                      <h4 className="text-sm capitalize">{item.name}</h4>

                      {/* Quantity */}
                      <p className="text-xs text-gray-600">
                        {item.quantity} {item.unit}
                      </p>

                      {/* Expiration */}
                      {item.storageLocation !== 'freezer' && daysUntilExpiration !== null && (
                        <p className={`text-xs ${
                          isExpiringSoon ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          {daysUntilExpiration === 0 && 'Expires today'}
                          {daysUntilExpiration === 1 && 'Expires tomorrow'}
                          {daysUntilExpiration > 1 && `${daysUntilExpiration} days left`}
                          {daysUntilExpiration < 0 && 'Expired'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              
              <ContextMenuContent className="w-56">
                <div className="px-2 py-1.5 text-xs text-gray-500">
                  Move to...
                </div>
                {(['pantry', 'fridge', 'freezer'] as const).map((location) => {
                  if (location === item.storageLocation) return null;
                  const info = getStorageInfo(location);
                  const Icon = info.icon;
                  return (
                    <ContextMenuItem
                      key={location}
                      onClick={() => handleMoveStorage(item, location)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <ArrowRightLeft className="h-3 w-3 mr-2 text-gray-400" />
                      {info.label}
                    </ContextMenuItem>
                  );
                })}
                <div className="my-1 h-px bg-gray-200" />
                <ContextMenuItem
                  onClick={() => handleDeleteClick(item)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Item
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}

        {/* Add Item Card */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
          <CardContent className="pt-4 pb-3 px-3 flex items-center justify-center h-full min-h-[120px]">
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">Add Item</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {sortedItems.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              No items in {storageFilter === 'all' ? 'pantry' : storageFilter}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {itemToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this item from your pantry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Expiring Confirmation Dialog */}
      <AlertDialog open={clearExpiringDialogOpen} onOpenChange={setClearExpiringDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all expiring items?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {expiringItems.length} items that are expiring soon from your pantry.
              <div className="mt-3 space-y-1">
                {expiringItems.map(item => (
                  <div key={item.id} className="text-sm">
                    • {item.name} ({item.quantity} {item.unit})
                  </div>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearExpiring} className="bg-orange-600 hover:bg-orange-700">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
