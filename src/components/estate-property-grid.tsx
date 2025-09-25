'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconStar,
  IconHeart,
  IconMapPin,
  IconLoader2,
} from '@tabler/icons-react';
import { PropertyWithImages } from '@/validation/property.schema';
import { useInfiniteProperties, PropertiesPage } from '@/hooks/use-properties';

interface EstatePropertyGridProps {
  selectedProperty?: PropertyWithImages | null;
  onPropertySelect?: (property: PropertyWithImages) => void;
  searchQuery?: string;
  filters?: {
    locations?: string[];
    priceRange?: [number, number];
    landArea?: {
      min: string;
      max: string;
    };
    propertyTypes?: string[];
    amenities?: string[];
  };
}

export function EstatePropertyGrid({
  selectedProperty,
  onPropertySelect,
  searchQuery = '',
  filters = {},
}: EstatePropertyGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteProperties();

  // Flatten all properties from all pages with proper typing
  const allProperties = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: any) => page.data as PropertyWithImages[]);
  }, [data]);

  // Filter and search properties
  const filteredProperties = useMemo(() => {
    if (!allProperties) return [];

    let filtered = allProperties;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (property: PropertyWithImages) =>
          property.name.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.propertyType.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (filters.locations && filters.locations.length > 0) {
      filtered = filtered.filter((property: PropertyWithImages) =>
        filters.locations!.some(location =>
          property.location.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      filtered = filtered.filter(
        (property: PropertyWithImages) =>
          property.price >= minPrice && property.price <= maxPrice
      );
    }

    // Property type filter
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter((property: PropertyWithImages) =>
        filters.propertyTypes!.includes(property.propertyType)
      );
    }

    // Land area filter
    if (filters.landArea && (filters.landArea.min || filters.landArea.max)) {
      filtered = filtered.filter((property: PropertyWithImages) => {
        if (!property.area) return false;

        const minArea = filters.landArea!.min
          ? parseInt(filters.landArea!.min)
          : 0;
        const maxArea = filters.landArea!.max
          ? parseInt(filters.landArea!.max)
          : Infinity;

        return property.area >= minArea && property.area <= maxArea;
      });
    }

    // Amenities filter (using features field)
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter((property: PropertyWithImages) =>
        filters.amenities!.every((amenity: string) =>
          property.features.some((feature: string) =>
            feature.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
    }

    return filtered;
  }, [allProperties, searchQuery, filters]);

  // Infinite scroll with intersection observer
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isFetching, fetchNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleLoadMore]);

  const handleFavoriteToggle = (
    propertyId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const handlePropertyClick = (property: PropertyWithImages) => {
    onPropertySelect?.(property);
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
      case 'house':
        return 'bg-estate-success text-white';
      case 'apartment':
        return 'bg-estate-primary text-white';
      case 'villa':
        return 'bg-estate-warning text-white';
      case 'condo':
      case 'townhouse':
        return 'bg-estate-accent text-white';
      default:
        return 'bg-estate-gray-500 text-white';
    }
  };

  // Loading state with type narrowing
  if (isLoading) {
    return (
      <div className="flex-1 p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="estate-card">
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state with type narrowing
  if (error) {
    return (
      <div className="flex-1 p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-estate-error mb-2">
            Failed to load properties
          </div>
          <div className="text-estate-gray-500 text-sm">
            Please try refreshing the page
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!filteredProperties.length) {
    return (
      <div className="flex-1 p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-estate-gray-500 mb-2">
            {searchQuery ||
            (filters.locations && filters.locations.length > 0) ||
            (filters.propertyTypes && filters.propertyTypes.length > 0) ||
            (filters.amenities && filters.amenities.length > 0) ||
            (filters.landArea &&
              (filters.landArea.min || filters.landArea.max)) ||
            (filters.priceRange &&
              (filters.priceRange[0] > 0 || filters.priceRange[1] < Infinity))
              ? 'No properties match your search criteria'
              : 'No properties available'}
          </div>
          <div className="text-estate-gray-400 text-sm">
            Try adjusting your filters or search terms
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredProperties.map((property: PropertyWithImages) => {
          const isSelected = selectedProperty?.id === property.id;
          const isFavorite = favorites.has(property.id);

          return (
            <Card
              key={property.id}
              className={`estate-card pt-0 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? 'ring-2 ring-estate-primary shadow-lg' : ''
              }`}
              onClick={() => handlePropertyClick(property)}
            >
              <CardContent className="p-0">
                {/* Property Image */}
                <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                  <Image
                    src={property.thumbnail?.url || '/placeholder-property.jpg'}
                    alt={property.thumbnail?.altText || property.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Property Type Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={getPropertyTypeColor(property.propertyType)}
                    >
                      {property.propertyType}
                    </Badge>
                  </div>

                  {/* Favorite Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                    onClick={e => handleFavoriteToggle(property.id, e)}
                    aria-label={
                      isFavorite ? 'Remove from favorites' : 'Add to favorites'
                    }
                  >
                    <IconHeart
                      className={`h-4 w-4 ${
                        isFavorite
                          ? 'fill-estate-error text-estate-error'
                          : 'text-estate-gray-600'
                      }`}
                    />
                  </Button>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-estate-gray-900 mb-1 line-clamp-1">
                    {property.name}
                  </h3>

                  <div className="flex items-center text-estate-gray-600 mb-3">
                    <IconMapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold text-estate-primary">
                      ₹{property.price.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center text-estate-gray-600">
                      <IconStar className="h-4 w-4 fill-estate-warning text-estate-warning mr-1" />
                      <span className="text-sm font-medium">4.9/5</span>
                    </div>
                  </div>

                  {/* Property Features */}
                  <div className="flex items-center justify-between text-sm text-estate-gray-500">
                    <span>{property.bedrooms} Beds</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>
                      {property.area
                        ? `${property.area.toLocaleString()} sqft`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More Button */}
      {filteredProperties.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            className="estate-button-secondary px-8 py-3"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading more...
              </>
            ) : hasNextPage ? (
              'Load More Properties'
            ) : (
              'No more properties to load'
            )}
          </Button>
        </div>
      )}

      {/* Background fetching indicator */}
      {isFetching && !isFetchingNextPage && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center text-estate-gray-500 text-sm">
            <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
            Updating properties...
          </div>
        </div>
      )}

      {/* Intersection observer trigger for infinite scroll */}
      {hasNextPage && <div ref={loadMoreRef} className="h-4 w-full" />}
    </div>
  );
}
