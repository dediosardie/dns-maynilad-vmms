# Google Maps API Setup Guide

## Automatic Distance Calculation Feature

The Trip Module now supports automatic distance calculation between origin and destination addresses using Google Maps Distance Matrix API.

## Setup Instructions

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Distance Matrix API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Distance Matrix API"
   - Click "Enable"

4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 2. Configure API Key Restrictions (Recommended)

For security, restrict your API key:

1. Click on your API key in the Credentials page
2. Under "Application restrictions":
   - Select "HTTP referrers (websites)"
   - Add your domain (e.g., `https://yourdomain.com/*`)
   - For local development, add: `http://localhost:*`

3. Under "API restrictions":
   - Select "Restrict key"
   - Check only "Distance Matrix API"

### 3. Add API Key to Your Application

Open `src/components/TripForm.tsx` and replace the placeholder:

```typescript
// Line 14
const GOOGLE_MAPS_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

**⚠️ Important Security Note:**
- Never commit your API key to version control
- For production, use environment variables
- Consider implementing the API calls through your backend server

### 4. Using Environment Variables (Recommended)

For better security, use environment variables:

1. Create `.env` file in project root:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

2. Add to `.gitignore`:
```
.env
.env.local
```

3. Update `TripForm.tsx`:
```typescript
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
```

4. Restart your development server after adding environment variables

## How It Works

1. **User Types Addresses**: When both origin and destination are filled
2. **Debounced Calculation**: Waits 1 second after typing stops
3. **API Call**: Sends request to Google Maps Distance Matrix API
4. **Auto-Fill**: Updates the distance_km field automatically
5. **Manual Override**: Users can still manually edit the distance if needed

## Features

- ✅ Automatic distance calculation
- ✅ 1-second debounce to avoid excessive API calls
- ✅ Loading indicator during calculation
- ✅ Error handling with helpful messages
- ✅ Manual distance input as fallback
- ✅ Distance displayed in kilometers

## Pricing

Google Maps Distance Matrix API pricing (as of 2024):
- **Free tier**: $200 monthly credit (≈40,000 requests)
- **After free tier**: $0.005 per request

Monitor your usage in [Google Cloud Console](https://console.cloud.google.com/billing)

## Troubleshooting

### "Google Maps API key not configured"
- Add your API key to `TripForm.tsx`

### "Could not calculate distance"
- Check if addresses are valid and complete
- Ensure Distance Matrix API is enabled
- Verify API key restrictions allow your domain

### CORS Errors
- Note: Direct browser calls to Google Maps API may have CORS issues
- For production, implement API calls through your backend server
- Use a proxy or serverless function if needed

## Alternative: Backend Implementation

For production environments, consider implementing distance calculation on your backend:

```typescript
// backend/api/calculate-distance.ts
export async function calculateDistance(origin: string, destination: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&units=metric&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  return response.json();
}
```

Then call your backend API from the frontend instead of Google directly.

## Support

For issues with Google Maps API:
- [Distance Matrix API Documentation](https://developers.google.com/maps/documentation/distance-matrix)
- [Google Maps Platform Support](https://developers.google.com/maps/support)
