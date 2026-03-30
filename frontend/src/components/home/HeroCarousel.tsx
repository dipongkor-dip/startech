"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroImages = [
  {
    id: 1,
    title: "Latest Gaming PCs",
    subtitle: "Build your dream gaming setup",
    image: "/api/placeholder/1200/400",
    cta: "Shop Now",
    ctaLink: "/gaming-pc"
  },
  {
    id: 2,
    title: "MacBook Pro M3",
    subtitle: "Unleash your creativity with Apple's latest",
    image: "/api/placeholder/1200/400",
    cta: "Explore",
    ctaLink: "/macbook"
  },
  {
    id: 3,
    title: "Summer Sale",
    subtitle: "Up to 30% off on selected items",
    image: "/api/placeholder/1200/400",
    cta: "View Deals",
    ctaLink: "/offers"
  }
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isMounted]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  if (!isMounted) {
    return (
      <div className="relative w-full overflow-hidden rounded-lg bg-muted">
        <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse bg-gray-200 h-8 w-64 mx-auto mb-4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-48 mx-auto rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-muted">
      <div className="relative h-[400px] md:h-[500px]">
        {/* Slides */}
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroImages.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10" />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-6 max-w-md">
                  {slide.subtitle}
                </p>
                <Link href={slide.ctaLink}>
                  <Button size="lg" className="w-fit">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentSlide === index 
                  ? "bg-white w-8" 
                  : "bg-white/50 hover:bg-white/70"
              )}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
