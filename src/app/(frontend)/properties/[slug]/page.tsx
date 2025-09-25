'use client';

import { PropertyGallery } from '@/components/property-gallery';
import { PropertyInfo } from '@/components/property-info';
import { UserActions } from '@/components/user-actions';
import { RelatedProperties } from '@/components/related-properties';
import { usePropertyById } from '@/hooks/use-properties';
import { useParams } from 'next/navigation';

export default function PropertyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: property, isLoading, error } = usePropertyById(slug);

  if (isLoading) return <div>Loading property...</div>;
  if (error || !property) return <div>Property not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PropertyGallery property={property} />
        <div className="space-y-6">
          <PropertyInfo property={property} />
          <UserActions property={property} />
        </div>
      </div>
      <RelatedProperties currentPropertyId={property.id} />
    </div>
  );
}
