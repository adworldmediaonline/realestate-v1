import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  IconHome,
  IconSearch,
  IconArrowLeft,
  IconMapPin,
  IconBuilding,
} from '@tabler/icons-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-estate-gray-50 to-estate-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main 404 Card */}
        <Card className="estate-card shadow-xl border-0">
          <CardContent className="p-8 sm:p-12 text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl sm:text-9xl font-bold text-estate-primary mb-4">
                404
              </h1>
              <div className="w-24 h-1 bg-estate-primary mx-auto rounded-full"></div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-estate-gray-900 mb-4">
                Property Not Found
              </h2>
              <p className="text-estate-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                The property you're looking for seems to have moved or doesn't
                exist. Don't worry, we have plenty of other amazing properties
                waiting for you.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                asChild
                className="bg-estate-primary hover:bg-estate-primary-dark text-white px-8 py-3 h-auto"
              >
                <Link href="/" className="flex items-center space-x-2">
                  <IconHome className="h-5 w-5" />
                  <span>Go Home</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-estate-primary text-estate-primary hover:bg-estate-primary hover:text-white px-8 py-3 h-auto"
              >
                <Link href="/" className="flex items-center space-x-2">
                  <IconSearch className="h-5 w-5" />
                  <span>Browse Properties</span>
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className="border-t border-estate-gray-200 pt-8">
              <p className="text-estate-gray-500 text-sm mb-4">Quick Links</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-estate-gray-600 hover:text-estate-primary transition-colors"
                >
                  <IconMapPin className="h-4 w-4" />
                  <span className="text-sm">All Properties</span>
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center space-x-2 text-estate-gray-600 hover:text-estate-primary transition-colors"
                >
                  <IconBuilding className="h-4 w-4" />
                  <span className="text-sm">Favorites</span>
                </Link>
                <Link
                  href="/help"
                  className="flex items-center space-x-2 text-estate-gray-600 hover:text-estate-primary transition-colors"
                >
                  <IconSearch className="h-4 w-4" />
                  <span className="text-sm">Help Center</span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-estate-gray-500 text-sm">
            Need help? Contact our support team or{' '}
            <Link href="/help" className="text-estate-primary hover:underline">
              visit our help center
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
