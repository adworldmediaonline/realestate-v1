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
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <FilterSidebar onFiltersChange={handleFiltersChange} />
        </div>

        {/* Property Grid */}
        <div className={`flex-1 transition-all duration-300 ${
          selectedProperty ? 'lg:w-[calc(100%-32rem)]' : 'lg:w-[calc(100%-20rem)]'
        }`}>
          <EstatePropertyGrid
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
            searchQuery={searchQuery}
            filters={filters}
          />
        </div>

        {/* Property Detail Sidebar */}
        <div className={`hidden xl:block transition-all duration-300 ease-in-out ${
          selectedProperty 
            ? 'w-80 opacity-100 translate-x-0' 
            : 'w-0 opacity-0 translate-x-full overflow-hidden'
        }`}>
          {selectedProperty && (
            <PropertyDetailSidebar
              property={selectedProperty}
              onClose={handleCloseDetailSidebar}
            />
          )}
        </div>

        {/* Mobile Property Detail Overlay */}
        {selectedProperty && (
          <div 
            className="xl:hidden fixed inset-0 z-50 bg-black bg-opacity-50 animate-in fade-in duration-300"
            onClick={handleCloseDetailSidebar}
          >
            <div 
              className="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-xl animate-in slide-in-from-right duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <PropertyDetailSidebar
                property={selectedProperty}
                onClose={handleCloseDetailSidebar}
              />
            </div>
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
