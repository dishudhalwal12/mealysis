import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
mixpanel.init('ba4bae69ac701992557bf8e68b50c4aa', {
  debug: process.env.NODE_ENV !== 'production',
  track_pageview: true,
  persistence: 'localStorage'
});

export default mixpanel;