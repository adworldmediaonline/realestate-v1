import { PropertyTable } from '@/components/property-table';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

export default function PropertiesPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex justify-between items-center px-4 lg:px-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link href="/dashboard/properties/new">
          <Button>
            <IconPlus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>
      <div className="px-4 lg:px-6">
        <PropertyTable />
      </div>
    </div>
  );
}
