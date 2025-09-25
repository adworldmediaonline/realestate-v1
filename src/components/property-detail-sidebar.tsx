'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  IconBed,
  IconBath,
  IconToolsKitchen,
  IconSquare,
  IconCar,
  IconMapPin,
  IconStar,
  IconHeart,
  IconShare,
  IconPhone,
  IconShoppingCart,
} from '@tabler/icons-react';
import { PropertyWithImages } from '@/validation/property.schema';

interface PropertyDetailSidebarProps {
  property: PropertyWithImages;
  onClose?: () => void;
}

export function PropertyDetailSidebar({
  property,
  onClose,
}: PropertyDetailSidebarProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.name,
        text: property.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const propertyImages = [
    property.thumbnail?.url || '/placeholder-property.jpg',
    '/placeholder-interior-1.jpg',
    '/placeholder-interior-2.jpg',
  ];

  const propertyFeatures = [
    { icon: IconBed, label: 'Rooms', value: '6' },
    { icon: IconBed, label: 'Beds', value: property.bedrooms.toString() },
    { icon: IconBath, label: 'Baths', value: property.bathrooms.toString() },
    { icon: IconToolsKitchen, label: 'Kitchen', value: '2' },
    {
      icon: IconSquare,
      label: 'Area',
      value: `${property.area.toLocaleString()} sqft`,
    },
    { icon: IconCar, label: 'Garage', value: '1' },
  ];

  return (
    <div className="w-full lg:w-96 bg-white border-l border-estate-gray-200 h-full overflow-y-auto estate-scrollbar">
      <div className="p-6">
        {/* Property Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-xl font-bold text-estate-gray-900">
              {property.name}
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteToggle}
                className="h-8 w-8"
                aria-label={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <IconHeart
                  className={`h-4 w-4 ${
                    isFavorite
                      ? 'fill-estate-error text-estate-error'
                      : 'text-estate-gray-600'
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="h-8 w-8"
                aria-label="Share property"
              >
                <IconShare className="h-4 w-4 text-estate-gray-600" />
              </Button>
            </div>
          </div>

          <div className="flex items-center text-estate-gray-600 mb-2">
            <IconMapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="text-2xl font-bold text-estate-primary mb-2">
            ₹{property.price.toLocaleString('en-IN')}
          </div>

          <div className="flex items-center text-estate-gray-600">
            <IconStar className="h-4 w-4 fill-estate-warning text-estate-warning mr-1" />
            <span className="text-sm font-medium">4.8/5</span>
          </div>
        </div>

        {/* Property Images */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Image
                src={propertyImages[0]}
                alt={property.name}
                width={200}
                height={150}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Image
                src={propertyImages[1]}
                alt="Interior view"
                width={100}
                height={60}
                className="w-full h-15 object-cover rounded-lg"
              />
              <Image
                src={propertyImages[2]}
                alt="Living area"
                width={100}
                height={60}
                className="w-full h-15 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="space-y-4">
              <p className="text-estate-gray-600 text-sm leading-relaxed">
                Welcome to {property.name} 🌴🏡 Experience a peaceful escape at{' '}
                {property.name}, a modern retreat set on a quiet hillside with
                stunning views of valleys and starry nights.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-3">
                {propertyFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4 text-estate-primary" />
                      <div>
                        <div className="text-sm font-medium text-estate-gray-900">
                          {feature.value}
                        </div>
                        <div className="text-xs text-estate-gray-500">
                          {feature.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-estate-primary mb-2">
                  4.8
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <IconStar
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4
                          ? 'fill-estate-warning text-estate-warning'
                          : 'text-estate-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-estate-gray-600">
                  Based on 24 reviews
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: 'Sarah M.',
                    rating: 5,
                    comment: 'Amazing property with great views!',
                  },
                  {
                    name: 'John D.',
                    rating: 5,
                    comment: 'Perfect location and excellent amenities.',
                  },
                  {
                    name: 'Emily R.',
                    rating: 4,
                    comment: 'Beautiful home, would definitely recommend.',
                  },
                ].map((review, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{review.name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <IconStar
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? 'fill-estate-warning text-estate-warning'
                                : 'text-estate-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-estate-gray-600">
                      {review.comment}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-estate-gray-900 mb-2">
                  Property Details
                </h3>
                <div className="space-y-2 text-sm text-estate-gray-600">
                  <div className="flex justify-between">
                    <span>Property Type:</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Built Year:</span>
                    <span className="font-medium">2020</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parking:</span>
                    <span className="font-medium">Garage + Street</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heating:</span>
                    <span className="font-medium">Central</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-estate-gray-900 mb-2">
                  Nearby Amenities
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-estate-gray-600">
                  <div>• Shopping Mall (0.5 mi)</div>
                  <div>• School (0.3 mi)</div>
                  <div>• Hospital (1.2 mi)</div>
                  <div>• Park (0.8 mi)</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <IconPhone className="h-4 w-4" />
            <span>Contact Agent</span>
          </Button>
          <Button className="w-full bg-estate-primary hover:bg-estate-primary-dark flex items-center justify-center space-x-2">
            <IconShoppingCart className="h-4 w-4" />
            <span>Order Now</span>
          </Button>
        </div>

        {/* Map Section */}
        <div className="mt-6">
          <h3 className="font-semibold text-estate-gray-900 mb-3">Location</h3>
          <div className="h-48 bg-estate-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-estate-gray-500">
              <IconMapPin className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Interactive Map</p>
              <p className="text-xs">Click to view full map</p>
            </div>
          </div>
          <p className="text-xs text-estate-gray-500 mt-2 text-center">
            {property.location}
          </p>
        </div>
      </div>
    </div>
  );
}
