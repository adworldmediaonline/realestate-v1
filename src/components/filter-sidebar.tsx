'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  IconX,
  IconMapPin,
  IconCurrencyDollar,
  IconRuler,
  IconHome,
  IconTree,
  IconBarbell,
  IconCar,
} from '@tabler/icons-react';
import { useProperties } from '@/hooks/use-properties';

interface FilterState {
  locations: string[];
  priceRange: [number, number];
  landArea: {
    min: string;
    max: string;
  };
  propertyTypes: string[];
  amenities: string[];
}

const initialFilters: FilterState = {
  locations: [],
  priceRange: [0, 100000],
  landArea: {
    min: '',
    max: '',
  },
  propertyTypes: [],
  amenities: [],
};

// Scalable amenity options - can be easily extended
const amenityOptions = [
  { id: 'garden', label: 'Garden', icon: IconTree },
  { id: 'gym', label: 'Gym', icon: IconBarbell },
  { id: 'garage', label: 'Garage', icon: IconCar },
  { id: 'pool', label: 'Pool', icon: IconTree },
  { id: 'parking', label: 'Parking', icon: IconCar },
  { id: 'balcony', label: 'Balcony', icon: IconTree },
  { id: 'elevator', label: 'Elevator', icon: IconBarbell },
  { id: 'security', label: 'Security', icon: IconCar },
];

interface FilterSidebarProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export function FilterSidebar({ onFiltersChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(initialFilters);
  const { data: properties } = useProperties();

  // Dynamically generate filter options from real data
  const filterOptions = useMemo((): {
    locations: string[];
    propertyTypes: string[];
    priceRange: [number, number];
    areaRange: [number, number];
  } => {
    if (!properties) {
      return {
        locations: [],
        propertyTypes: [],
        priceRange: [0, 100000],
        areaRange: [0, 10000],
      };
    }

    const publishedProperties = properties.filter(
      p => p.status === 'PUBLISHED'
    );

    // Extract unique locations
    const locations = Array.from(
      new Set(publishedProperties.map(p => p.location))
    ).sort();

    // Extract unique property types
    const propertyTypes = Array.from(
      new Set(publishedProperties.map(p => p.propertyType))
    ).sort();

    // Calculate price range
    const prices = publishedProperties.map(p => p.price);
    const priceRange: [number, number] =
      prices.length > 0
        ? ([Math.min(...prices), Math.max(...prices)] as [number, number])
        : [0, 100000];

    // Calculate area range
    const areas = publishedProperties
      .map(p => p.area)
      .filter((area): area is number => area !== null && area !== undefined);
    const areaRange: [number, number] =
      areas.length > 0
        ? ([Math.min(...areas), Math.max(...areas)] as [number, number])
        : [0, 10000];

    return {
      locations,
      propertyTypes,
      priceRange,
      areaRange,
    };
  }, [properties]);

  // Initialize filters with real data when available
  useMemo(() => {
    if (
      filterOptions.priceRange[0] !== 0 ||
      filterOptions.priceRange[1] !== 100000
    ) {
      setFilters(prev => ({
        ...prev,
        priceRange: filterOptions.priceRange,
      }));
      setAppliedFilters(prev => ({
        ...prev,
        priceRange: filterOptions.priceRange,
      }));
    }
  }, [filterOptions.priceRange]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    onFiltersChange?.(filters);
  };

  const hasActiveFilters = () => {
    return (
      filters.locations.length > 0 ||
      filters.propertyTypes.length > 0 ||
      filters.amenities.length > 0 ||
      filters.landArea.min !== '' ||
      filters.landArea.max !== '' ||
      filters.priceRange[0] !== filterOptions.priceRange[0] ||
      filters.priceRange[1] !== filterOptions.priceRange[1]
    );
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location];
    updateFilters({ locations: newLocations });
  };

  const handlePropertyTypeToggle = (type: string) => {
    const newPropertyTypes = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter(t => t !== type)
      : [...filters.propertyTypes, type];
    updateFilters({ propertyTypes: newPropertyTypes });
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilters({ amenities: newAmenities });
  };

  const handlePriceRangeChange = (value: number[]) => {
    if (
      value.length === 2 &&
      value[0] !== undefined &&
      value[1] !== undefined
    ) {
      const [min, max] = value;
      // Ensure min <= max and values are within bounds
      const clampedMin = Math.max(min, filterOptions.priceRange[0]);
      const clampedMax = Math.min(max, filterOptions.priceRange[1]);

      if (clampedMin <= clampedMax) {
        updateFilters({ priceRange: [clampedMin, clampedMax] });
      }
    }
  };

  const handleLandAreaChange = (field: 'min' | 'max', value: string) => {
    // Only allow numbers and empty string
    const numericValue = value.replace(/[^0-9]/g, '');

    setFilters(prev => ({
      ...prev,
      landArea: {
        ...prev.landArea,
        [field]: numericValue,
      },
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      locations: [],
      priceRange: filterOptions.priceRange,
      landArea: { min: '', max: '' },
      propertyTypes: [],
      amenities: [],
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const removeLocationFilter = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l !== location),
    }));
  };

  const removePropertyTypeFilter = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.filter(t => t !== type),
    }));
  };

  const removeAmenityFilter = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity),
    }));
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full lg:w-80 bg-white border-r border-estate-gray-200 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto estate-scrollbar p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-estate-gray-900">
            Custom Filter
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-estate-primary hover:text-estate-primary-dark"
          >
            Clear all
          </Button>
        </div>

        {/* Location Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-estate-gray-700 flex items-center">
              <IconMapPin className="mr-2 h-4 w-4" />
              Location
            </Label>
            {filters.locations.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, locations: [] }))}
                className="h-6 w-6 p-0"
              >
                <IconX className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto estate-scrollbar">
            {filterOptions.locations.map(location => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={() => handleLocationToggle(location)}
                />
                <Label
                  htmlFor={`location-${location}`}
                  className="text-sm text-estate-gray-600 cursor-pointer"
                >
                  {location}
                </Label>
              </div>
            ))}
            {filterOptions.locations.length === 0 && (
              <div className="text-sm text-estate-gray-400 italic">
                No locations available
              </div>
            )}
          </div>
          {/* Active Location Filters */}
          {filters.locations.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.locations.map(location => (
                <Badge
                  key={location}
                  variant="secondary"
                  className="bg-estate-primary/10 text-estate-primary border-estate-primary/20"
                >
                  {location}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLocationFilter(location)}
                    className="ml-1 h-4 w-4 p-0 hover:bg-estate-primary/20"
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-estate-gray-700 flex items-center">
              <IconCurrencyDollar className="mr-2 h-4 w-4" />
              Price Range
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  priceRange: filterOptions.priceRange,
                }))
              }
              className="h-6 w-6 p-0"
            >
              <IconX className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-3">
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={filterOptions.priceRange[1]}
                min={filterOptions.priceRange[0]}
                step={Math.max(
                  1000,
                  Math.floor(
                    (filterOptions.priceRange[1] -
                      filterOptions.priceRange[0]) /
                      50
                  )
                )}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-estate-gray-500 mt-2">
                <span className="font-medium text-estate-primary">
                  {formatPrice(filters.priceRange[0])}
                </span>
                <span className="font-medium text-estate-primary">
                  {formatPrice(filters.priceRange[1])}
                </span>
              </div>
              <div className="text-center text-xs text-estate-gray-400 mt-1">
                Available: {formatPrice(filterOptions.priceRange[0])} -{' '}
                {formatPrice(filterOptions.priceRange[1])}
              </div>
              {filterOptions.priceRange[0] === filterOptions.priceRange[1] && (
                <div className="text-center text-xs text-estate-warning mt-1">
                  Only one price point available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Land Area Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-estate-gray-700 flex items-center">
              <IconRuler className="mr-2 h-4 w-4" />
              Land Area
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  landArea: { min: '', max: '' },
                }))
              }
              className="h-6 w-6 p-0"
            >
              <IconX className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label
                htmlFor="land-area-min"
                className="text-xs text-estate-gray-500"
              >
                Min
              </Label>
              <Input
                id="land-area-min"
                type="number"
                placeholder="0"
                value={filters.landArea.min}
                onChange={e => handleLandAreaChange('min', e.target.value)}
                className="mt-1"
                min="0"
              />
            </div>
            <div>
              <Label
                htmlFor="land-area-max"
                className="text-xs text-estate-gray-500"
              >
                Max
              </Label>
              <Input
                id="land-area-max"
                type="number"
                placeholder="∞"
                value={filters.landArea.max}
                onChange={e => handleLandAreaChange('max', e.target.value)}
                className="mt-1"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Property Type Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-estate-gray-700 flex items-center">
              <IconHome className="mr-2 h-4 w-4" />
              Type Of Place
            </Label>
            {filters.propertyTypes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFilters(prev => ({ ...prev, propertyTypes: [] }))
                }
                className="h-6 w-6 p-0"
              >
                <IconX className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {filterOptions.propertyTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.propertyTypes.includes(type)}
                  onCheckedChange={() => handlePropertyTypeToggle(type)}
                />
                <Label
                  htmlFor={`type-${type}`}
                  className="text-sm text-estate-gray-600 cursor-pointer capitalize"
                >
                  {type}
                </Label>
              </div>
            ))}
            {filterOptions.propertyTypes.length === 0 && (
              <div className="text-sm text-estate-gray-400 italic">
                No property types available
              </div>
            )}
          </div>
          {/* Active Property Type Filters */}
          {filters.propertyTypes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.propertyTypes.map(type => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="bg-estate-primary/10 text-estate-primary border-estate-primary/20"
                >
                  {type}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePropertyTypeFilter(type)}
                    className="ml-1 h-4 w-4 p-0 hover:bg-estate-primary/20"
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Amenities Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-estate-gray-700">
              Amenities
            </Label>
            {filters.amenities.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, amenities: [] }))}
                className="h-6 w-6 p-0"
              >
                <IconX className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map(amenity => {
              const IconComponent = amenity.icon;
              const isSelected = filters.amenities.includes(amenity.id);
              return (
                <Button
                  key={amenity.id}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAmenityToggle(amenity.id)}
                  className={`flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-estate-primary text-white border-estate-primary'
                      : 'bg-white text-estate-gray-600 border-estate-gray-300 hover:bg-estate-gray-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{amenity.label}</span>
                </Button>
              );
            })}
          </div>
          {/* Active Amenity Filters */}
          {filters.amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.amenities.map(amenityId => {
                const amenity = amenityOptions.find(a => a.id === amenityId);
                if (!amenity) return null;
                return (
                  <Badge
                    key={amenityId}
                    variant="secondary"
                    className="bg-estate-primary/10 text-estate-primary border-estate-primary/20"
                  >
                    {amenity.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAmenityFilter(amenityId)}
                      className="ml-1 h-4 w-4 p-0 hover:bg-estate-primary/20"
                    >
                      <IconX className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Apply Filter Button - Fixed at bottom */}
      <div className="bg-white border-t border-estate-gray-200 p-6">
        <Button
          onClick={applyFilters}
          disabled={!hasActiveFilters()}
          className="w-full bg-estate-primary hover:bg-estate-primary-dark text-white"
        >
          Apply Filters
        </Button>
        {hasActiveFilters() && (
          <div className="mt-2 text-center">
            <span className="text-xs text-estate-gray-500">
              {filters.locations.length +
                filters.propertyTypes.length +
                filters.amenities.length}{' '}
              filters selected
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
