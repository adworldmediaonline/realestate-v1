'use client';

import { PropertyCard } from '@/components/property-card';
import { PropertyWithImages } from '@/validation/property.schema';
import { useProperties } from '@/hooks/use-properties';

type RelatedPropertiesProps = {
  currentPropertyId: string;
};

export function RelatedProperties({ currentPropertyId }: RelatedPropertiesProps) {
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading) return <div>Loading related properties...</div>;
  if (error) return <div>Error loading properties</div>;

  const related = properties?.filter(p => p.id !== currentPropertyId).slice(0, 3) || [];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Related Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
