'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  propertySchema,
  type PropertyInput,
} from '@/validation/property.schema';
import { useCreateProperty, useUpdateProperty } from '@/hooks/use-properties';
import { Property } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { ImageUpload } from './image-upload';

interface ImageData {
  publicId: string;
  url: string;
  altText?: string;
}

type PropertyFormProps = {
  property?: Property;
  onSuccess: () => void;
};

export function PropertyForm({ property, onSuccess }: PropertyFormProps) {
  const isEditing = !!property;
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const { data: session } = authClient.useSession();

  const form = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: property?.name || '',
      description: property?.description || '',
      propertyType: property?.propertyType || 'house',
      price: property?.price || 0,
      location: property?.location || '',
      address: property?.address || '',
      bedrooms: property?.bedrooms ?? 0,
      bathrooms: property?.bathrooms ?? 0,
      area: property?.area || 0,
      features: property?.features ?? [],
      status: property?.status || 'DRAFT',
      ownerId: session?.user?.id || '',
      mainImage:
        (property?.thumbnail as unknown as ImageData | null) || undefined,
      additionalImages: (property?.images as unknown as ImageData[]) || [],
    },
  });

  const onSubmit = async (data: PropertyInput) => {
    try {
      if (isEditing && property) {
        await updateMutation.mutateAsync({ id: property.id, data });
        toast.success('Property updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Property created successfully');
      }
      onSuccess();
      form.reset();
    } catch (error) {
      toast.error(
        isEditing ? 'Failed to update property' : 'Failed to create property'
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Property name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Property description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Price"
                  {...field}
                  onChange={e => {
                    const value = parseFloat(e.target.value);
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Property location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Property address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Number of bedrooms"
                  {...field}
                  onChange={e => {
                    const value = parseInt(e.target.value);
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Number of bathrooms"
                  {...field}
                  onChange={e => {
                    const value = parseInt(e.target.value);
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area (sq ft)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Area in square feet"
                  {...field}
                  onChange={e => {
                    const value = e.target.value;
                    field.onChange(value ? parseFloat(value) : undefined);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Pool, Garage, Garden"
                  {...field}
                  onChange={e => {
                    const value = e.target.value;
                    field.onChange(
                      value ? value.split(',').map(s => s.trim()) : []
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Main Image Upload */}
        <FormField
          control={form.control}
          name="mainImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Image</FormLabel>
              <FormControl>
                <ImageUpload
                  variant="single"
                  value={field.value}
                  onChange={field.onChange}
                  maxFileSize={5 * 1024 * 1024} // 5MB
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional Images Upload */}
        <FormField
          control={form.control}
          name="additionalImages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Images</FormLabel>
              <FormControl>
                <ImageUpload
                  variant="multiple"
                  limit={10}
                  value={field.value || []}
                  onChange={field.onChange}
                  maxFileSize={5 * 1024 * 1024} // 5MB
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {isEditing ? 'Update Property' : 'Create Property'}
        </Button>
      </form>
    </Form>
  );
}
