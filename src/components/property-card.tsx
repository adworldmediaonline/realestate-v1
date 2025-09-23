'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PropertyWithImages } from '@/validation/property.schema';
import Image from 'next/image';
import Link from 'next/link';
import { IconBed, IconBath, IconSquare } from '@tabler/icons-react';

type PropertyCardProps = {
  property: PropertyWithImages;
};

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={property.thumbnail?.url || '/placeholder.jpg'}
            alt={property.thumbnail?.altText || property.name}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />
          <Badge className="absolute top-2 left-2" variant="secondary">
            {property.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {property.description}
        </p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-primary">
            ${property.price.toLocaleString()}
          </span>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <IconBed className="h-4 w-4" />
              {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <IconBath className="h-4 w-4" />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <IconSquare className="h-4 w-4" />
              {property.area} sq ft
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{property.location}</span>
          <Button asChild>
            <Link href={`/properties/${property.slug}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
