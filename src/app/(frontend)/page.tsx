'use client';

import { useState, useEffect } from 'react';
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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

  // Handle Escape key to close mobile filters
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showMobileFilters) {
        setShowMobileFilters(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMobileFilters]);

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
        <div
          className={`flex-1 transition-all duration-300 ${
            selectedProperty
              ? 'lg:w-[calc(100%-32rem)]'
              : 'lg:w-[calc(100%-20rem)]'
          }`}
        >
          <EstatePropertyGrid
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
            searchQuery={searchQuery}
            filters={filters}
          />
        </div>

        {/* Property Detail Sidebar */}
        <div
          className={`hidden xl:block transition-all duration-300 ease-in-out ${
            selectedProperty
              ? 'w-80 opacity-100 translate-x-0'
              : 'w-0 opacity-0 translate-x-full overflow-hidden'
          }`}
        >
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
              onClick={e => e.stopPropagation()}
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
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-estate-primary text-white p-3 rounded-full shadow-lg hover:bg-estate-primary-dark transition-colors"
          aria-label="Open filters"
        >
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

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-full bg-white shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-estate-gray-200">
              <h2 className="text-lg font-semibold text-estate-gray-900">
                Filters
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-estate-gray-100 rounded-lg transition-colors"
                aria-label="Close filters"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="h-[calc(100vh-4rem)] overflow-hidden">
              <FilterSidebar onFiltersChange={handleFiltersChange} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
