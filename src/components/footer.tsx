'use client';

import { Separator } from '@/components/ui/separator';
import { IconMapPin, IconPhone, IconMail } from '@tabler/icons-react';

export function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RealEstate Pro</h3>
            <p className="text-muted-foreground">
              Your trusted partner in finding the perfect property.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/properties" className="hover:text-primary">Properties</a></li>
              <li><a href="/about" className="hover:text-primary">About Us</a></li>
              <li><a href="/contact" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <IconMapPin className="h-4 w-4" />
                <span>123 Real Estate St, City, State 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <IconPhone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <IconMail className="h-4 w-4" />
                <span>info@realestatepro.com</span>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 RealEstate Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
