'use client';

import { useState } from 'react';
import { PropertyTable } from '@/components/property-table';
import { PropertyForm } from '@/components/property-form';
import { DeletePropertyDialog } from '@/components/delete-property-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IconPlus } from '@tabler/icons-react';
import { PropertyWithImages } from '@/validation/property.schema';

export function PropertyManagement() {
  const [editingProperty, setEditingProperty] =
    useState<PropertyWithImages | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (property: PropertyWithImages) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingProperty(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Property Management</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProperty(null)}>
              <IconPlus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProperty ? 'Edit Property' : 'Create New Property'}
              </DialogTitle>
            </DialogHeader>
            <PropertyForm
              property={editingProperty || undefined}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
      <PropertyTable onEdit={handleEdit} />
    </div>
  );
}
