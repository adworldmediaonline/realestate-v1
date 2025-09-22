'use client';

import { PropertyForm } from '@/components/property-form';
import { usePropertyById } from '@/hooks/use-properties';
import { useParams, useRouter } from 'next/navigation';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: property, isLoading, error, refetch } = usePropertyById(id);

  const handleSuccess = () => {
    router.push('/dashboard/properties');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !property) {
    return <div>Error loading property or property not found.</div>;
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold">Edit Property</h1>
      </div>
      <div className="px-4 lg:px-6">
        <PropertyForm
          property={property}
          onSuccess={handleSuccess}
          propertyId={id}
          onImageUpdate={refetch}
        />
      </div>
    </div>
  );
}
