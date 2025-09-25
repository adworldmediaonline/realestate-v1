'use client';

import { PropertyWithImages } from '@/validation/property.schema';
import Image from 'next/image';
import { useState } from 'react';

type PropertyGalleryProps = {
  property: PropertyWithImages;
};

export function PropertyGallery({ property }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(property.thumbnail?.url || '');

  const allImages = [
    property.thumbnail,
    ...property.images,
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="aspect-video relative overflow-hidden rounded-lg">
        <Image
          src={selectedImage}
          alt="Selected property image"
          fill
          className="object-cover"
        />
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image?.url || '')}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                selectedImage === image?.url ? 'border-primary' : 'border-transparent'
              }`}
            >
              <Image
                src={image?.url || '/placeholder.jpg'}
                alt={image?.altText || `Image ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
