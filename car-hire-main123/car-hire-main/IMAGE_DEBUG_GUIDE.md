# Image Loading Debug Guide

## What We Fixed

1. **Backend Routes** - Changed to use relative URLs (`/api/vehicles/:id/image`) instead of absolute URLs
2. **Route Mounting** - Routes mounted at both `/api/vehicles` and `/vehicles` paths
3. **MongoDB Image Serving** - Enhanced to properly handle Buffer data from MongoDB
4. **Comprehensive Logging** - Added detailed logging to track image requests

## How to Debug Image Loading Issues

### Step 1: Check Netlify Function Logs

1. Go to your Netlify dashboard
2. Navigate to **Functions** → **api** → **Logs**
3. Look for these log messages when an image is requested:

```
[Image Debug] Event received: { path: ..., rawPath: ..., ... }
[Request] GET /api/vehicles/123/image
[Vehicle Image Route] Request for vehicle ID: 123, index: 0
[Vehicle Image Route] Vehicle found, has image: true, images count: 1
[Vehicle Image Route] Sending image, size: 123456 bytes, type: image/jpeg
```

### Step 2: Check Browser Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by **Img** or search for `/api/vehicles`
4. Click on a failed image request
5. Check:
   - **Status Code**: Should be 200 (not 404 or 500)
   - **Request URL**: Should be `/api/vehicles/{id}/image`
   - **Response Headers**: Should include `Content-Type: image/jpeg` (or similar)
   - **Response**: Should show image data (not JSON error)

### Step 3: Verify MongoDB Connection

Test the database connection:
```
https://your-site.netlify.app/api/test-db
```

Should return:
```json
{
  "success": true,
  "dbStatus": "connected",
  "collectionsStatus": {
    "vehicles": "has data"
  }
}
```

### Step 4: Verify Images Exist in MongoDB

Check if vehicles have image data:
1. Look at the vehicle list API response: `/api/vehicles`
2. Each vehicle should have `imageUrl: "/api/vehicles/{id}/image"`
3. If `imageUrl` is missing or null, the vehicle has no image

### Step 5: Test Image Route Directly

Try accessing an image directly in browser:
```
https://your-site.netlify.app/api/vehicles/{vehicle-id}/image
```

Should display the image (not 404 or error page).

## Common Issues & Solutions

### Issue 1: 404 Not Found
**Symptoms**: Network tab shows 404 status
**Possible Causes**:
- Route not matching (check logs for path)
- Vehicle ID doesn't exist
- Image data missing in MongoDB

**Solution**: Check Netlify logs to see what path is being requested

### Issue 2: 500 Internal Server Error
**Symptoms**: Network tab shows 500 status
**Possible Causes**:
- MongoDB connection issue
- Buffer conversion error
- Missing image data

**Solution**: Check Netlify function logs for error details

### Issue 3: Images Show as Broken/Placeholder
**Symptoms**: Images don't load, show placeholder
**Possible Causes**:
- CORS issue
- Content-Type header wrong
- Buffer not being sent correctly

**Solution**: Check response headers in Network tab

### Issue 4: Route Not Matching
**Symptoms**: 404 or route not found in logs
**Possible Causes**:
- serverless-http path stripping issue
- Route mounting order

**Solution**: Routes are mounted at both `/api/vehicles` and `/vehicles` - check logs to see which path is being used

## What the Logs Tell You

### If you see:
```
[Image Debug] Event received: { path: "/vehicles/123/image" }
```
→ serverless-http stripped the `/api` prefix - this is handled by mounting at both paths

### If you see:
```
[Vehicle Image Route] Vehicle not found: 123
```
→ The vehicle ID doesn't exist in MongoDB

### If you see:
```
[Vehicle Image Route] Vehicle found, has image: false
```
→ The vehicle exists but has no image data in MongoDB

### If you see:
```
[Vehicle Image Route] Sending image, size: 0 bytes
```
→ Image Buffer is empty - image wasn't saved correctly

## Next Steps

1. **Deploy the updated code** to Netlify
2. **Check the logs** when images fail to load
3. **Share the log output** if images still don't work
4. **Verify MongoDB** has image data for your vehicles

## Quick Test

Run this in browser console on your site:
```javascript
// Test if image route works
fetch('/api/vehicles')
  .then(r => r.json())
  .then(vehicles => {
    if (vehicles.length > 0) {
      const firstVehicle = vehicles[0];
      console.log('First vehicle:', firstVehicle);
      console.log('Image URL:', firstVehicle.imageUrl);
      
      // Try to load the image
      const img = new Image();
      img.onload = () => console.log('✅ Image loaded successfully!');
      img.onerror = () => console.error('❌ Image failed to load');
      img.src = firstVehicle.imageUrl;
    }
  });
```

This will tell you:
- If vehicles API works
- What imageUrl is being returned
- If the image can actually load





