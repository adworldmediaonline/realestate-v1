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

export async function createProperty(data: PropertyInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  const validatedData = propertySchema.parse(data);
  const slug = slugify(validatedData.name, { lower: true, strict: true });

  const property = await prisma.property.create({
    data: {
      ...validatedData,
      slug,
      ownerId: validatedData.ownerId || session?.user?.id,
    },
  });

  revalidatePath('/dashboard');
  return property;
}

export async function getProperties() {
  return await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPropertyById(id: string) {
  return await prisma.property.findUnique({
    where: { id },
  });
}

export async function updateProperty(id: string, data: PropertyInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  const validatedData = propertySchema.parse(data);
  const slug = slugify(validatedData.name, { lower: true, strict: true });

  const property = await prisma.property.update({
    where: { id },
    data: {
      ...validatedData,
      slug,
      ownerId: validatedData.ownerId || session?.user?.id,
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
