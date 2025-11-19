import React, { useState } from 'react';
import { IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface FullScreenGalleryProps {
  images: string[];
  initialIndex: number;
  alt?: string;
  onClose: () => void;
}

export default function FullScreenGallery({ 
  images, 
  initialIndex = 0, 
  alt = "Product",
  onClose 
}: FullScreenGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-bg dark:bg-bg flex flex-col"
      onClick={handleBackdropClick}
    >
      {/* Header with Close Button */}
      <div className="flex justify-between items-center p-4">
        <div className="text-text-dark dark:text-text-light text-sm">
          {currentIndex + 1} of {images.length}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-grey-light dark:bg-grey-dark hover:bg-grey-light/80 dark:hover:bg-grey-dark/80 transition-colors"
          aria-label="Close gallery"
        >
          <IconX size={24} className="text-text-dark dark:text-text-light" />
        </button>
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center relative">
        <img
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-bg/90 p-3 hover:bg-bg transition-colors dark:bg-bg/90 dark:hover:bg-bg"
              aria-label="Previous image"
            >
              <IconChevronLeft size={24} className="text-text-dark dark:text-text-light" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-bg/90 p-3 hover:bg-bg transition-colors dark:bg-bg/90 dark:hover:bg-bg"
              aria-label="Next image"
            >
              <IconChevronRight size={24} className="text-text-dark dark:text-text-light" />
            </button>
          </>
        )}
      </div>

      {/* Preview Strip */}
      {images.length > 1 && (
        <div className="p-4 bg-grey-light dark:bg-grey-dark">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-action'
                    : 'border-transparent hover:border-action/50'
                }`}
              >
                <img
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 