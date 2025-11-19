import mixpanel from '../services/mixpanel.ts';

const USER_ID_KEY = 'qc_user_id';

/**
 * Generate a unique user ID
 */
const generateUserId = (): string => {
  // Generate a random string with timestamp for uniqueness
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `qc_${timestamp}_${randomStr}`;
};

/**
 * Get or create a user ID for the current user
 */
export const getUserId = (): string => {
  try {
    // First try to get existing user ID from localStorage
    let userId = localStorage.getItem(USER_ID_KEY);
    
    if (!userId) {
      // Check if Mixpanel has a distinct ID
      const mixpanelUserId = mixpanel.get_distinct_id();
      
      if (mixpanelUserId && mixpanelUserId !== 'anonymous') {
        // Use Mixpanel's distinct ID
        userId = `mp_${mixpanelUserId}`;
      } else {
        // Generate a new user ID
        userId = generateUserId();
      }
      
      // Store the user ID
      localStorage.setItem(USER_ID_KEY, userId);
      
      // Also set it in Mixpanel if not already set
      if (!mixpanelUserId || mixpanelUserId === 'anonymous') {
        mixpanel.identify(userId);
      }
    }
    
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    // Fallback to a simple generated ID
    return generateUserId();
  }
};

/**
 * Get Mixpanel user ID if available
 */
export const getMixpanelUserId = (): string | null => {
  try {
    const mixpanelUserId = mixpanel.get_distinct_id();
    return mixpanelUserId && mixpanelUserId !== 'anonymous' ? mixpanelUserId : null;
  } catch (error) {
    console.error('Error getting Mixpanel user ID:', error);
    return null;
  }
};

/**
 * Set user ID in Mixpanel
 */
export const setMixpanelUserId = (userId: string): void => {
  try {
    mixpanel.identify(userId);
  } catch (error) {
    console.error('Error setting Mixpanel user ID:', error);
  }
};

/**
 * Get user ID for API headers
 * Returns both the main user ID and Mixpanel user ID if available
 */
export const getUserIdsForHeaders = (): { userId: string; mixpanelUserId?: string; cleanUserId: string } => {
  const userId = getUserId();
  const mixpanelUserId = getMixpanelUserId();
  
  // Get a clean user ID that doesn't depend on Mixpanel
  const cleanUserId = getCleanUserId();
  
  return {
    userId,
    mixpanelUserId: mixpanelUserId || undefined,
    cleanUserId
  };
};

/**
 * Get a clean user ID that doesn't depend on Mixpanel
 * This is useful for building features without Mixpanel dependency
 */
export const getCleanUserId = (): string => {
  try {
    // First try to get existing clean user ID from localStorage
    let cleanUserId = localStorage.getItem('qc_clean_user_id');
    
    if (!cleanUserId) {
      // Generate a new clean user ID
      cleanUserId = generateUserId();
      localStorage.setItem('qc_clean_user_id', cleanUserId);
    }
    
    return cleanUserId;
  } catch (error) {
    console.error('Error getting clean user ID:', error);
    // Fallback to a simple generated ID
    return generateUserId();
  }
}; 