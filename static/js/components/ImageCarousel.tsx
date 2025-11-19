import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import CartQuantityControl from './CartQuantityControl.tsx';
import FullScreenGallery from './FullScreenGallery.tsx';
import { GroupedProduct } from '../api/getGroupedProducts.ts';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  product?: GroupedProduct;
}

export default function ImageCarousel({ 
  images, 
  alt = "Product",
  product
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    setShowFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setShowFullScreen(false);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="relative w-full">
        {/* Main Image */}
        <div className="relative h-64 w-full overflow-hidden rounded-lg">
          <img
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className="h-full w-full object-contain cursor-pointer"
            onClick={handleImageClick}
          />
          
          {/* Cart Quantity Control - Bottom Right */}
          {product && (
            <div className="absolute bottom-2 right-2">
              <CartQuantityControl product={product} />
            </div>
          )}
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-bg/90 p-2 shadow-md hover:bg-bg transition-colors dark:bg-bg/90 dark:hover:bg-bg"
                aria-label="Previous image"
              >
                <IconChevronLeft size={20} className="text-text-dark dark:text-text-light" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-bg/90 p-2 shadow-md hover:bg-bg transition-colors dark:bg-bg/90 dark:hover:bg-bg"
                aria-label="Next image"
              >
                <IconChevronRight size={20} className="text-text-dark dark:text-text-light" />
              </button>
            </>
          )}
        </div>

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-action'
                    : 'bg-text-light-dark dark:bg-text-light'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="mt-2 text-center text-sm text-text-dark dark:text-text-light">
            {currentIndex + 1} of {images.length}
          </div>
        )}
      </div>

      {/* Full Screen Gallery */}
      {showFullScreen && (
        <FullScreenGallery
          images={images}
          initialIndex={currentIndex}
          alt={alt}
          onClose={handleCloseFullScreen}
        />
      )}
    </>
  );
} 