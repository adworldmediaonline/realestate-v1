'use client';

import { PropertyCard } from '@/components/property-card';
import { PropertyWithImages } from '@/validation/property.schema';
import { useProperties } from '@/hooks/use-properties';

export function FeaturedProperties() {
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading)
    return (
      <div className="text-center py-8">Loading featured properties...</div>
    );
  if (error)
    return <div className="text-center py-8">Error loading properties</div>;

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          Featured Properties
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {properties?.slice(0, 6).map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
