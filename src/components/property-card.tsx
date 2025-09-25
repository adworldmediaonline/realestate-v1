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
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-0 bg-white rounded-2xl">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <Image
            src={property.thumbnail?.url || '/placeholder.jpg'}
            alt={property.thumbnail?.altText || property.name}
            width={400}
            height={250}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Badge
            className="absolute top-3 left-3 bg-white/90 text-gray-800 font-medium backdrop-blur-sm"
            variant="secondary"
          >
            {property.status}
          </Badge>
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              className="bg-primary/90 hover:bg-primary text-white shadow-lg"
            >
              <Link href={`/properties/${property.slug}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-primary transition-colors">
          {property.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {property.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-primary">
            ${property.price.toLocaleString()}
          </span>
          <div className="flex gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <IconBed className="h-4 w-4 text-primary" />
              {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <IconBath className="h-4 w-4 text-primary" />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <IconSquare className="h-4 w-4 text-primary" />
              {property.area} sq ft
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium">
            {property.location}
          </span>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="group-hover:hidden"
          >
            <Link href={`/properties/${property.slug}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
