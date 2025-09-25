import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  getProperties,
  getPropertiesPaginated,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  publishProperty,
  unpublishProperty,
  markAsDraft,
  updatePropertyImages,
} from '@/actions/property-actions';
import {
  PropertyInput,
  PropertyWithImages,
} from '@/validation/property.schema';

// Define the return type for paginated properties - matches what getPropertiesPaginated returns
export type PropertiesPage = {
  data: any[]; // Using any[] to match the actual Prisma return type
  nextCursor: string | undefined;
  hasNextPage: boolean;
};

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
    select: data => data as PropertyWithImages[],
  });
}

export function useInfiniteProperties() {
  return useInfiniteQuery<PropertiesPage, Error>({
    queryKey: ['properties', 'infinite'],
    queryFn: async ({ pageParam }) => {
      const result = await getPropertiesPaginated(
        pageParam as string | undefined
      );
      return result;
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function usePropertyById(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
    select: data => data as PropertyWithImages | null,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PropertyInput }) =>
      updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function usePublishProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUnpublishProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unpublishProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useMarkAsDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdatePropertyImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: { thumbnail?: any; images?: any };
    }) => updatePropertyImages(id, updates),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', data.id] });
    },
  });
}
