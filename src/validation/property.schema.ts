import { z } from 'zod';

const imageDataSchema = z.object({
  publicId: z.string().min(1, 'Public ID is required'),
  url: z.url('Invalid image URL'),
  altText: z.string().optional(),
});

export const propertySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  price: z.number().positive('Price must be positive'),
  location: z.string().min(1, 'Location is required'),
  address: z.string().optional(),
  bedrooms: z.number().min(0, 'Bedrooms must be non-negative'),
  bathrooms: z.number().min(0, 'Bathrooms must be non-negative'),
  area: z.number().positive('Area must be positive').optional(),
  features: z.array(z.string()),
  status: z.enum(['DRAFT', 'PUBLISHED', 'UNPUBLISHED']),
  ownerId: z.string().optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
  mainImage: imageDataSchema.optional(),
  additionalImages: z.array(imageDataSchema).optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;
