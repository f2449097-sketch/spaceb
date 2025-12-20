# 🚀 SpaceBorne Car Hire - Netlify Deployment Guide

## ✅ What's Already Done

Your project is **fully prepared** for Netlify deployment:

- ✅ **Frontend built**: Production-optimized React app in `dist/` directory (1.27 MB bundle, gzipped to 272 KB)
- ✅ **Serverless function ready**: [`netlify/functions/api.js`](file:///c:/Users/Administrator/Documents/car-hire-main123/car-hire-main123/car-hire-main/netlify/functions/api.js) wraps entire Express backend
- ✅ **Configuration complete**: [`netlify.toml`](file:///c:/Users/Administrator/Documents/car-hire-main123/car-hire-main123/car-hire-main/netlify.toml) properly configured
- ✅ **Dependencies declared**: [`netlify/functions/package.json`](file:///c:/Users/Administrator/Documents/car-hire-main123/car-hire-main123/car-hire-main/netlify/functions/package.json) includes all backend dependencies

---

## 📋 Prerequisites Checklist

Before deploying, make sure you have:

- [ ] **Netlify Account** - Sign up at [netlify.com](https://netlify.com) (free tier is sufficient)
- [ ] **MongoDB Atlas Account** - Get one at [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
- [ ] **MongoDB Database** - Created with your car hire data (vehicles, adventures, admins)
- [ ] **GitHub/GitLab Account** (Optional - recommended for automatic deployments)

---

## 🚀 Deployment Methods

Choose the method that works best for you:

### **Method A: Netlify CLI** (Recommended - Fastest)

#### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Login to Netlify

```bash
netlify login
```

This will open your browser to authenticate.

#### 3. Initialize Your Site

```bash
# In your project root
cd c:\Users\Administrator\Documents\car-hire-main123\car-hire-main123\car-hire-main

# Initialize Netlify site
netlify init
```

Follow the prompts:
- **Create & configure a new site**: Choose this option
- **Team**: Select your team (usually your username)
- **Site name**: Enter a name (e.g., `spaceborne-car-hire`) or leave blank for random
- **Build command**: `npm run build` (should auto-detect)
- **Directory to deploy**: `dist` (should auto-detect)
- **Netlify functions folder**: `netlify/functions` (should auto-detect)

#### 4. Deploy to Production

```bash
netlify deploy --prod
```

Your site is now live! The CLI will show you the URL.

---

### **Method B: Netlify Dashboard** (Alternative - More Visual)

#### 1. Push Code to GitHub (if not already)

```bash
# Initialize git if needed
git init
git add .
git commit -m "Ready for Netlify deployment"

# Create a repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

#### 2. Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** (or your git provider)
4. Select your repository

#### 3. Configure Build Settings

Netlify should auto-detect from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

If not auto-detected, enter them manually.

#### 4. Deploy Site

Click **"Deploy site"** and wait 2-5 minutes for the build.

---

## 🔐 Configure Environment Variables

After deployment, you **MUST** add environment variables in Netlify.

### Step 1: Navigate to Environment Variables

1. In Netlify Dashboard, go to your site
2. Click **"Site configuration"** (left sidebar)
3. Click **"Environment variables"**
4. Click **"Add a variable"**

### Step 2: Add Required Variables

> [!IMPORTANT]
> For **each variable**, make sure to enable both **"Builds"** and **"Functions"** scopes!

#### **Required Variables** (3 total)

| Variable Name | Value | How to Get |
|--------------|-------|------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/...` | MongoDB Atlas → Cluster → Connect → Connection string |
| `DB_NAME` | `car-hire` | Use this exact value |
| `JWT_SECRET` | `[64-character random string]` | Generate with command below |

**Generate JWT Secret**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste as `JWT_SECRET` value.

#### **Optional Variables** (M-Pesa Payments - 6 total)

Only add these if you want to enable M-Pesa mobile payments:

| Variable Name | Value | How to Get |
|--------------|-------|------------|
| `MPESA_CONSUMER_KEY` | Your consumer key | [Daraja Portal](https://developer.safaricom.co.ke/) → My Apps |
| `MPESA_CONSUMER_SECRET` | Your consumer secret | Daraja Portal → My Apps |
| `MPESA_PASSKEY` | Your passkey | Daraja Portal → Lipa Na M-Pesa Online |
| `MPESA_SHORTCODE` | `174379` (sandbox) | Use `174379` for testing |
| `MPESA_CALLBACK_URL` | `https://YOUR-SITE.netlify.app/api/mpesa/callback` | Replace `YOUR-SITE` with your actual Netlify domain |
| `MPESA_ENV` | `sandbox` | Use `sandbox` for testing, `production` for live |

> [!NOTE]
> You can deploy **without** M-Pesa variables first to test basic functionality, then add them later.

### Step 3: Redeploy After Adding Variables

After adding environment variables:

**CLI Method**:
```bash
netlify deploy --prod
```

**Dashboard Method**:
1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

---

## 🗄️ MongoDB Atlas Configuration

> [!IMPORTANT]
> Netlify serverless functions use dynamic IP addresses, so you must allow all IPs in MongoDB Atlas.

### Configure Network Access

1. Login to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Network Access"** (left sidebar under "Security")
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"**
5. Confirm `0.0.0.0/0` is added
6. Click **"Confirm"**

**Don't worry about security** - Your database is still protected by username/password authentication in the connection string.

### Get Your Connection String

1. In MongoDB Atlas, click your cluster
2. Click **"Connect"**
3. Choose **"Connect your application"**
4. **Driver**: Node.js, **Version**: 4.1 or later
5. Copy the connection string
6. Replace `<password>` with your actual MongoDB user password
7. Use this as your `MONGODB_URI` value in Netlify

---

## ✅ Testing Your Deployment

After deployment completes, run these tests:

### 1. Test Frontend

Visit your Netlify URL (shown in dashboard or CLI output):
```
https://YOUR-SITE-NAME.netlify.app
```

**Expected**: Homepage loads with SpaceBorne branding and navigation

### 2. Test Database Connection

Visit:
```
https://YOUR-SITE-NAME.netlify.app/api/test-db
```

**Expected Response**:
```json
{
  "success": true,
  "dbStatus": "connected",
  "environment": "netlify-serverless",
  "collectionsStatus": {
    "vehicles": "has data",
    "adventures": "has data",
    "admins": "has data"
  }
}
```

### 3. Test API Endpoints

**Vehicles API**:
```
https://YOUR-SITE-NAME.netlify.app/api/vehicles
```

Should return JSON array of vehicles.

**Adventures API**:
```
https://YOUR-SITE-NAME.netlify.app/api/adventures
```

Should return JSON array of adventure packages.

### 4. Test Navigation

- Click through different pages (Vehicles, Adventures, Contact)
- Check that images load properly
- Verify all routes work (React Router)

### 5. Test Admin Login (if credentials set up)

1. Navigate to `/admin/login`
2. Enter admin credentials
3. Verify admin dashboard loads

---

## 🆘 Troubleshooting

### Issue: Build Fails

**Possible causes**:
- Missing dependencies
- Node version mismatch

**Solutions**:
```bash
# Ensure all dependencies are installed
npm install

# Test build locally
npm run build

# Check Node version (should be 18+)
node --version
```

### Issue: Function Timeout / Database Connection Fails

**Symptoms**: 
- 502 Bad Gateway errors
- Timeout errors after 10 seconds
- `api/test-db` returns error

**Solutions**:

1. **Check MongoDB Network Access**:
   - Verify `0.0.0.0/0` is allowed in MongoDB Atlas Network Access

2. **Verify MONGODB_URI**:
   - Check it's correct in Netlify environment variables
   - Ensure password doesn't have special characters (or URL-encode them)
   - Test connection string locally with MongoDB Compass

3. **Check Environment Variable Scopes**:
   - Go to Netlify → Site configuration → Environment variables
   - Each variable should have **"Functions"** scope enabled
   - If not, edit and enable it

4. **View Function Logs**:
   ```bash
   # Using CLI
   netlify functions:log api
   
   # Or in Dashboard: Netlify → Functions → api → Logs
   ```

### Issue: API Calls Return 404

**Symptoms**: Frontend loads but API calls fail with 404

**Solutions**:

1. **Check Redirects**: View [`netlify.toml`](file:///c:/Users/Administrator/Documents/car-hire-main123/car-hire-main123/car-hire-main/netlify.toml) - redirects should be configured

2. **Check Function Deployed**:
   - Netlify Dashboard → Functions tab
   - Should see `api` function listed

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Check Network tab for actual request URLs
   - Verify they're going to `/.netlify/functions/api/...`

### Issue: CORS Errors

**Symptoms**: Errors mentioning "CORS policy" in browser console

**Solutions**:

Already configured in [`api.js`](file:///c:/Users/Administrator/Documents/car-hire-main123/car-hire-main123/car-hire-main/netlify/functions/api.js#L72-L78) and [`netlify.toml`](file:///c:/Users/Administrator/Documents/car-hire-main123/car-hire-main123/car-hire-main/netlify.toml#L44-L50). If still occurring:

1. Clear browser cache
2. Try incognito/private window
3. Check that the function is returning proper CORS headers in Network tab

### Issue: Images Don't Load

**Symptoms**: Vehicle images show broken image icons

**Possible causes**:
- Images stored in MongoDB but not loading
- Image route not configured

**Solutions**:

1. Check that images are in MongoDB:
   ```
   https://YOUR-SITE.netlify.app/api/vehicles
   ```
   Look for `image.data` field in response

2. Image route is already configured in [`api.js`](file:///c:/Users/Administrator/Documents/car-hire-main123/car-hire-main123/car-hire-main/netlify/functions/api.js#L164-L186)

3. Check Network tab for image request status

---

## 📊 Project Architecture

Your deployed application consists of:

```
┌─────────────────────────────────────────────────────┐
│             USER'S BROWSER                          │
│  ┌──────────────────────────────────────┐          │
│  │  React App (SpaceBorne Car Hire)     │          │
│  │  - Vehicle Catalog                   │          │
│  │  - Adventure Packages                │          │
│  │  - Booking System                    │          │
│  │  - Admin Dashboard                   │          │
│  └──────────────────────────────────────┘          │
└────────┬──────────────────────────────────▲─────────┘
         │ 1. Requests (API calls)          │ 2. Responses (JSON)
         ▼                                  │
┌──────────────────────────────────────────┴─────────┐
│           NETLIFY CDN + EDGE NETWORK               │
│  ┌─────────────────────┐  ┌──────────────────────┐│
│  │  Static Files       │  │ Serverless Function  ││
│  │  (React App)        │  │  /netlify/functions  ││
│  │  - HTML, CSS, JS    │  │  /api.js             ││
│  │  - Images           │  │                      ││
│  │  - Fonts            │  │  ├─ Express App      ││
│  └─────────────────────┘  │  ├─ All API Routes   ││
│                           │  ├─ Auth Middleware  ││
│                           │  └─ M-Pesa Integration││
│                           └──────────┬─────────────┘│
└──────────────────────────────────────┼──────────────┘
                                       │ 3. DB Queries
                                       ▼
                          ┌────────────────────────────┐
                          │   MongoDB Atlas (Cloud)    │
                          │  ┌──────────────────────┐  │
                          │  │  Collections:        │  │
                          │  │  - vehicles          │  │
                          │  │  - adventures        │  │
                          │  │  - bookings          │  │
                          │  │  - admins            │  │
                          │  │  - messages          │  │
                          │  └──────────────────────┘  │
                          └────────────────────────────┘
```

**Request Flow**:
1. User visits site → Netlify CDN serves React app
2. User browses vehicles → React makes API call to `/api/vehicles`
3. Netlify redirects to `/.netlify/functions/api/vehicles`
4. Serverless function connects to MongoDB, fetches data
5. Function returns JSON to frontend
6. React renders vehicles with data

---

## 🎯 Quick Commands Reference

```bash
# Deploy to production
netlify deploy --prod

# Deploy to preview (draft)
netlify deploy

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin

# View function logs
netlify functions:log api

# Check build status
netlify status

# Local development with Netlify environment
netlify dev
```

---

## 🔄 Updating Your Deployed Site

After making changes to your code:

**Method 1: Automatic (if connected to GitHub)**:
```bash
git add .
git commit -m "Update description"
git push origin main
```

Netlify will automatically rebuild and redeploy.

**Method 2: Manual (using CLI)**:
```bash
# Build locally
npm run build

# Deploy
netlify deploy --prod
```

---

## 💰 Cost Breakdown (Free Tier)

Your deployment uses Netlify's **free tier**:

| Resource | Free Tier Limit | Your Usage (Estimated) |
|----------|----------------|------------------------|
| **Bandwidth** | 100 GB/month | ~1-5 GB/month (low traffic) |
| **Build Minutes** | 300 min/month | ~5 min/month (few deployments) |
| **Function Invocations** | 125,000/month | Depends on traffic |
| **Function Runtime** | 100 hours/month | Usually < 1 hour/month |

**MongoDB Atlas** also has a **free tier**:
- 512 MB storage
- Shared RAM
- Unlimited connections

Both should be sufficient for development and low-to-medium traffic production use.

---

## ✨ Next Steps

After successful deployment:

1. **Set Custom Domain** (Optional):
   - Netlify Dashboard → Domain settings → Add custom domain
   - Update your DNS records

2. **Enable Form Notifications** (Optional):
   - Netlify Dashboard → Integrations
   - Connect email or Slack for contact form submissions

3. **Set Up M-Pesa** (If needed):
   - Register at [Daraja Portal](https://developer.safaricom.co.ke/)
   - Add M-Pesa environment variables
   - Test with sandbox first (fake money)
   - Switch to production when ready

4. **Monitor Performance**:
   - Netlify Dashboard → Analytics
   - Check function execution times
   - Monitor bandwidth usage

5. **Enable Deploy Previews** (If using GitHub):
   - Netlify automatically creates preview URLs for pull requests
   - Test changes before merging to production

---

## 📚 Additional Resources

- **Your Existing Docs**: See other markdown files in project root for more details
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com/)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com/)
- **Netlify Functions**: [docs.netlify.com/functions/overview](https://docs.netlify.com/functions/overview/)
- **Deployment Issues**: [answers.netlify.com](https://answers.netlify.com/)

---

## 🎉 Summary

**You're ready to deploy!** Your project has:

- ✅ Optimized production build in `dist/` directory
- ✅ Complete serverless backend in `netlify/functions/api.js`
- ✅ Proper Netlify configuration in `netlify.toml`
- ✅ All dependencies correctly declared

**Total Deployment Time**: ~10-15 minutes (including environment variable setup)

**Choose your deployment method above and follow the steps. Good luck! 🚀**
