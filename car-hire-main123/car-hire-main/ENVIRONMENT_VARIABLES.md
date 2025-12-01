# Environment Variables Configuration for Netlify Deployment

This document details all environment variables required for deploying the SpaceBorne Car Hire application on Netlify.

## 🔧 Required Environment Variables

### MongoDB Database Configuration

#### `MONGODB_URI` (Required)
- **Description**: MongoDB Atlas connection string
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
- **Where to get it**: 
  1. Login to [MongoDB Atlas](https://cloud.mongodb.com/)
  2. Go to your cluster
  3. Click "Connect" → "Connect your application"
  4. Copy the connection string
  5. Replace `<password>` with your actual password
- **Example**: `mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`

#### `DB_NAME` (Optional)
- **Description**: Database name within MongoDB
- **Default**: `car-hire`
- **Format**: String (alphanumeric, hyphens, underscores)
- **Example**: `car-hire` or `spaceborne-production`

### Authentication & Security

#### `JWT_SECRET` (Required)
- **Description**: Secret key for JWT token generation and validation
- **Security**: Must be a long, random, unpredictable string
- **Minimum length**: 32 characters
- **How to generate**:
  ```bash
  # Option 1: Using Node.js
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  
  # Option 2: Using OpenSSL
  openssl rand -hex 32
  
  # Option 3: Online generator
  # Visit: https://www.random.org/strings/
  ```
- **Example**: `a3f8b2c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2`
- **⚠️ Important**: Never commit this to version control or share publicly

### M-Pesa Payment Integration (Optional but Recommended)

These variables are required only if you want to enable M-Pesa payment functionality.

#### `MPESA_CONSUMER_KEY` (Required for payments)
- **Description**: Safaricom Daraja API Consumer Key
- **Environment**: Use sandbox for testing, production for live
- **Where to get it**:
  1. Login to [Daraja Portal](https://developer.safaricom.co.ke/)
  2. Go to "My Apps"
  3. Select your app
  4. Copy the Consumer Key (Production or Sandbox)
- **Example**: `xvPZt4vG8K9lMr2qN3pO4sR5tU6vW7yX`

#### `MPESA_CONSUMER_SECRET` (Required for payments)
- **Description**: Safaricom Daraja API Consumer Secret
- **Where to get it**: Same location as Consumer Key
- **Example**: `A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6`

#### `MPESA_PASSKEY` (Required for payments)
- **Description**: Lipa Na M-Pesa Online Passkey
- **Where to get it**: 
  1. Daraja Portal → My Apps → Your App
  2. Under "Lipa Na M-Pesa Online" section
  3. Copy the Passkey
- **Example**: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`

#### `MPESA_SHORTCODE` (Required for payments)
- **Description**: Business shortcode (Till Number or Paybill)
- **Format**: Numeric, typically 5-7 digits
- **Where to get it**:
  - **Sandbox**: Use `174379` (Daraja test shortcode)
  - **Production**: Your Till Number from Safaricom
- **Example**: 
  - Sandbox: `174379`
  - Production: `5123456`

#### `MPESA_CALLBACK_URL` (Required for payments)
- **Description**: URL where M-Pesa will send payment notifications
- **Format**: Must be HTTPS (Netlify provides this automatically)
- **Structure**: `https://your-site-name.netlify.app/api/mpesa/callback`
- **Examples**:
  - Development: `https://spaceborne-dev.netlify.app/api/mpesa/callback`
  - Production: `https://spaceborne.netlify.app/api/mpesa/callback`
  - Custom domain: `https://www.spaceborne.co.ke/api/mpesa/callback`
- **⚠️ Important**: Update this after deployment with your actual Netlify URL

#### `MPESA_ENV` (Required for payments)
- **Description**: M-Pesa environment mode
- **Options**: `sandbox` or `production`
- **Default**: `sandbox`
- **When to use**:
  - `sandbox`: For testing with fake money
  - `production`: For real payments with real money
- **Example**: `production`

### Application Configuration

#### `NODE_ENV` (Automatically set by Netlify)
- **Description**: Application environment
- **Options**: `development`, `production`
- **Note**: Netlify sets this automatically, no manual configuration needed

#### `PORT` (Not needed for Netlify)
- **Description**: Server port (used only for local development)
- **Note**: Netlify serverless functions don't use ports

---

## 📝 How to Configure in Netlify

### Step 1: Access Environment Variables

1. Login to [Netlify](https://app.netlify.com/)
2. Select your site
3. Navigate to **Site configuration** → **Environment variables**
4. Click **Add a variable**

### Step 2: Add Variables

For each required variable:

1. Click **Add a variable**
2. Enter the **Key** (e.g., `MONGODB_URI`)
3. Enter the **Value** (your actual value)
4. Select **Scopes**:
   - ✅ **Builds**: Required for build-time access
   - ✅ **Functions**: Required for runtime access
   - ✅ **Post processing**: Usually not needed
5. Click **Create variable**

### Step 3: Minimum Required Configuration

At minimum, configure these for a working deployment:

```
MONGODB_URI = mongodb+srv://your-connection-string
DB_NAME = car-hire
JWT_SECRET = your-secure-random-string-here
```

### Step 4: Optional M-Pesa Configuration

If enabling payments, add:

```
MPESA_CONSUMER_KEY = your-consumer-key
MPESA_CONSUMER_SECRET = your-consumer-secret
MPESA_PASSKEY = your-passkey
MPESA_SHORTCODE = your-shortcode
MPESA_CALLBACK_URL = https://your-site.netlify.app/api/mpesa/callback
MPESA_ENV = sandbox
```

---

## 🔐 Security Best Practices

### DO ✅
- ✅ Use strong, randomly generated values for `JWT_SECRET`
- ✅ Regularly rotate sensitive credentials (every 3-6 months)
- ✅ Use different credentials for development and production
- ✅ Store credentials in Netlify's environment variables (encrypted)
- ✅ Use production M-Pesa credentials only when ready for real payments
- ✅ Monitor your MongoDB Atlas access logs
- ✅ Enable MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Netlify)

### DON'T ❌
- ❌ Never commit `.env` files to Git
- ❌ Never share credentials in chat, email, or screenshots
- ❌ Never use production credentials in development
- ❌ Never hardcode credentials in your code
- ❌ Never share your `JWT_SECRET` publicly
- ❌ Never use weak or predictable secrets

---

## 🌐 MongoDB Atlas Network Configuration

Netlify functions run on dynamic IP addresses, so you must configure MongoDB Atlas to accept connections from any IP.

### Steps:

1. Login to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere**
5. It will add: `0.0.0.0/0` (all IPs)
6. Click **Confirm**

**Security Note**: While this allows all IPs, your database is still protected by:
- Username/password authentication
- Encrypted connection strings
- Private credentials stored in Netlify

---

## 🧪 Testing Configuration

### Test Database Connection

After deploying, verify your configuration:

```bash
# Visit this URL in your browser:
https://your-site.netlify.app/api/test-db
```

**Expected Response** (if everything works):
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

### Test M-Pesa Configuration

If you configured M-Pesa:

```bash
# Test credentials
curl https://your-site.netlify.app/api/mpesa/test
```

---

## 📋 Configuration Checklist

Before going live, verify:

- [ ] `MONGODB_URI` is set and valid
- [ ] `DB_NAME` is set (or using default)
- [ ] `JWT_SECRET` is a strong random string (32+ characters)
- [ ] MongoDB Atlas allows `0.0.0.0/0` in Network Access
- [ ] Test endpoint `/api/test-db` returns success
- [ ] (Optional) M-Pesa credentials are configured if using payments
- [ ] (Optional) `MPESA_CALLBACK_URL` matches your deployed URL
- [ ] All environment variables have both "Builds" and "Functions" scopes enabled
- [ ] Sensitive credentials are NOT in your Git repository
- [ ] No `.env` files are committed to version control

---

## 🆘 Troubleshooting

### Issue: "MongoServerError: bad auth"
**Cause**: Wrong username or password in `MONGODB_URI`  
**Fix**: 
1. Verify credentials in MongoDB Atlas
2. Ensure password doesn't contain special characters (URL encode if needed)
3. Check database user has proper permissions

### Issue: "MongooseServerSelectionError: connection refused"
**Cause**: IP address not whitelisted in MongoDB Atlas  
**Fix**: Add `0.0.0.0/0` to Network Access in MongoDB Atlas

### Issue: "Invalid access token" (M-Pesa)
**Cause**: Wrong consumer key/secret or wrong environment  
**Fix**:
1. Verify `MPESA_CONSUMER_KEY` and `MPESA_CONSUMER_SECRET`
2. Check `MPESA_ENV` matches your credentials (sandbox vs production)
3. Ensure credentials are from the correct app in Daraja Portal

### Issue: "Callback URL not reachable" (M-Pesa)
**Cause**: Wrong callback URL or not using HTTPS  
**Fix**:
1. Verify `MPESA_CALLBACK_URL` is correct
2. Ensure it uses HTTPS (not HTTP)
3. Test URL is publicly accessible

### Issue: Environment variables not loading
**Cause**: Wrong scopes or deployment needed  
**Fix**:
1. Ensure "Functions" scope is enabled for each variable
2. Trigger a new deployment after adding variables
3. Check Netlify function logs for errors

---

## 📞 Support Resources

- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Netlify Environment Variables**: https://docs.netlify.com/environment-variables/overview/
- **Safaricom Daraja**: https://developer.safaricom.co.ke/
- **Daraja Support**: apisupport@safaricom.co.ke

---

**Last Updated**: November 2024  
**Version**: 1.0.0
