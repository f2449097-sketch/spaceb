# 🚀 Netlify Deployment - Quick Action Checklist

Follow these steps in order to deploy your SpaceBorne Car Hire app to Netlify.

---

## ✅ **Pre-Deployment Checklist**

### **1. MongoDB Atlas Setup** (15 minutes)

- [ ] Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
- [ ] Create a new cluster (Free tier - M0 Sandbox)
- [ ] Create database user with username and password
- [ ] Go to **Network Access** → Allow `0.0.0.0/0` (allow all IPs)
- [ ] Get connection string from **Connect** → **Connect your application**
- [ ] Copy connection string and save it (you'll need this for Netlify)

**Connection string format**:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

### **2. Generate JWT Secret** (1 minute)

Run this command in your terminal to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] Copy the output (it will be a long random string)
- [ ] Save it somewhere safe (you'll add it to Netlify)

---

### **3. (Optional) M-Pesa Setup** (30 minutes - Skip if not using payments)

- [ ] Register at [Daraja Portal](https://developer.safaricom.co.ke/)
- [ ] Create a new app
- [ ] Get **Consumer Key** from "My Apps"
- [ ] Get **Consumer Secret** from "My Apps"
- [ ] Get **Passkey** from "Lipa Na M-Pesa Online" section
- [ ] Note your **Shortcode** (use `174379` for sandbox testing)

---

### **4. Push Code to GitHub** (5 minutes)

If not already done:

```bash
# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Netlify deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

- [ ] Code pushed to GitHub
- [ ] Repository is accessible

---

## 🌐 **Netlify Deployment Steps**

### **Step 1: Create Netlify Site** (5 minutes)

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Select your repository
5. Netlify should auto-detect settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

- [ ] Netlify site created
- [ ] Build settings confirmed

---

### **Step 2: Add Environment Variables** (10 minutes)

On your Netlify site:

1. Go to **Site configuration** → **Environment variables**
2. Click **"Add a variable"** for each of these:

#### **Required Variables**:

| Key | Value | Scopes |
|-----|-------|--------|
| `MONGODB_URI` | Your MongoDB connection string | ✅ Builds, ✅ Functions |
| `DB_NAME` | `car-hire` | ✅ Builds, ✅ Functions |
| `JWT_SECRET` | Your generated secret (from step 2 above) | ✅ Builds, ✅ Functions |

#### **Optional M-Pesa Variables** (if using payments):

| Key | Value | Scopes |
|-----|-------|--------|
| `MPESA_CONSUMER_KEY` | From Daraja Portal | ✅ Builds, ✅ Functions |
| `MPESA_CONSUMER_SECRET` | From Daraja Portal | ✅ Builds, ✅ Functions |
| `MPESA_PASSKEY` | From Daraja Portal | ✅ Builds, ✅ Functions |
| `MPESA_SHORTCODE` | `174379` (sandbox) | ✅ Builds, ✅ Functions |
| `MPESA_ENV` | `sandbox` or `production` | ✅ Builds, ✅ Functions |
| `MPESA_CALLBACK_URL` | `https://YOUR-SITE.netlify.app/api/mpesa/callback` | ✅ Builds, ✅ Functions |

**⚠️ IMPORTANT**: For `MPESA_CALLBACK_URL`, replace `YOUR-SITE` with your actual Netlify site name (you'll get this after first deployment).

- [ ] All required environment variables added
- [ ] All variables have "Functions" scope enabled
- [ ] M-Pesa variables added (if using payments)

---

### **Step 3: Deploy** (3-5 minutes)

1. Click **"Deploy site"**
2. Wait for build to complete (watch the deploy log)
3. Build should succeed and show deployment URL

- [ ] Build completed successfully
- [ ] Deployment URL received (e.g., `https://amazing-name-123456.netlify.app`)

---

### **Step 4: Update M-Pesa Callback** (2 minutes - Skip if not using M-Pesa)

After first deployment:

1. Copy your Netlify URL: `https://YOUR-SITE.netlify.app`
2. Go to **Site configuration** → **Environment variables**
3. Update `MPESA_CALLBACK_URL` to: `https://YOUR-SITE.netlify.app/api/mpesa/callback`
4. Trigger a new deployment (Deploys → Trigger deploy)

- [ ] Callback URL updated
- [ ] Redeployed

---

## 🧪 **Post-Deployment Testing**

### **Test 1: Database Connection**

Visit in your browser:
```
https://YOUR-SITE.netlify.app/api/test-db
```

**Expected**: JSON response with `"success": true` and `"dbStatus": "connected"`

- [ ] Database test passed

---

### **Test 2: Frontend Loads**

Visit:
```
https://YOUR-SITE.netlify.app
```

**Expected**: Your car hire website loads

- [ ] Frontend loads successfully
- [ ] No console errors in browser

---

### **Test 3: API Endpoints**

Test in browser or use curl:

```bash
# Test vehicles API
https://YOUR-SITE.netlify.app/api/vehicles

# Test adventures API
https://YOUR-SITE.netlify.app/api/adventures
```

**Expected**: JSON data returned

- [ ] Vehicles API works
- [ ] Adventures API works

---

### **Test 4: Full User Flow**

1. Browse vehicles on homepage
2. View vehicle details
3. Try to book a vehicle (enter details)
4. Check admin login (if you have admin credentials)

- [ ] Homepage displays vehicles
- [ ] Vehicle details page works
- [ ] Booking form appears
- [ ] Admin login functional

---

## 🎉 **Success Criteria**

Your deployment is successful when:

- ✅ Site loads at Netlify URL
- ✅ `/api/test-db` returns success
- ✅ Vehicles display on homepage
- ✅ No console errors
- ✅ Database operations work
- ✅ (Optional) M-Pesa payments process

---

## 🆘 **Troubleshooting**

### **Build Fails**

**Check Netlify deploy logs for**:
- Missing dependencies → Check `package.json`
- Build command errors → Verify `npm run build` works locally
- Environment variable issues → Ensure all required vars are set

### **Functions Don't Work**

**Fix**:
1. Check function logs in Netlify (Functions tab)
2. Verify environment variables have "Functions" scope
3. Ensure MongoDB allows `0.0.0.0/0` in Network Access
4. Check `MONGODB_URI` is correct (no extra spaces)

### **Database Connection Fails**

**Common causes**:
- Wrong MongoDB URI
- IP not whitelisted (must allow `0.0.0.0/0`)
- Wrong database user credentials
- Network Access not configured

**Fix**:
- Double-check MongoDB Atlas Network Access settings
- Verify connection string in Netlify env vars
- Test connection string locally first

---

## 📝 **Next Steps After Deployment**

### **1. Custom Domain** (Optional)

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Netlify: **Domain management** → **Add custom domain**
3. Update DNS records as instructed
4. Wait for DNS propagation (5-30 minutes)
5. Enable HTTPS (automatic with Netlify)

### **2. Set Up MongoDB Data**

If your database is empty, you need to populate it:

- Add sample vehicles
- Create admin users
- Add adventure packages
- Test bookings

### **3. Configure M-Pesa for Production**

When ready for real payments:

1. Get production credentials from Safaricom
2. Update Netlify env vars:
   - Change `MPESA_ENV` to `production`
   - Update keys to production keys
   - Change shortcode to your Till Number
3. Redeploy

### **4. Monitor and Optimize**

- Check Netlify Analytics
- Monitor function execution times
- Review error logs
- Set up alerts for failures

---

## 📊 **Deployment Time Estimate**

| Step | Time |
|------|------|
| MongoDB setup | 15 min |
| M-Pesa setup (optional) | 30 min |
| Push to GitHub | 5 min |
| Netlify setup | 5 min |
| Add env variables | 10 min |
| Deploy and test | 10 min |
| **Total (without M-Pesa)** | **45 min** |
| **Total (with M-Pesa)** | **75 min** |

---

## ✅ **Final Checklist**

Before considering deployment complete:

- [ ] Site is live and accessible
- [ ] All API endpoints tested
- [ ] Database connection verified
- [ ] Frontend displays data correctly
- [ ] User flows tested (browse, view, book)
- [ ] Admin panel accessible (if applicable)
- [ ] M-Pesa payments tested (if enabled)
- [ ] No errors in browser console
- [ ] No errors in Netlify function logs
- [ ] Custom domain configured (if desired)
- [ ] SSL/HTTPS working
- [ ] MongoDB data populated
- [ ] Documentation updated with live URL

---

## 🎯 **Your Deployed URLs**

After deployment, you'll have:

- **Frontend**: `https://YOUR-SITE.netlify.app`
- **API Base**: `https://YOUR-SITE.netlify.app/api`
- **Test Endpoint**: `https://YOUR-SITE.netlify.app/api/test-db`
- **Vehicles API**: `https://YOUR-SITE.netlify.app/api/vehicles`
- **Admin**: `https://YOUR-SITE.netlify.app/admin` (or your admin route)

---

**Good luck with your deployment! 🚀**

If you encounter any issues, refer to the comprehensive guides in:
- `NETLIFY_DEPLOYMENT.md`
- `ENVIRONMENT_VARIABLES.md`
- `PRODUCTION_CHECKLIST.md`
