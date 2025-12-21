# 🚀 Deploy SpaceBorne Car Hire to Netlify - Simple Guide

This guide will walk you through deploying your application to Netlify with MongoDB Atlas in **simple steps**.

---

## Prerequisites Checklist

Before you start, make sure you have:

- ✅ **MongoDB Atlas account** with a cluster created
- ✅ **GitHub account** with your code pushed to a repository
- ✅ **Netlify account** (free) - Sign up at [netlify.com](https://www.netlify.com/)

---

## Step 1: Configure MongoDB Atlas Network Access

MongoDB Atlas needs to allow connections from Netlify's servers.

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Select your project (e.g., "spaceborne")
4. Click **Network Access** in the left sidebar
5. Click **Add IP Address** button
6. Select **"ALLOW ACCESS FROM ANYWHERE"**
7. It will show `0.0.0.0/0` - Click **Confirm**

> **Why?** Netlify uses dynamic IPs, so we need to allow all IPs. Your database is still secure - protected by username/password in the connection string.

---

## Step 2: Get Your MongoDB Connection String

You'll need this for Netlify environment variables.

1. In MongoDB Atlas, click **Database** in the left sidebar
2. Click **Connect** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

5. **IMPORTANT**: Replace `<password>` with your actual database password

**Your connection string should be:**
```
mongodb+srv://<username>:<password>@<cluster>/<db>
```

---

## Step 3: Push Your Code to GitHub

If you haven't already:

```bash
# Navigate to your project
cd d:\car-hire-main123\car-hire-main123\car-hire-main

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for Netlify deployment"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

> If you already have the code on GitHub, just make sure your latest changes are pushed.

---

## Step 4: Connect GitHub to Netlify

1. Go to [netlify.com](https://www.netlify.com/)
2. Click **Sign Up** (or **Log In** if you have an account)
3. Choose **"Sign up with GitHub"** (recommended)
4. Authorize Netlify to access your GitHub account

---

## Step 5: Import Your Project

1. In Netlify dashboard, click **"Add new site"**
2. Choose **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Authorize Netlify if prompted
5. Find and select your **car-hire** repository
6. Configure the build settings:

   **Site settings:**
   - **Branch to deploy**: `main` (or your default branch)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

7. **DON'T click Deploy yet!** Click **"Add environment variables"** first

---

## Step 6: Add Environment Variables

These are the **REQUIRED** variables for your app to work:

Click **"Add environment variables"** and add these one by one:

### Required Variables:

| Variable Name | Value | Scopes |
|--------------|-------|--------|
| `MONGODB_URI` | Your MongoDB connection string from Step 2 | ✅ Builds, ✅ Functions |
| `DB_NAME` | `car-hire` | ✅ Builds, ✅ Functions |
| `JWT_SECRET` | Generate using command below | ✅ Builds, ✅ Functions |
| `NODE_VERSION` | `18` | ✅ Builds, ✅ Functions |

### Generate JWT_SECRET:

Open a terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET` value.

### Optional M-Pesa Variables (if you use payments):

| Variable Name | Value | Scopes |
|--------------|-------|--------|
| `MPESA_CONSUMER_KEY` | Your M-Pesa consumer key | ✅ Builds, ✅ Functions |
| `MPESA_CONSUMER_SECRET` | Your M-Pesa secret | ✅ Builds, ✅ Functions |
| `MPESA_PASSKEY` | Your M-Pesa passkey | ✅ Builds, ✅ Functions |
| `MPESA_SHORTCODE` | Your business shortcode | ✅ Builds, ✅ Functions |
| `MPESA_ENV` | `sandbox` or `production` | ✅ Builds, ✅ Functions |

> **IMPORTANT**: For each variable, make sure BOTH "Builds" and "Functions" scopes are checked!

---

## Step 7: Deploy Your Site

1. After adding all environment variables, click **"Deploy [site-name]"**
2. Wait for the deployment to complete (usually 2-5 minutes)
3. You'll see the build logs in real-time
4. When complete, you'll see **"Site is live"** ✅

Your site will be available at: `https://random-name-12345.netlify.app`

---

## Step 8: Test Your Deployment

### Test 1: Database Connection

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

✅ If you see this, your backend is working!

### Test 2: Frontend

1. Visit your site: `https://your-site.netlify.app`
2. Check if:
   - ✅ Homepage loads
   - ✅ Vehicle listings display
   - ✅ Images load correctly
   - ✅ You can browse different pages
   - ✅ Admin login works (if you have admin credentials)

---

## Step 9: Custom Domain (Optional)

Want to use your own domain like `spaceborne.co.ke`?

1. In Netlify dashboard, go to **Site configuration** → **Domain management**
2. Click **"Add a domain"**
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Netlify will automatically provision SSL certificate (HTTPS)

---

## 🎉 You're Live!

Your application is now deployed and accessible worldwide!

**Your deployment includes:**
- ✅ Frontend hosted on Netlify's global CDN
- ✅ Backend running as serverless functions
- ✅ Connected to MongoDB Atlas cloud database
- ✅ Automatic HTTPS/SSL
- ✅ Automatic deployments on GitHub push

---

## Continuous Deployment

Every time you push changes to GitHub, Netlify will automatically:
1. Detect the changes
2. Build your project
3. Deploy the new version
4. Update your live site

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main

# Netlify automatically deploys!
```

---

## 🐛 Troubleshooting

### Build Failed

**Check:**
1. Build logs in Netlify dashboard
2. Make sure `package.json` has all dependencies
3. Test build locally: `npm run build`

### Database Connection Failed

**Check:**
1. MongoDB Atlas Network Access has `0.0.0.0/0`
2. `MONGODB_URI` in Netlify environment variables is correct
3. Database user has read/write permissions

### API Returns 404

**Check:**
1. Environment variables have "Functions" scope enabled
2. `netlify/functions/api.js` file exists
3. Check function logs in Netlify dashboard

### Images Not Loading

**Check:**
1. Images are stored in MongoDB (not local filesystem)
2. Check browser console for CORS errors
3. Test image endpoint directly

---

## 📊 Monitoring Your Site

### View Logs

1. Go to Netlify dashboard
2. Click **Functions** tab
3. Click on **api** function
4. View real-time logs

### Check Deploys

1. Go to **Deploys** tab
2. See all deployment history
3. Rollback if needed

---

## 🔐 Security Checklist

- ✅ Environment variables stored in Netlify (not in code)
- ✅ `.env` files in `.gitignore`
- ✅ Strong JWT_SECRET (32+ characters)
- ✅ MongoDB protected by username/password
- ✅ HTTPS enabled automatically
- ✅ Rate limiting configured
- ✅ Security headers enabled

---

## 💰 Netlify Free Tier Limits

Your free tier includes:
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ 125K function execution hours/month
- ✅ Unlimited sites
- ✅ Free SSL certificates

**Perfect for:**
- Development and testing
- Low to medium traffic sites
- Startups and MVPs

---

## 🆘 Need Help?

**Netlify Support:**
- Community Forum: https://answers.netlify.com/
- Documentation: https://docs.netlify.com/

**MongoDB Support:**
- Community Forum: https://www.mongodb.com/community/forums/
- Documentation: https://docs.mongodb.com/

---

## Quick Reference: Environment Variables

Copy and paste these into Netlify (replace values):

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<db>
DB_NAME=car-hire
JWT_SECRET=[generate-with-node-command]
NODE_VERSION=18
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

**Congratulations! Your SpaceBorne Car Hire application is now live! 🎉**
