'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IconHome,
  IconSearch,
  IconHeart,
  IconClipboard,
} from '@tabler/icons-react';

const services = [
  {
    icon: IconHome,
    title: 'Property Sales',
    description:
      'Expert guidance in buying and selling residential and commercial properties with competitive pricing and market insights.',
  },
  {
    icon: IconSearch,
    title: 'Market Analysis',
    description:
      'Comprehensive market research and property valuations to help you make informed decisions.',
  },
  {
    icon: IconHeart,
    title: 'Personalized Matching',
    description:
      'We match you with properties that perfectly fit your lifestyle, budget, and preferences.',
  },
  {
    icon: IconClipboard,
    title: 'Full-Service Support',
    description:
      'From initial consultation to closing, we handle all the paperwork and legal requirements.',
  },
];

export function Services() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            We offer comprehensive real estate services to help you find, buy,
            or sell your perfect property.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-primary/10 rounded-full w-fit">
                  <service.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm sm:text-base text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
