import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { trackEvent } from '../utils/analytics.ts';
import { useGeolocation } from '../context/GeolocationContext.tsx';
import { isAppBrowser, isIOS } from '../utils/platform.ts';

interface GoogleAdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  adSizes?: Array<[number, number]>;
}

const GoogleAdBanner: React.FC<GoogleAdBannerProps> = React.memo(({ 
  adSlot, 
  adFormat = 'auto',
  className = '',
  adSizes = [[300, 250], [320, 50], [320, 100], [300, 50], [300, 100], [216, 54], [250, 250], [200, 200], [300, 75], [300, 100], [320, 100], [300, 50]]
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const { geolocation } = useGeolocation();
  const [adSize, setAdSize] = useState<[number, number] | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshTimeRef = useRef<number>(0);
  const slotRef = useRef<any>(null);

  // Debounced refresh function to prevent throttling
  const debouncedRefresh = useCallback((slot: any) => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
    
    // Only refresh if it's been at least 5 seconds since last refresh
    if (timeSinceLastRefresh < 5000) {
      return;
    }
    
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    // Set a new timeout for refresh
    refreshTimeoutRef.current = setTimeout(() => {
      try {
        (window as any).googletag.pubads().refresh([slot]);
        lastRefreshTimeRef.current = Date.now();
        console.log('Ad refreshed successfully');
      } catch (error) {
        console.log('Error refreshing ad:', error);
      }
    }, 1000); // 1 second delay
  }, []);

  const handleAdClick = useCallback((event: Event) => {
    // Track ad click event
    trackEvent('ad_click', geolocation, {
      ad_slot: adSlot,
      ad_format: adFormat,
      page: window.location.pathname
    });
    
    // Handle ad click based on platform
    if (event.target && (event.target as any).href) {
      const url = (event.target as any).href;
      
      if (isAppBrowser) {
        // In app browser, open in external browser
        if (isIOS) {
          // For iOS, use window.open with _blank to force external browser
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          // For Android, try to open in external browser
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      } else {
        // In regular browser, always open in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  }, [adSlot, adFormat, geolocation]);

  // Use the ID that matches the existing slot definition in HTML
  const adElementId = useMemo(() => {
    // Map ad slots to their corresponding HTML div IDs
    const slotIdMap: { [key: string]: string } = {
      '/23312116132/quickcompare_web/qc_home': 'div-gpt-ad-1754468366667-0',
      '/23312116132/quickcompare_web/qc_scroll': 'div-gpt-ad-1754473710270-0',
      '/23312116132/quickcompare_web/qc_scroll1': 'div-gpt-ad-1754474456033-0',
      '/23312116132/quickcompare_web/qc_scroll2': 'div-gpt-ad-1754474757280-0',
      '/23312116132/quickcompare_web/qc_mpu': 'div-gpt-ad-1754475089899-0'
    };
    
    return slotIdMap[adSlot] || `div-gpt-ad-${adSlot.split('/').pop() || 'default'}`;
  }, [adSlot]);

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).googletag) {
      return;
    }

    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Wait for googletag to be ready
    (window as any).googletag.cmd.push(() => {
      try {
        // Find the existing slot that was defined in HTML
        const existingSlot = (window as any).googletag.pubads().getSlots().find((slot: any) =>
          slot.getAdUnitPath() === adSlot
        );

        if (!existingSlot) {
          console.warn('Ad slot not found in HTML:', adSlot);
          return;
        }

        if (existingSlot) {
          slotRef.current = existingSlot;
          
          // Set targeting parameters
          (window as any).googletag.pubads().set('page_url', 'https://quickcompare.in/');
          
          // Add event listeners
          (window as any).googletag.pubads().addEventListener('slotRenderEnded', (event: any) => {
            if (event.slot === existingSlot) {
              const size = event.size;
              if (size && size.length === 2) {
                setAdSize([size[0], size[1]]);
              }
            }
          });

          (window as any).googletag.pubads().addEventListener('slotVisibilityChanged', (event: any) => {
            if (event.slot === existingSlot && event.inViewPercentage > 0) {
              trackEvent('ad_view', geolocation, {
                ad_slot: adSlot,
                ad_format: adFormat,
                view_percentage: event.inViewPercentage
              });
            }
          });

          (window as any).googletag.pubads().addEventListener('impressionViewable', (event: any) => {
            if (event.slot === existingSlot) {
              trackEvent('ad_impression', geolocation, {
                ad_slot: adSlot,
                ad_format: adFormat
              });
            }
          });

          // Display the ad since the div should already exist
          (window as any).googletag.display(adElementId);
          
          // Use debounced refresh to prevent throttling
          debouncedRefresh(existingSlot);
        } else {
          console.warn('Ad slot not found in HTML:', adSlot);
        }
      } catch (error) {
        console.error('Error setting up ad slot:', error);
      }
    });

    // Cleanup function
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [adSlot, adFormat, adSizes, adElementId, debouncedRefresh]);

  // Effect to refresh ad when component mounts (e.g., when navigating back to page)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).googletag && slotRef.current) {
      // Small delay to ensure googletag is fully initialized
      const timer = setTimeout(() => {
        try {
          // Use debounced refresh to prevent throttling
          debouncedRefresh(slotRef.current);
          
          // After ad is loaded, add aggressive click prevention
          setTimeout(() => {
            if (adRef.current) {
              const adElement = adRef.current;
              
              // Find all links within the ad and modify them
              const links = adElement.querySelectorAll('a[href]');
              links.forEach((link: Element) => {
                const anchor = link as HTMLAnchorElement;
                const originalHref = anchor.href;
                
                // Store original href
                anchor.setAttribute('data-original-href', originalHref);
                
                // Remove href temporarily
                anchor.removeAttribute('href');
                
                // Add click handler
                anchor.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  console.log('Ad link clicked, opening in new tab:', originalHref);
                  
                  // Track ad click event
                  trackEvent('ad_click', geolocation, {
                    ad_slot: adSlot,
                    ad_format: adFormat,
                    page: window.location.pathname
                  });
                  
                  // Open in new tab
                  window.open(originalHref, '_blank', 'noopener,noreferrer');
                });
              });
            }
          }, 2000); // Wait for ad to fully render
          
        } catch (error) {
          console.log('Error refreshing ad on mount:', error);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [debouncedRefresh]);

  // Effect to refresh ad when page becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && typeof window !== 'undefined' && (window as any).googletag && slotRef.current) {
        try {
          // Use debounced refresh to prevent throttling
          debouncedRefresh(slotRef.current);
        } catch (error) {
          console.log('Error refreshing ad on visibility change:', error);
        }
      }
    };
    
    const handleFocus = () => {
      if (typeof window !== 'undefined' && (window as any).googletag && slotRef.current) {
        try {
          // Use debounced refresh to prevent throttling
          debouncedRefresh(slotRef.current);
        } catch (error) {
          console.log('Error refreshing ad on focus:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [debouncedRefresh]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // CSS-based approach: Inject CSS rules to force new tabs
  useEffect(() => {
    const styleId = 'force-new-tab-styles';
    
    // Remove existing styles if any
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create and inject CSS
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .google-ad-banner a[href],
      [id*="gpt-ad"] a[href],
      .google-ad-banner *[onclick],
      [id*="gpt-ad"] *[onclick] {
        pointer-events: none !important;
      }
      
      .google-ad-banner,
      [id*="gpt-ad"] {
        cursor: pointer;
      }
    `;
    
    document.head.appendChild(style);
    
    // Add click handler to the ad container itself
    const handleAdContainerClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const adContainer = target.closest('.google-ad-banner, [id*="gpt-ad"]');
      
      if (adContainer) {
        event.preventDefault();
        event.stopPropagation();
        
        // Find any URL in the ad container
        let url = '';
        
        console.log('Searching for URL in ad container:', adContainer);
        
        // Look for any href attributes first (most common)
        const hrefElement = adContainer.querySelector('a[href]');
        if (hrefElement) {
          url = (hrefElement as HTMLAnchorElement).href;
          console.log('Found URL in href:', url);
        }
        
        // Look for data attributes that might contain URLs
        if (!url) {
          const dataUrl = adContainer.querySelector('[data-url], [data-href], [data-link]');
          if (dataUrl) {
            url = (dataUrl as any).dataset.url || (dataUrl as any).dataset.href || (dataUrl as any).dataset.link;
            console.log('Found URL in data attribute:', url);
          }
        }
        
        // Look for onclick attributes
        if (!url) {
          const onclickElement = adContainer.querySelector('[onclick*="http"]');
          if (onclickElement) {
            const onclick = onclickElement.getAttribute('onclick');
            if (onclick) {
              const urlMatch = onclick.match(/https?:\/\/[^\s'"]+/);
              if (urlMatch) {
                url = urlMatch[0];
                console.log('Found URL in onclick:', url);
              }
            }
          }
        }
        
        // Look for any element with a URL-like attribute
        if (!url) {
          const allElements = adContainer.querySelectorAll('*');
          for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i] as HTMLElement;
            const attributes = element.attributes;
            
            for (let j = 0; j < attributes.length; j++) {
              const attr = attributes[j];
              if (attr.value && attr.value.includes('http') && (attr.value.includes('://'))) {
                const urlMatch = attr.value.match(/https?:\/\/[^\s'"]+/);
                if (urlMatch) {
                  url = urlMatch[0];
                  console.log('Found URL in attribute', attr.name, ':', url);
                  break;
                }
              }
            }
            if (url) break;
          }
        }
        
        if (url) {
          console.log('Ad clicked, opening in new tab:', url);
          
          // Track ad click event
          trackEvent('ad_click', geolocation, {
            ad_slot: adSlot,
            ad_format: adFormat,
            page: window.location.pathname
          });
          
          // Open in new tab
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }
    };
    
    // Add global click listener
    document.addEventListener('click', handleAdContainerClick, true);
    
    return () => {
      // Remove styles
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
      
      // Remove event listener
      document.removeEventListener('click', handleAdContainerClick, true);
    };
  }, [adSlot, adFormat, geolocation]);

  // Also keep the local click handler as backup
  useEffect(() => {
    if (adRef.current) {
      adRef.current.addEventListener('click', handleAdClick);
      return () => {
        if (adRef.current) {
          adRef.current.removeEventListener('click', handleAdClick);
        }
      };
    }
  }, [handleAdClick]);

  return (
    <div className={`google-ad-banner ${className}`}>
      <div
        ref={adRef}
        id={adElementId}
        style={{
          display: adSize ? 'block' : 'none',
          height: adSize ? `${adSize[1]}px` : '50px',
          width: '100%',
          maxWidth: adSize ? `${adSize[0]}px` : '100%',
          margin: '0 auto'
        }}
      />
    </div>
  );
});

export default GoogleAdBanner; 