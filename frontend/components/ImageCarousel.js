import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const ImageCarousel = ({ images }) => {
  // Get random 7 images (or fewer if not enough available)
  const randomImages = useMemo(() => {
    if (!images || images.length === 0) return [];
    
    // Shuffle array and pick first 7
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(7, images.length));
  }, [images]);

  if (randomImages.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500">
        <span className="text-white text-lg font-semibold">No images available</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        {randomImages.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={typeof image === "string" ? image : image.url}
              alt="Carousel Slide"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;