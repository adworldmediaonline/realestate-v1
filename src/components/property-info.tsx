'use client';

import { PropertyWithImages } from '@/validation/property.schema';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconBed, IconBath, IconSquare, IconMapPin } from '@tabler/icons-react';

type PropertyInfoProps = {
  property: PropertyWithImages;
};

export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconMapPin className="h-4 w-4" />
          <span>{property.location}</span>
        </div>
        <div className="text-4xl font-bold text-primary mt-4">
          ${property.price.toLocaleString()}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <IconBed className="h-5 w-5" />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <IconBath className="h-5 w-5" />
              <span>{property.bathrooms} Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <IconSquare className="h-5 w-5" />
              <span>{property.area} sq ft</span>
            </div>
          </div>
          <div>
            <Badge variant="outline" className="mr-2">{property.propertyType}</Badge>
            <Badge variant={property.status === 'PUBLISHED' ? 'default' : 'secondary'}>
              {property.status}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="flex flex-wrap gap-2">
              {property.features.map((feature, index) => (
                <li key={index} className="bg-muted px-2 py-1 rounded text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: property.description }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
