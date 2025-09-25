'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
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

  // Handle Escape key to close sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Sanitize HTML content from rich text editor
  const sanitizeHTML = (htmlContent: string) => {
    return DOMPurify.sanitize(htmlContent, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'b',
        'em',
        'i',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'span',
        'div',
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
      ALLOW_DATA_ATTR: false,
    });
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

  // Use real property images
  const propertyImages = [
    property.thumbnail?.url || '/placeholder-property.jpg',
    ...(property.images?.slice(0, 2).map(img => img.url) || [
      '/placeholder-interior-1.jpg',
      '/placeholder-interior-2.jpg',
    ]),
  ];

  // Use real property features
  const propertyFeatures = [
    { icon: IconBed, label: 'Bedrooms', value: property.bedrooms.toString() },
    {
      icon: IconBath,
      label: 'Bathrooms',
      value: property.bathrooms.toString(),
    },
    {
      icon: IconSquare,
      label: 'Area',
      value: property.area ? `${property.area.toLocaleString()} sqft` : 'N/A',
    },
    { icon: IconMapPin, label: 'Type', value: property.propertyType },
  ];

  // Add features from the property.features array
  const additionalFeatures =
    property.features?.slice(0, 4).map((feature, index) => ({
      icon: IconToolsKitchen, // Default icon, could be mapped based on feature name
      label: feature,
      value: '✓',
    })) || [];

  return (
    <div className="w-full h-full bg-white border-l border-estate-gray-200 overflow-y-auto estate-scrollbar">
      <div className="p-4 sm:p-6">
        {/* Property Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-lg sm:text-xl font-bold text-estate-gray-900 leading-tight pr-2">
              {property.name}
            </h1>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClose?.();
                  }
                }}
                className="h-8 w-8 hover:bg-estate-gray-100 hover:text-estate-gray-900 transition-colors"
                aria-label="Close property details"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
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

          <div className="flex items-center text-estate-gray-600 mb-3">
            <IconMapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm leading-relaxed">{property.location}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="text-xl sm:text-2xl font-bold text-estate-primary">
              ₹{property.price.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center text-estate-gray-600">
              <IconStar className="h-4 w-4 fill-estate-warning text-estate-warning mr-1" />
              <span className="text-sm font-medium">4.8/5</span>
            </div>
          </div>
        </div>

        {/* Property Images */}
        <div className="mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="sm:col-span-2">
              <Image
                src={propertyImages[0]}
                alt={property.thumbnail?.altText || property.name}
                width={200}
                height={150}
                className="w-full h-32 sm:h-40 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:space-y-2">
              <Image
                src={propertyImages[1]}
                alt={
                  property.images?.[0]?.altText ||
                  `${property.name} interior view`
                }
                width={100}
                height={60}
                className="w-full h-16 sm:h-15 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
              />
              <Image
                src={propertyImages[2]}
                alt={
                  property.images?.[1]?.altText ||
                  `${property.name} living area`
                }
                width={100}
                height={60}
                className="w-full h-16 sm:h-15 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-4 sm:mb-6">
          <TabsList className="grid w-full grid-cols-3 h-10 sm:h-12">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs sm:text-sm">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="about" className="text-xs sm:text-sm">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-3 sm:mt-4">
            <div className="space-y-3 sm:space-y-4">
              {property.description && property.description.trim() ? (
                <div
                  className="text-estate-gray-600 text-sm sm:text-base leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:mb-3 [&>ol]:mb-3 [&>li]:mb-1 [&>h1]:text-lg [&>h2]:text-base [&>h3]:text-sm [&>strong]:font-semibold [&>em]:italic [&>a]:text-estate-primary [&>a]:underline [&>blockquote]:border-l-4 [&>blockquote]:border-estate-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(property.description),
                  }}
                />
              ) : (
                <p className="text-estate-gray-400 italic text-sm">
                  No description available for this property.
                </p>
              )}

              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {propertyFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-estate-gray-50 rounded-lg"
                    >
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-estate-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-estate-gray-900 truncate">
                          {feature.value}
                        </div>
                        <div className="text-xs text-estate-gray-500 truncate">
                          {feature.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Features */}
              {additionalFeatures.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-estate-gray-900 mb-2">
                    Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {additionalFeatures.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-estate-gray-50 rounded-lg"
                        >
                          <IconComponent className="h-4 w-4 text-estate-success flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm text-estate-gray-700 truncate">
                              {feature.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-3 sm:mt-4">
            <div className="space-y-3 sm:space-y-4">
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
                    <span>Bedrooms:</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bathrooms:</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Area:</span>
                    <span className="font-medium">
                      {property.area
                        ? `${property.area.toLocaleString()} sqft`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium text-estate-primary">
                      ₹{property.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{property.location}</span>
                  </div>
                  {property.address && (
                    <div className="flex justify-between">
                      <span>Address:</span>
                      <span className="font-medium">{property.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-estate-gray-900 mb-2">
                  Property Features
                </h3>
                {property.features && property.features.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 text-sm text-estate-gray-600">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-estate-success">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-estate-gray-400 italic">
                    No additional features listed
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="space-y-2 sm:space-y-3">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 h-10 sm:h-11"
          >
            <IconPhone className="h-4 w-4" />
            <span className="text-sm sm:text-base">Contact Agent</span>
          </Button>
          <Button className="w-full bg-estate-primary hover:bg-estate-primary-dark flex items-center justify-center space-x-2 h-10 sm:h-11">
            <IconShoppingCart className="h-4 w-4" />
            <span className="text-sm sm:text-base">Order Now</span>
          </Button>
        </div>

        {/* Map Section */}
        <div className="mt-4 sm:mt-6">
          <h3 className="font-semibold text-estate-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
            Location
          </h3>
          <div className="h-32 sm:h-48 bg-estate-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-estate-gray-500">
              <IconMapPin className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm">Interactive Map</p>
              <p className="text-xs">Click to view full map</p>
            </div>
          </div>
          <p className="text-xs text-estate-gray-500 mt-2 text-center leading-relaxed">
            {property.location}
          </p>
        </div>
      </div>
    </div>
  );
}
