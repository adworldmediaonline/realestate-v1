'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconQuote } from '@tabler/icons-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'First-time Homebuyer',
    content:
      'RealEstate Pro made finding our dream home effortless. Their team was incredibly helpful and professional throughout the entire process.',
    avatar: '/avatars/sarah.jpg',
    initials: 'SJ',
  },
  {
    name: 'Mike Chen',
    role: 'Property Investor',
    content:
      "I've worked with many real estate agencies, but none compare to the expertise and market knowledge at RealEstate Pro.",
    avatar: '/avatars/mike.jpg',
    initials: 'MC',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Family of 4',
    content:
      'From the initial consultation to closing, everything was handled with care and attention to detail. Highly recommend!',
    avatar: '/avatars/emily.jpg',
    initials: 'ER',
  },
];

export function Testimonials() {
  return (
    <section className="py-12 sm:py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients
            have to say about their experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-4 sm:p-6">
                <IconQuote className="h-6 w-6 sm:h-8 sm:w-8 text-primary/20 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="text-sm">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
