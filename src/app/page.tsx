import { HeroSection } from '@/components/hero-section';
import { Services } from '@/components/services';
import { PropertyGrid } from '@/components/property-grid';
import { Testimonials } from '@/components/testimonials';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Services />
      <PropertyGrid />
      <Testimonials />
      <Footer />
    </div>
  );
}
