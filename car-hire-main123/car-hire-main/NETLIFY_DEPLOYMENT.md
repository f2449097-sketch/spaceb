# 🚀 Netlify Deployment Guide for SpaceBorne Car Hire

This guide walks you through deploying the complete SpaceBorne Car Hire application (frontend + backend) to Netlify as a unified serverless application.

## 📋 Overview

The deployment architecture:
- **Frontend**: React app built with Vite → Static files served by Netlify CDN
- **Backend**: Express API → Netlify serverless functions
- **Database**: MongoDB Atlas → Cloud-hosted (already configured)
- **Payments**: M-Pesa integration → Works seamlessly with serverless

## ✅ Prerequisites

Before deployment, ensure you have:

- [ ] MongoDB Atlas account with cluster created
- [ ] MongoDB connection string (`MONGODB_URI`)
- [ ] Network Access configured in MongoDB Atlas (add `0.0.0.0/0`)
- [ ] GitHub repository with your code
- [ ] Netlify account (free tier works)
- [ ] (Optional) M-Pesa API credentials for payments

## 🎯 Quick Deployment Steps

### 1. Install Required Dependency

The serverless function requires the `serverless-http` package. Install it:

```bash
cd backend
npm install
```

This has already been added to `backend/package.json`.

### 2. Create Netlify Account

1. Go to [netlify.com](https://www.netlify.com/)
2. Click **Sign Up**
3. Choose **Sign up with GitHub** (recommended)
4. Authorize Netlify to access your repositories

### 3. Import Your Project

1. Click **Add new site** → **Import an existing project**
2. Choose **GitHub**
3. Authorize Netlify to access your repositories
4. Select your `car-hire-main` repository
5. Configure build settings:
   - **Branch to deploy**: `main` (or your default branch)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

6. Click **Deploy site**

### 4. Configure Environment Variables

#### Navigate to Environment Variables

1. Go to your site dashboard
2. Click **Site configuration** → **Environment variables**
3. Click **Add a variable**

#### Required Variables (Minimum)

Add these variables one by one:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `DB_NAME` | `car-hire` | Database name (default: car-hire) |
| `JWT_SECRET` | `[random-string]` | Secure random string (32+ chars) |

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Optional M-Pesa Variables (For Payments)

| Variable | Value | Description |
|----------|-------|-------------|
| `MPESA_CONSUMER_KEY` | Your consumer key | From Daraja Portal |
| `MPESA_CONSUMER_SECRET` | Your consumer secret | From Daraja Portal |
| `MPESA_PASSKEY` | Your passkey | From Daraja Portal |
| `MPESA_SHORTCODE` | Your Till/Paybill | Business shortcode |
| `MPESA_CALLBACK_URL` | `https://your-site.netlify.app/api/mpesa/callback` | Update after deployment |
| `MPESA_ENV` | `sandbox` or `production` | Environment mode |

**Important**: For each variable, ensure **both** scopes are enabled:
- ✅ **Builds** (for build-time access)
- ✅ **Functions** (for runtime access)

### 5. Configure MongoDB Atlas Network Access

Netlify functions use dynamic IPs, so you must allow all IPs:

1. Login to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere**
5. Confirm (adds `0.0.0.0/0`)

**Note**: Your database is still secure - protected by username/password in the connection string.

### 6. Redeploy with Environment Variables

After adding all environment variables:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete (2-5 minutes)

### 7. Verify Deployment

#### Test Database Connection

Visit: `https://your-site.netlify.app/api/test-db`

**Expected response:**
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

#### Test Frontend

1. Visit your site URL: `https://your-site.netlify.app`
2. Browse vehicles
3. Check admin panel login
4. Verify images load correctly

#### Test M-Pesa (If Configured)

1. Make a test booking
2. Proceed to payment
3. Check STK push prompt on your phone
4. Complete payment
5. Verify booking status updates

---

## 🔧 How It Works

### Architecture Overview

```
User Request
    ↓
Frontend (Static React App on Netlify CDN)
    ↓
API Request to /api/*
    ↓
Netlify Redirects → /.netlify/functions/api
    ↓
Serverless Function (netlify/functions/api.js)
    ↓
Express App (backend/server.js routes - UNCHANGED)
    ↓
MongoDB Atlas
    ↓
Response to User
```

### Key Files

1. **`netlify.toml`** - Netlify configuration
   - Build settings
   - Redirect rules
   - Headers configuration

2. **`netlify/functions/api.js`** - Serverless wrapper
   - Wraps existing Express app
   - Handles MongoDB connection pooling
   - Routes all requests to backend routes

3. **`backend/server.js`** - Express app (UNCHANGED)
   - All routes remain identical
   - No modifications needed
   - Works exactly as before

4. **`public/_redirects`** - Fallback routing
   - Backup routing rules
   - Ensures SPA works correctly

### Connection Pooling

The serverless function intelligently manages MongoDB connections:
- First request: Creates new connection
- Subsequent requests: Reuses existing connection
- Cold starts: Minimal (connection caching)
- Timeout: 30 seconds (sufficient for most operations)

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain

1. Go to **Site configuration** → **Domain management**
2. Click **Add a domain**
3. Enter your domain (e.g., `spaceborne.co.ke`)
4. Follow DNS configuration instructions

### Update DNS Records

Add these records at your domain registrar:

**Option A: Netlify DNS (Recommended)**
- Change nameservers to Netlify's nameservers

**Option B: External DNS**
- Add A record or CNAME pointing to Netlify

### Update Callback URL

After adding custom domain:

1. Update environment variable:
   ```
   MPESA_CALLBACK_URL=https://spaceborne.co.ke/api/mpesa/callback
   ```

2. Trigger new deployment

### SSL Certificate

Netlify automatically provisions SSL certificates:
- Provisioned via Let's Encrypt
- Auto-renewed every 90 days
- Zero configuration needed
- HTTPS enforced automatically

---

## 🔄 Continuous Deployment

### Automatic Deployments

Netlify automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Netlify automatically:
# 1. Detects the push
# 2. Runs build command
# 3. Deploys new version
# 4. Updates live site
```

### Deploy Contexts

Netlify supports different deploy contexts:

1. **Production** - Main branch (e.g., `main`)
2. **Deploy Previews** - Pull requests
3. **Branch Deploys** - Other branches

Configure in **Site configuration** → **Build & deploy**

### Build Notifications

Get notified of deployments:

1. Go to **Site configuration** → **Notifications**
2. Add email, Slack, or webhook notifications
3. Choose events (deploy started, succeeded, failed)

---

## 📊 Monitoring & Logs

### Function Logs

View serverless function logs:

1. Go to **Functions** tab
2. Click on `api` function
3. View real-time logs
4. Check errors and execution time

### Analytics

Monitor site usage:

1. Enable Netlify Analytics (optional paid feature)
2. Or integrate Google Analytics in your frontend
3. Or use free alternative (Plausible, Umami)

### Error Tracking

For production monitoring:

1. Add [Sentry](https://sentry.io/) (optional)
2. Configure in `netlify/functions/api.js`
3. Get real-time error notifications

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Error**: `Command failed with exit code 1`

**Solutions**:
1. Check build logs for specific error
2. Ensure all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check Node version matches (18+)

### Issue: Function Timeout

**Error**: `Function execution timed out`

**Solutions**:
1. Check MongoDB connection string
2. Verify Network Access in Atlas
3. Optimize slow database queries
4. Check function logs for bottlenecks

### Issue: Environment Variables Not Working

**Error**: `undefined` or missing variables

**Solutions**:
1. Verify variables are added in Netlify dashboard
2. Check both "Builds" and "Functions" scopes enabled
3. Trigger new deployment after adding variables
4. Check variable names match exactly (case-sensitive)

### Issue: MongoDB Connection Failed

**Error**: `MongoServerSelectionError`

**Solutions**:
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas Network Access allows `0.0.0.0/0`
3. Ensure database user has correct permissions
4. Test connection string locally first

### Issue: API Routes 404

**Error**: API requests return 404

**Solutions**:
1. Check `netlify.toml` redirects configuration
2. Verify `netlify/functions/api.js` exists
3. Check function logs for errors
4. Test `/api/test-db` endpoint first

### Issue: Images Not Loading

**Error**: Vehicle/adventure images return 404

**Solutions**:
1. Check images are stored in MongoDB (not local filesystem)
2. Verify `/images/vehicles/:id` route works
3. Check CORS headers in function
4. Test image endpoint directly

### Issue: M-Pesa Callback Not Received

**Error**: Payment succeeds but booking not updated

**Solutions**:
1. Verify `MPESA_CALLBACK_URL` is correct
2. Ensure URL uses HTTPS (not HTTP)
3. Check callback URL is publicly accessible
4. Test callback endpoint with Postman
5. Check function logs for callback requests

---

## 💰 Pricing & Limits

### Netlify Free Tier

**Includes**:
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Unlimited serverless function invocations
- ✅ 125K function execution hours
- ✅ Free SSL certificates
- ✅ Deploy previews
- ✅ Form submissions (100/month)

**Perfect for**:
- Development and testing
- Low to medium traffic sites
- Startups and MVPs

### When to Upgrade

Consider upgrading if:
- Traffic exceeds 100 GB/month (~300K visitors)
- Need team collaboration features
- Want priority support
- Need advanced analytics

**Pro Plan**: $19/month
- 400 GB bandwidth
- Background functions
- Password protection
- Split testing

---

## 🔐 Security Checklist

Before going live:

- [ ] Strong `JWT_SECRET` configured (32+ characters)
- [ ] MongoDB Atlas Network Access properly configured
- [ ] Production M-Pesa credentials used (not sandbox)
- [ ] Environment variables stored in Netlify (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enabled (automatic on Netlify)
- [ ] Rate limiting configured (already in code)
- [ ] Helmet security headers enabled (already in code)
- [ ] MongoDB sanitization enabled (already in code)
- [ ] Regular database backups scheduled (MongoDB Atlas)

---

## 📚 Additional Resources

- **Netlify Docs**: https://docs.netlify.com/
- **Netlify Functions**: https://docs.netlify.com/functions/overview/
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Environment Variables Guide**: See `ENVIRONMENT_VARIABLES.md`
- **M-Pesa Setup**: See `MPESA_SETUP_GUIDE.md`
- **Network Access**: See `NETWORK_ACCESS_GUIDE.md`

---

## 🆘 Support

### Netlify Support

- **Community Forum**: https://answers.netlify.com/
- **Discord**: https://discord.com/invite/netlify
- **Email**: support@netlify.com (paid plans)

### MongoDB Support

- **Community Forum**: https://www.mongodb.com/community/forums/
- **Documentation**: https://docs.mongodb.com/

### M-Pesa Support

- **Email**: apisupport@safaricom.co.ke
- **Phone**: 0722 002 200

---

## ✅ Deployment Checklist

Use this checklist before going live:

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Network Access configured (0.0.0.0/0)
- [ ] Environment variables documented
- [ ] M-Pesa credentials obtained (if needed)

### Netlify Setup
- [ ] Netlify account created
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables added (all with Functions scope)
- [ ] First deployment successful

### Testing
- [ ] `/api/test-db` returns success
- [ ] Frontend loads correctly
- [ ] Vehicle listings display
- [ ] Images load properly
- [ ] Admin panel login works
- [ ] Booking system functional
- [ ] M-Pesa payments work (if configured)

### Post-Deployment
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Callback URL updated for M-Pesa
- [ ] Monitoring/analytics enabled
- [ ] Backup strategy in place
- [ ] Documentation updated

---

**Congratulations! Your SpaceBorne Car Hire application is now live on Netlify! 🎉**

All backend functionality remains unchanged - the serverless architecture is completely transparent to your existing code.
