'use client';

import { PropertyForm } from '@/components/property-form';
import { useRouter } from 'next/navigation';

export default function NewPropertyPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard/properties');
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold">Create New Property</h1>
      </div>
      <div className="px-4 lg:px-6">
        <PropertyForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
