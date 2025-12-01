# ⚡ Netlify Quick Start Guide

**Deploy SpaceBorne Car Hire to Netlify in 15 minutes**

## 🎯 What You Need

1. **MongoDB Atlas Account** (free tier is fine)
   - Connection string ready
   - Network Access set to `0.0.0.0/0`

2. **Netlify Account** (free tier is fine)
   - Sign up at [netlify.com](https://www.netlify.com/)

3. **GitHub Repository** 
   - Your code pushed to GitHub

## 🚀 5-Step Deployment

### Step 1: Install Dependencies (2 minutes)

```bash
cd backend
npm install
```

This installs `serverless-http` package (already in `package.json`).

### Step 2: Connect to Netlify (2 minutes)

1. Go to [app.netlify.com](https://app.netlify.com/)
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub** and select your repository
4. Build settings (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
5. Click **Deploy site**

### Step 3: Add Environment Variables (5 minutes)

Go to **Site configuration** → **Environment variables**

Add these (minimum required):

```
MONGODB_URI = mongodb+srv://your-connection-string
DB_NAME = car-hire
JWT_SECRET = [generate-random-32-char-string]
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Important**: Enable both "Builds" and "Functions" scopes for each variable!

### Step 4: Configure MongoDB Atlas (3 minutes)

1. Login to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to **Network Access**
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Save

### Step 5: Redeploy & Test (3 minutes)

1. In Netlify dashboard, go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete
4. Test: Visit `https://your-site.netlify.app/api/test-db`

**Expected response:**
```json
{
  "success": true,
  "dbStatus": "connected",
  "environment": "netlify-serverless"
}
```

## ✅ Done!

Your site is live! 

- **Frontend**: `https://your-site.netlify.app`
- **API**: `https://your-site.netlify.app/api/*`
- **Test DB**: `https://your-site.netlify.app/api/test-db`

## 🎨 Optional: Add Custom Domain

1. Go to **Site configuration** → **Domain management**
2. Click **Add a domain**
3. Follow DNS configuration steps
4. SSL certificate auto-provisions (free!)

## 💳 Optional: Enable M-Pesa Payments

Add these environment variables:

```
MPESA_CONSUMER_KEY = your-key
MPESA_CONSUMER_SECRET = your-secret
MPESA_PASSKEY = your-passkey
MPESA_SHORTCODE = your-till-number
MPESA_CALLBACK_URL = https://your-site.netlify.app/api/mpesa/callback
MPESA_ENV = sandbox
```

Then redeploy.

## 📚 Full Documentation

- **Complete Guide**: See `NETLIFY_DEPLOYMENT.md`
- **Environment Variables**: See `ENVIRONMENT_VARIABLES.md`
- **How It Works**: See architecture section in `NETLIFY_DEPLOYMENT.md`

## 🐛 Troubleshooting

**Build fails?**
- Check build logs in Netlify
- Run `npm run build` locally to test

**Database connection fails?**
- Verify `MONGODB_URI` is correct
- Check Network Access in MongoDB Atlas allows `0.0.0.0/0`

**API returns 404?**
- Verify environment variables have "Functions" scope enabled
- Redeploy after adding variables

**Need help?**
- Netlify Community: https://answers.netlify.com/
- MongoDB Forums: https://www.mongodb.com/community/forums/

---

**That's it! You're live on Netlify! 🎉**
