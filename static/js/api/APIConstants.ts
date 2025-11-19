import { generateEncryptedRequestId } from "../utils/requestIdEncryption.ts";
import { getUserIdsForHeaders } from "../utils/userId.ts";

export const API_CONSTANT = {
    // API_URL: process.env.API_URL ?? 'https://qb51dv79pd.execute-api.ap-south-1.amazonaws.com/QuickCompare',
    // API_URL: 'https://8tgg1v9pxi.execute-api.ap-south-1.amazonaws.com/default/qc-dev',
    API_URL: 'https://qp94doiea4.execute-api.ap-south-1.amazonaws.com/default/qc',
    
    // Common function to make API requests with request ID header
    async makeRequest(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<Response> {
        const requestId = generateEncryptedRequestId();
        console.log('Generated Request ID:', requestId);
        
        // Get user IDs for headers
        const { userId, mixpanelUserId, cleanUserId } = getUserIdsForHeaders();
        console.log('User ID:', userId);
        console.log('Clean User ID:', cleanUserId);
        if (mixpanelUserId) {
            console.log('Mixpanel User ID:', mixpanelUserId);
        }
        
        const defaultHeaders: Record<string, string> = {
            'X-Request-ID': requestId,
            'X-User-ID': userId,
            'X-Clean-User-ID': cleanUserId,
            ...options.headers as Record<string, string>
        };

        // Add Mixpanel user ID if available
        if (mixpanelUserId) {
            defaultHeaders['X-Mixpanel-User-ID'] = mixpanelUserId;
        }

        // Automatically get geolocation from localStorage and add to headers
        try {
            const storedGeolocation = localStorage.getItem('geolocation');
            if (storedGeolocation) {
                const geolocation = JSON.parse(storedGeolocation);
                if (geolocation) {
                    defaultHeaders['X-Geolocation-Latitude'] = geolocation.latitude?.toString() || '';
                    defaultHeaders['X-Geolocation-Longitude'] = geolocation.longitude?.toString() || '';
                    defaultHeaders['X-Geolocation-PlaceId'] = geolocation.place_id || '';
                    defaultHeaders['X-Geolocation-FormattedAddress'] = geolocation.formatted_address || '';
                    defaultHeaders['X-Geolocation-Name'] = geolocation.name || '';
                    defaultHeaders['X-Geolocation-City'] = geolocation.city || '';
                    defaultHeaders['X-Geolocation-Pincode'] = geolocation.pincode || '';
                }
            }
        } catch (error) {
            console.warn('Error parsing geolocation from localStorage:', error);
        }
        
        return fetch(`${this.API_URL}${endpoint}`, {
            ...options,
            headers: defaultHeaders
        });
    }
};