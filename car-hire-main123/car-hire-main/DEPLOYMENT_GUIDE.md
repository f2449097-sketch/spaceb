# 🚀 COMPLETE DEPLOYMENT GUIDE

## 📋 PRE-DEPLOYMENT CHECKLIST

### What You Have: ✅
- [x] Complete codebase
- [x] Working sandbox M-Pesa integration
- [x] MongoDB database (Atlas)
- [x] Test credentials verified
- [x] Payment flow tested

### What You Need: ❌
- [ ] M-Pesa Business Account (Till/Paybill)
- [ ] Production API credentials
- [ ] Domain name (optional)
- [ ] Hosting account
- [ ] SSL certificate

---

## 🎯 DEPLOYMENT ROADMAP

### Phase 1: Local Testing (DONE ✅)
**Status:** Complete
**What works:** Sandbox payments, test transactions

### Phase 2: Get Business Credentials (1-2 weeks)
**Goal:** Get ability to receive real money

**Steps:**
1. Get Till Number from Safaricom
2. Request production API access
3. Wait for approvals

### Phase 3: Deploy Backend (1 day)
**Goal:** Host your API server

**Options:**
- Heroku
- Railway
- DigitalOcean
- Your own VPS

### Phase 4: Deploy Frontend (1 day)
**Goal:** Host your website

**Options:**
- Vercel (Recommended)
- Netlify
- GitHub Pages

### Phase 5: Go Live! (1 day)
**Goal:** Accept real payments

**Steps:**
1. Update production credentials
2. Test with small amounts
3. Launch to customers

---

## 📍 DETAILED STEPS

### STEP 1: Get M-Pesa Till Number (Same Day)

**Visit Safaricom Shop:**

1. **What to bring:**
   - National ID
   - Phone number (Safaricom preferred)
   - Optional: Business permit

2. **What to say:**
   > "I want to apply for Lipa na M-Pesa Till Number for my business"

3. **Fill application form:**
   - Business name: SpaceBorne Car Hire
   - Business type: Car rental
   - Phone number: 0759477359
   - ID number: Your ID

4. **Get approved:**
   - Usually same day
   - Receive SMS with your Till Number
   - Example: `5123456`

5. **Save your Till Number:**
   - Write it down
   - You'll need it for production config

**Alternative: Paybill (if you have registered business)**
- Requires: Certificate of Registration, KRA PIN
- Takes: 2-4 weeks
- Better for: Large businesses

---

### STEP 2: Request Production API Access (1-2 weeks)

**On Daraja Portal:**

1. **Login:**
   - Go to https://developer.safaricom.co.ke/
   - Login with your account

2. **Open your app:**
   - Click "My Apps"
   - Click on "Spaceborne" app

3. **Request production:**
   - Click "Add API Products"
   - Select "Lipa Na M-Pesa Online" (NOT sandbox)
   - Click "Request Production Access"

4. **Fill details:**
   - Business name: SpaceBorne Car Hire
   - Business type: Car rental services
   - Shortcode: Your Till Number from Step 1
   - Website: Your website URL (can be temporary)
   - Callback URL: Will update later

5. **Submit documents:**
   - Business registration (if have)
   - ID copy
   - Till Number confirmation

6. **Wait for approval:**
   - Safaricom reviews (1-2 weeks)
   - You'll get email notification
   - Portal status changes to "Approved"

7. **Get credentials:**
   - Production Consumer Key
   - Production Consumer Secret
   - Production Passkey

---

### STEP 3: Deploy Backend API

#### Option A: Deploy to Railway (Recommended - Easy)

1. **Create Railway account:**
   ```
   Visit: https://railway.app/
   Sign up with GitHub
   ```

2. **Create new project:**
   ```
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select "backend" folder
   ```

3. **Add environment variables:**
   ```
   In Railway dashboard:
   - Go to Variables tab
   - Add all .env variables:
     PORT=3001
     MONGODB_URI=your_mongodb_uri
     MPESA_CONSUMER_KEY=your_production_key
     MPESA_CONSUMER_SECRET=your_production_secret
     MPESA_PASSKEY=your_passkey
     MPESA_SHORTCODE=your_till_number
     MPESA_CALLBACK_URL=https://your-app.railway.app/api/mpesa/callback
     MPESA_ENV=production
   ```

4. **Deploy:**
   ```
   - Railway auto-deploys
   - Get your URL: https://your-app.railway.app
   - Test: https://your-app.railway.app/api/test
   ```

#### Option B: Deploy to Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   cd backend
   heroku create spaceborne-api
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set PORT=3001
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set MPESA_CONSUMER_KEY=your_key
   heroku config:set MPESA_CONSUMER_SECRET=your_secret
   heroku config:set MPESA_PASSKEY=your_passkey
   heroku config:set MPESA_SHORTCODE=your_till
   heroku config:set MPESA_CALLBACK_URL=https://spaceborne-api.herokuapp.com/api/mpesa/callback
   heroku config:set MPESA_ENV=production
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   heroku logs --tail
   ```

---

### STEP 4: Deploy Frontend

#### Option A: Deploy to Vercel (Recommended)

1. **Create Vercel account:**
   ```
   Visit: https://vercel.com/
   Sign up with GitHub
   ```

2. **Import project:**
   ```
   - Click "Add New Project"
   - Import from GitHub
   - Select your repository
   - Root directory: ./ (or where frontend is)
   ```

3. **Configure:**
   ```
   Framework Preset: React (or auto-detect)
   Build Command: npm run build
   Output Directory: build (or dist)
   ```

4. **Environment variables:**
   ```
   Add in Vercel dashboard:
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

5. **Deploy:**
   ```
   - Click "Deploy"
   - Wait for build
   - Get URL: https://your-site.vercel.app
   - Custom domain: Add in settings (optional)
   ```

#### Option B: Deploy to Netlify

1. **Create account:** https://netlify.com/
2. **Drag & drop:**
   - Build locally: `npm run build`
   - Drag `build` folder to Netlify
3. **Or connect Git:**
   - Import from GitHub
   - Auto-deploy on push

---

### STEP 5: Configure Domain & SSL

#### Option A: Use Provided Domain (Free)
```
Vercel: your-site.vercel.app (FREE SSL included)
Railway: your-app.railway.app (FREE SSL included)
Netlify: your-site.netlify.app (FREE SSL included)
```

#### Option B: Custom Domain (Recommended)

1. **Buy domain:**
   ```
   - Kenya Website Experts: KES 1,500/year
   - Domain.co.ke: KES 1,200/year
   - GoDaddy: KES 1,800/year
   Choose: spaceborne.co.ke or yourname.com
   ```

2. **Add to hosting:**
   ```
   Vercel:
   - Dashboard > Domains
   - Add spaceborne.co.ke
   - Update DNS records at registrar
   - SSL auto-configured
   
   Netlify:
   - Site settings > Domain management
   - Add custom domain
   - Update DNS
   - SSL auto-configured
   ```

3. **Update callback URL:**
   ```env
   MPESA_CALLBACK_URL=https://spaceborne.co.ke/api/mpesa/callback
   ```

---

### STEP 6: Update Production Configuration

1. **Update backend/.env:**
   ```env
   PORT=3001
   MONGODB_URI=mongodb+srv://your_connection_string
   
   # Production M-Pesa Credentials
   MPESA_CONSUMER_KEY=YOUR_PRODUCTION_KEY_FROM_DARAJA
   MPESA_CONSUMER_SECRET=YOUR_PRODUCTION_SECRET_FROM_DARAJA
   MPESA_PASSKEY=YOUR_PRODUCTION_PASSKEY_FROM_DARAJA
   MPESA_SHORTCODE=YOUR_TILL_NUMBER_FROM_SAFARICOM
   MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
   MPESA_ENV=production
   ```

2. **Update frontend config:**
   ```javascript
   // src/config/api.js
   export const API_BASE_URL = 'https://your-backend-url.railway.app/api';
   ```

3. **Redeploy:**
   ```bash
   git add .
   git commit -m "Update production config"
   git push
   # Vercel/Netlify auto-deploys
   ```

---

### STEP 7: Test in Production

**Safety First: Test with Small Amounts**

1. **Test transaction:**
   - Go to your website
   - Book a vehicle
   - Try payment of KES 10
   - Check your phone for STK push
   - Enter PIN
   - Verify success page

2. **Check money received:**
   - Check your M-Pesa wallet/business account
   - Verify KES 10 received (minus transaction fee)
   - Check booking status in database

3. **Verify booking update:**
   - Login to admin panel
   - Check booking status = "confirmed"
   - Verify payment details saved

4. **Test callback:**
   - Check backend logs
   - Verify callback received from M-Pesa
   - Check payment reference saved

---

### STEP 8: Monitor & Launch

1. **Setup monitoring:**
   ```javascript
   // Add error tracking (optional)
   - Sentry: https://sentry.io/
   - LogRocket: https://logrocket.com/
   ```

2. **Enable notifications:**
   ```javascript
   // Get notified of new bookings
   - Email notifications
   - SMS alerts
   - WhatsApp messages
   ```

3. **Soft launch:**
   - Test with friends/family
   - Offer discount for first 10 customers
   - Collect feedback

4. **Full launch:**
   - Announce on social media
   - Share with your network
   - Start marketing!

---

## 🔧 CONFIGURATION FILES SUMMARY

### Backend `.env` (Production):
```env
PORT=3001
MONGODB_URI=mongodb+srv://...
MPESA_CONSUMER_KEY=prod_key_here
MPESA_CONSUMER_SECRET=prod_secret_here
MPESA_PASSKEY=prod_passkey_here
MPESA_SHORTCODE=your_till_number
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
MPESA_ENV=production
```

### Frontend config:
```javascript
// src/config/api.js
export const API_BASE_URL = 'https://your-api.com/api';
```

---

## 💰 COST SUMMARY

| Item | Cost | Frequency |
|------|------|-----------|
| Till Number | FREE | One-time |
| Production API | FREE | N/A |
| Domain (.co.ke) | KES 1,500 | Per year |
| Backend Hosting (Railway) | FREE - KES 500 | Per month |
| Frontend Hosting (Vercel) | FREE | N/A |
| SSL Certificate | FREE | Auto-renewed |
| M-Pesa Fees | ~1% | Per transaction |

**Total Initial:** FREE - KES 1,500
**Monthly:** FREE - KES 500

---

## ⏱️ TIMELINE

| Task | Duration | Depends On |
|------|----------|------------|
| Get Till Number | Same day | Visit Safaricom |
| Production API Approval | 1-2 weeks | Till Number |
| Deploy Backend | 1-2 hours | None |
| Deploy Frontend | 1-2 hours | Backend |
| Get Domain | 30 mins | Credit card |
| Configure DNS | 24-48 hours | Domain |
| Test & Launch | 1 day | All above |

**Fastest Path:** 2 weeks (waiting for API approval)
**Realistic:** 3 weeks (with testing)

---

## 🆘 TROUBLESHOOTING

### Issue: "Invalid Access Token" in Production
**Fix:**
- Verify you're using PRODUCTION credentials (not sandbox)
- Check MPESA_ENV=production
- Restart backend server

### Issue: Callback not received
**Fix:**
- Verify callback URL is HTTPS (not HTTP)
- Check URL is publicly accessible
- Test with curl or Postman
- Check backend logs

### Issue: Payment succeeds but booking not updated
**Fix:**
- Check database connection
- Verify booking ID in callback
- Check backend console for errors
- Ensure PATCH endpoint working

### Issue: Domain not connecting
**Fix:**
- Wait 24-48 hours for DNS propagation
- Verify DNS records correct
- Check CNAME points to hosting
- Clear browser cache

---

## ✅ POST-LAUNCH CHECKLIST

### Week 1:
- [ ] Monitor all transactions
- [ ] Check booking confirmations
- [ ] Verify money received
- [ ] Test customer support
- [ ] Fix any bugs

### Month 1:
- [ ] Collect customer feedback
- [ ] Optimize payment flow
- [ ] Add features requested
- [ ] Scale hosting if needed
- [ ] Review transaction costs

### Ongoing:
- [ ] Keep credentials secure
- [ ] Monitor server uptime
- [ ] Backup database regularly
- [ ] Update security patches
- [ ] Renew domain annually

---

## 📞 SUPPORT CONTACTS

**M-Pesa Issues:**
- Email: apisupport@safaricom.co.ke
- Phone: 0722 002 200

**Hosting (Railway):**
- Discord: https://discord.gg/railway

**Hosting (Vercel):**
- Support: https://vercel.com/support

**Domain Issues:**
- Your registrar support

---

**You're ready to deploy! 🚀**

Start with Step 1 (Get Till Number) THIS WEEK!
