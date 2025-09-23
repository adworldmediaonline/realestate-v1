'use client';

import { PropertyWithImages } from '@/validation/property.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconHeart, IconMessage, IconCalendar } from '@tabler/icons-react';

type UserActionsProps = {
  property: PropertyWithImages;
};

export function UserActions({ property }: UserActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" variant="default">
          <IconHeart className="mr-2 h-4 w-4" />
          Add to Favorites
        </Button>
        <Button className="w-full" variant="outline">
          <IconMessage className="mr-2 h-4 w-4" />
          Send Inquiry
        </Button>
        <Button className="w-full" variant="outline">
          <IconCalendar className="mr-2 h-4 w-4" />
          Book a Viewing
        </Button>
      </CardContent>
    </Card>
  );
}
