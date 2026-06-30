"use client";

import {HeroCarousel} from "@/components/home/HeroCarousel";
import {ScrollingText} from "@/components/home/ScrollingText";
import {ServicesShowcase} from "@/components/home/ServicesShowcase";
import {CategoriesShowcase} from "@/components/home/CategoriesShowcase";
import {FeaturedProducts} from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl flex w-full flex-1 flex-col pt-6 pb-10">
      {/* Hero Carousel */}
      <section className="mb-8">
        <HeroCarousel />
      </section>

      {/* Scrolling Text */}
      <section>
        <ScrollingText />
      </section>

      {/* Services Showcase */}
      <section>
        <ServicesShowcase />
      </section>

      {/* Categories Showcase */}
      <section className="py-20">
        <CategoriesShowcase />
      </section>

      {/* Featured Products */}
      <section>
        <FeaturedProducts />
      </section>
    </div>
  );
}
