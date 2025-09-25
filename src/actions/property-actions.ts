'use server';

import {
  propertySchema,
  type PropertyInput,
} from '@/validation/property.schema';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import slugify from 'slugify';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface ImageData {
  publicId: string;
  url: string;
  altText?: string;
}

export async function createProperty(data: PropertyInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  const validatedData = propertySchema.parse(data);
  const slug = slugify(validatedData.name, { lower: true, strict: true });

  const { mainImage, additionalImages, ...restData } = validatedData;

  const property = await prisma.property.create({
    data: {
      ...restData,
      slug,
      ownerId: validatedData.ownerId || session?.user?.id,
      thumbnail: mainImage ? JSON.stringify(mainImage) : Prisma.JsonNull,
      images: additionalImages
        ? JSON.stringify(additionalImages)
        : Prisma.JsonNull,
    },
  });

  revalidatePath('/dashboard');
  return property;
}

export async function getProperties() {
  const properties = await prisma.property.findMany({
    where: { status: 'PUBLISHED' as const },
    orderBy: { createdAt: 'desc' },
  });

  return properties.map(property => ({
    ...property,
    thumbnail: property.thumbnail
      ? (JSON.parse(
          property.thumbnail as string
        ) as unknown as ImageData | null)
      : Prisma.JsonNull,
    images: property.images
      ? (JSON.parse(property.images as string) as unknown as ImageData[])
      : [],
  }));
}

export async function getPropertiesPaginated(cursor?: string, limit: number = 12) {
  const whereClause = cursor 
    ? { 
        id: { lt: cursor },
        status: 'PUBLISHED' as const
      }
    : { status: 'PUBLISHED' as const };

  const properties = await prisma.property.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: limit + 1, // Take one extra to check if there are more
  });

  const hasNextPage = properties.length > limit;
  const data = hasNextPage ? properties.slice(0, limit) : properties;
  const nextCursor = hasNextPage ? data[data.length - 1]?.id : undefined;

  const formattedProperties = data.map(property => ({
    ...property,
    thumbnail: property.thumbnail
      ? (JSON.parse(
          property.thumbnail as string
        ) as unknown as ImageData | null)
      : Prisma.JsonNull,
    images: property.images
      ? (JSON.parse(property.images as string) as unknown as ImageData[])
      : [],
  }));

  return {
    data: formattedProperties,
    nextCursor,
    hasNextPage,
  };
}

export async function getPropertyById(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (property) {
    return {
      ...property,
      thumbnail: property.thumbnail
        ? (JSON.parse(
            property.thumbnail as string
          ) as unknown as ImageData | null)
        : Prisma.JsonNull,
      images: property.images
        ? (JSON.parse(property.images as string) as unknown as ImageData[])
        : [],
    };
  }

  return property;
}

export async function updateProperty(id: string, data: PropertyInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  const validatedData = propertySchema.parse(data);
  const slug = slugify(validatedData.name, { lower: true, strict: true });

  const { mainImage, additionalImages, ...restData } = validatedData;

  const property = await prisma.property.update({
    where: { id },
    data: {
      ...restData,
      slug,
      ownerId: validatedData.ownerId || session?.user?.id,
      thumbnail: mainImage ? JSON.stringify(mainImage) : Prisma.JsonNull,
      images: additionalImages
        ? JSON.stringify(additionalImages)
        : Prisma.JsonNull,
    },
  });

  revalidatePath('/dashboard');
  return property;
}

export async function deleteProperty(id: string) {
  await prisma.property.delete({
    where: { id },
  });

  revalidatePath('/dashboard');
}

export async function updatePropertyImages(
  id: string,
  updates: { thumbnail?: ImageData | null; images?: ImageData[] }
) {
  const property = await prisma.property.update({
    where: { id },
    data: {
      thumbnail: updates.thumbnail
        ? JSON.stringify(updates.thumbnail)
        : Prisma.JsonNull,
      images: updates.images ? JSON.stringify(updates.images) : Prisma.JsonNull,
    },
  });

  revalidatePath('/dashboard');
  return property;
}

export async function publishProperty(id: string) {
  const property = await prisma.property.update({
    where: { id },
    data: { status: 'PUBLISHED' },
  });

  revalidatePath('/dashboard');
  return property;
}

export async function unpublishProperty(id: string) {
  const property = await prisma.property.update({
    where: { id },
    data: { status: 'UNPUBLISHED' },
  });

  revalidatePath('/dashboard');
  return property;
}

export async function markAsDraft(id: string) {
  const property = await prisma.property.update({
    where: { id },
    data: { status: 'DRAFT' },
  });

  revalidatePath('/dashboard');
  return property;
}
