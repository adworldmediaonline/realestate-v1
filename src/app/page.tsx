import { HeroSection } from '@/components/hero-section';
import { Services } from '@/components/services';
import { FeaturedProperties } from '@/components/featured-properties';
import { Testimonials } from '@/components/testimonials';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Services />
      <FeaturedProperties />
      <Testimonials />
      <Footer />
    </div>
  );
}
