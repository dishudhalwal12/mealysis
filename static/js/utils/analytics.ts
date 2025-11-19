import mixpanel from '../services/mixpanel.ts';
import { Geolocation } from '../context/GeolocationContext.tsx';

interface BaseTrackingProps {
  timestamp?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}

// Helper to format properties for GA4
const formatGAProperties = (properties: BaseTrackingProps) => {
  const gaProperties: { [key: string]: any } = {};
  
  Object.entries(properties).forEach(([key, value]) => {
    // GA4 doesn't accept arrays or objects, so stringify them
    if (Array.isArray(value) || typeof value === 'object') {
      gaProperties[key] = JSON.stringify(value);
    } else {
      gaProperties[key] = value;
    }
  });

  return gaProperties;
};

export const trackEvent = (
  eventName: string, 
  geolocation: Geolocation | null,
  properties: BaseTrackingProps = {}
) => {
  const baseProperties = {
    timestamp: new Date().toISOString(),
    location: geolocation?.name,
    latitude: geolocation?.latitude,
    longitude: geolocation?.longitude,
    url: window.location.href,
    ...properties
  };

  // Track in Mixpanel
  mixpanel.track(eventName, baseProperties);

  // Track in Google Analytics
  if (window.gtag) {
    try {
      window.gtag('event', eventName, {
        ...formatGAProperties(baseProperties),
        send_to: process.env.REACT_APP_GA_MEASUREMENT_ID
      });
    } catch (error) {
      console.error('GA tracking failed:', error);
    }
  }
};

// Add TypeScript support for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParameters: object
    ) => void;
  }
}