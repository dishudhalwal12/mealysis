import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import { isAppBrowser } from "../../utils/platform.ts";
import { trackEvent } from "../../utils/analytics.ts";
import { useGeolocation } from "../../context/GeolocationContext.tsx";

interface BannerData {
  imageUrl: string;
  clickUrl?: string;
  isClickable?: boolean;
}

interface BannerCarouselProps {
  banners: BannerData[];
  autoPlayInterval?: number;
  onSlideChange?: (index: number) => void;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, autoPlayInterval = 5000, onSlideChange }) => {
  const { geolocation } = useGeolocation();

  const handleBannerClick = (banner: BannerData, index: number) => {
    // Track banner click event
    trackEvent("Banner Click", geolocation, {
      banner_url: banner.imageUrl,
      click_url: banner.clickUrl,
      banner_position: index + 1,
      total_banners: banners.length,
      is_clickable: banner.isClickable
    });

    // Handle click based on banner configuration
    if (banner.isClickable && banner.clickUrl) {
      // Open URL in new tab/window
      window.open(banner.clickUrl, '_blank', 'noopener,noreferrer');
    } else if (!isAppBrowser) {
      // Fallback to app store links for non-clickable banners
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
        window.location.href = "https://apple.co/40RjcWh";
      } else if (userAgent.includes("android")) {
        window.location.href =
          "https://play.google.com/store/apps/details?id=com.quickcompare.app&hl=en";
      }
    }
  };

  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={8}
      slidesPerView={1.05}
      autoplay={{
        delay: autoPlayInterval,
        disableOnInteraction: false,
      }}
      onSlideChange={(swiper) => onSlideChange?.(swiper.activeIndex)}
      className="aspect-[17/8] w-full"
      style={{ paddingLeft: "16px", paddingRight: "16px" }}>
      {banners.map((banner, index) => (
        <SwiperSlide key={index}>
          <img
            src={banner.imageUrl}
            alt={`Banner ${index + 1}`}
            className={`h-full w-full rounded-lg object-cover ${banner.isClickable ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={() => handleBannerClick(banner, index)}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "low"}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BannerCarousel;
