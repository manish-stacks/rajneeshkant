"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react"; // <-- icons

type ServiceImage = {
  _id: string;
  url: string;
};

type ServiceImageCarouselProps = {
  service: {
    service_name: string;
    service_images: ServiceImage[];
  };
};

export default function ServiceImageCarousel({
  service,
}: ServiceImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-6 mt-5">
      {/* Main Image */}
      <div className="relative w-full max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-0 aspect-[16/12] relative bg-gray-50">
            <Image
              src={
                service.service_images[activeIndex]?.url ||
                "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"
              }
              alt={`${service.service_name} - Image ${activeIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain rounded-lg transition-transform duration-500 hover:scale-[1.02]"
            />
          </CardContent>
        </Card>

        {/* Arrows */}
        <button
          className="absolute top-1/2 -translate-y-1/2 left-4 bg-white/80 backdrop-blur-md rounded-full p-2 shadow-md hover:bg-white hover:scale-110 transition"
          onClick={() =>
            setActiveIndex(
              (prev) =>
                (prev - 1 + service.service_images.length) %
                service.service_images.length
            )
          }
        >
          <ChevronLeft className="w-6 h-6 text-blue-600" />
        </button>
        <button
          className="absolute top-1/2 -translate-y-1/2 right-4 bg-white/80 backdrop-blur-md rounded-full p-2 shadow-md hover:bg-white hover:scale-110 transition"
          onClick={() =>
            setActiveIndex((prev) => (prev + 1) % service.service_images.length)
          }
        >
          <ChevronRight className="w-6 h-6 text-blue-600" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center gap-4 flex-wrap mt-10">
        {service.service_images.map((image, index) => (
          <button
            key={image._id}
            onClick={() => setActiveIndex(index)}
            className={`relative w-28 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300
        ${
          activeIndex === index
            ? "border-blue-600 shadow-2xl scale-110 ring-4 ring-blue-200"
            : "border-gray-200 hover:border-blue-400 hover:scale-105"
        } bg-white/70 backdrop-blur-md`}
          >
            {/* Thumbnail Image */}
            <Image
              src={
                image.url ||
                "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
              }
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover rounded-lg transition-transform duration-500 hover:scale-105"
            />

            {/* Overlay Effect on Hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300
          ${
            activeIndex === index ? "opacity-50" : "opacity-0 hover:opacity-40"
          }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
