'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconSearch,
  IconMapPin,
  IconHome,
  IconTrendingUp,
  IconShield,
  IconAward,
} from '@tabler/icons-react';
import { Header } from '@/components/header';

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80')",
      }}
    >
      <Header />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="container mx-auto px-4 text-center relative z-10 pt-16">
        <Badge
          variant="outline"
          className="mb-4 text-sm bg-white/10 text-white border-white/20"
        >
          Trusted by 10,000+ homeowners
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight drop-shadow-lg">
          Build Your Future, One Property at a Time
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-md">
          Own Your World, One Property at a Time. Discover premium properties
          with our expert guidance.
        </p>

        <Card className="max-w-6xl mx-auto shadow-2xl border-0 bg-white/98 backdrop-blur-lg rounded-3xl">
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              <div className="col-span-2 md:col-span-1 lg:col-span-1">
                <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-800">
                  Looking for
                </label>
                <Input
                  placeholder="Enter type"
                  className="h-12 text-sm border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-800">
                  Price
                </label>
                <Input
                  placeholder="Price"
                  className="h-12 text-sm border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-800">
                  Locations
                </label>
                <Input
                  placeholder="Location"
                  className="h-12 text-sm border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-800">
                  Number of rooms
                </label>
                <Input
                  placeholder="2 Bedrooms"
                  className="h-12 text-sm border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="col-span-2 md:col-span-1 lg:col-span-1 flex items-end">
                <Button
                  className="h-12 text-sm font-semibold w-full bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  <IconSearch className="mr-2 h-4 w-4" />
                  Search Properties
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-gray-700 text-sm font-semibold">
                Filter:
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-2 border-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all"
              >
                City
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-2 border-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all"
              >
                House
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-2 border-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all"
              >
                Residential
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-2 border-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all"
              >
                Apartment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
