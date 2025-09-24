'use client';

import { PropertyCard } from '@/components/property-card';
import { PropertyWithImages } from '@/validation/property.schema';
import { useProperties } from '@/hooks/use-properties';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';

type PropertyGridProps = {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  limit?: number;
  className?: string;
};

export function PropertyGrid({
  title = 'Explore our premier houses',
  subtitle = 'Each listing offers unique features, exceptional quality, and prime locations, ensuring an exclusive living experience.',
  showViewAll = true,
  limit = 6,
  className = '',
}: PropertyGridProps) {
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Error Loading Properties</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </section>
    );
  }

  const displayedProperties = properties?.slice(0, limit) || [];

  return (
    <section
      className={`py-16 bg-gradient-to-b from-gray-50 to-white ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {showViewAll && (
          <div className="text-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/properties">
                See All Properties
                <IconArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
