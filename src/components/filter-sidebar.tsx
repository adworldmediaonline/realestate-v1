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
  locations: ['Jakarta, Indonesia'],
  priceRange: [10000, 50000],
  landArea: {
    min: '',
    max: '',
  },
  propertyTypes: ['Single Family Home', 'Apartment'],
  amenities: ['Garden'],
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
  const { data: properties } = useProperties();

  // Dynamically generate filter options from real data
  const filterOptions = useMemo(() => {
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
    const priceRange: [number, number] = [
      Math.min(...prices),
      Math.max(...prices),
    ];

    // Calculate area range
    const areas = publishedProperties
      .map(p => p.area)
      .filter((area): area is number => area !== null && area !== undefined);
    const areaRange: [number, number] =
      areas.length > 0 ? [Math.min(...areas), Math.max(...areas)] : [0, 10000];

    return {
      locations,
      propertyTypes,
      priceRange,
      areaRange,
    };
  }, [properties]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
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
    updateFilters({ priceRange: value as [number, number] });
  };

  const handleLandAreaChange = (field: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      landArea: {
        ...prev.landArea,
        [field]: value,
      },
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      locations: [],
      priceRange: [0, 100000],
      landArea: { min: '', max: '' },
      propertyTypes: [],
      amenities: [],
    });
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
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  return (
    <div className="w-80 bg-white border-r border-estate-gray-200 h-full overflow-y-auto estate-scrollbar">
      <div className="p-6">
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
                setFilters(prev => ({ ...prev, priceRange: [0, 100000] }))
              }
              className="h-6 w-6 p-0"
            >
              <IconX className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="price-custom" defaultChecked />
              <Label
                htmlFor="price-custom"
                className="text-sm text-estate-gray-600"
              >
                Custom
              </Label>
            </div>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={filterOptions.priceRange[1]}
                min={filterOptions.priceRange[0]}
                step={Math.max(
                  100,
                  Math.floor(
                    (filterOptions.priceRange[1] -
                      filterOptions.priceRange[0]) /
                      100
                  )
                )}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-estate-gray-500 mt-1">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
            <div className="space-y-2">
              {['Under $1,000', '$1,000 - $15,000', 'More Than $15,000'].map(
                option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox id={`price-${option}`} />
                    <Label
                      htmlFor={`price-${option}`}
                      className="text-sm text-estate-gray-600"
                    >
                      {option}
                    </Label>
                  </div>
                )
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
                placeholder="0"
                value={filters.landArea.min}
                onChange={e => handleLandAreaChange('min', e.target.value)}
                className="mt-1"
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
                placeholder="∞"
                value={filters.landArea.max}
                onChange={e => handleLandAreaChange('max', e.target.value)}
                className="mt-1"
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
                  className="text-sm text-estate-gray-600 cursor-pointer"
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
    </div>
  );
}
