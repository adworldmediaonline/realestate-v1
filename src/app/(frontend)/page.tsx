'use client';

import { useState } from 'react';
import { EstateHeader } from '@/components/estate-header';
import { FilterSidebar } from '@/components/filter-sidebar';
import { EstatePropertyGrid } from '@/components/estate-property-grid';
import { PropertyDetailSidebar } from '@/components/property-detail-sidebar';
import { PropertyWithImages } from '@/validation/property.schema';

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

export default function Home() {
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyWithImages | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    locations: [],
    priceRange: [0, 100000],
    landArea: { min: '', max: '' },
    propertyTypes: [],
    amenities: [],
  });

  const handlePropertySelect = (property: PropertyWithImages) => {
    setSelectedProperty(property);
  };

  const handleCloseDetailSidebar = () => {
    setSelectedProperty(null);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-estate-gray-50">
      {/* Header */}
      <EstateHeader onSearchChange={handleSearchChange} />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Filter Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <FilterSidebar onFiltersChange={handleFiltersChange} />
        </div>

        {/* Property Grid */}
        <div className="flex-1 lg:flex-none lg:w-[calc(100%-24rem)]">
          <EstatePropertyGrid
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
            searchQuery={searchQuery}
            filters={filters}
          />
        </div>

        {/* Property Detail Sidebar */}
        {selectedProperty && (
          <div className="hidden xl:block">
            <PropertyDetailSidebar
              property={selectedProperty}
              onClose={handleCloseDetailSidebar}
            />
          </div>
        )}
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button className="bg-estate-primary text-white p-3 rounded-full shadow-lg hover:bg-estate-primary-dark transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
