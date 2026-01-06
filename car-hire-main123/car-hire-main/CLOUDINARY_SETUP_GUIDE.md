# Cloudinary Setup Guide

This guide will walk you through setting up Cloudinary for image storage in your SpaceBorne Car Hire application.

## 📋 Prerequisites

- A Cloudinary account (free tier available)
- Node.js and npm installed
- Access to your backend `.env` file

---

## Step 1: Create a Cloudinary Account

1. **Go to Cloudinary**: Visit [https://cloudinary.com](https://cloudinary.com)
2. **Sign Up**: Click "Sign Up" (free account is sufficient)
3. **Fill in details**: 
   - Email address
   - Password
   - Company name (optional)
4. **Verify email**: Check your email and verify your account

---

## Step 2: Get Your Cloudinary Credentials

After logging into your Cloudinary dashboard:

1. **Go to Dashboard**: You'll see your account details
2. **Find your credentials** (usually displayed on the main dashboard):
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

   > ⚠️ **Important**: Keep your API Secret private! Never commit it to Git.

3. **Copy these values** - you'll need them in the next step

---

## Step 3: Install Required Packages

The packages are already in your `package.json`, but make sure they're installed:

```bash
cd car-hire-main123/car-hire-main/backend
npm install cloudinary multer-storage-cloudinary
```

**Verify installation:**
```bash
npm list cloudinary multer-storage-cloudinary
```

You should see both packages listed.

---

## Step 4: Configure Environment Variables

1. **Navigate to your backend folder**:
   ```bash
   cd car-hire-main123/car-hire-main/backend
   ```

2. **Open or create `.env` file**:
   ```bash
   # On Windows (PowerShell)
   notepad .env
   
   # On Mac/Linux
   nano .env
   ```

3. **Add your Cloudinary credentials**:
   ```env
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   CLOUDINARY_API_KEY=your-api-key-here
   CLOUDINARY_API_SECRET=your-api-secret-here
   ```

   **Example:**
   ```env
   CLOUDINARY_CLOUD_NAME=dxyz123abc
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
   ```

4. **Save the file**

---

## Step 5: Verify Configuration

Your Cloudinary configuration file is already set up at:
`backend/config/cloudinary.js`

It should look like this:
```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'car-hire',  // All images will be stored in this folder
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    transformation: [{ width: 1000, crop: 'limit' }]  // Auto-resize images
  }
});

module.exports = { cloudinary, storage };
```

✅ **This file is already configured correctly!**

---

## Step 6: Test Cloudinary Connection

Create a test script to verify everything works:

**Create file**: `backend/test-cloudinary.js`

```javascript
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test connection
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful!');
    console.log('Status:', result.status);
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  })
  .catch(error => {
    console.error('❌ Cloudinary connection failed!');
    console.error('Error:', error.message);
    console.log('\n💡 Check your .env file has:');
    console.log('   - CLOUDINARY_CLOUD_NAME');
    console.log('   - CLOUDINARY_API_KEY');
    console.log('   - CLOUDINARY_API_SECRET');
  });
```

**Run the test:**
```bash
node backend/test-cloudinary.js
```

**Expected output:**
```
✅ Cloudinary connection successful!
Status: ok
Cloud Name: your-cloud-name
```

---

## Step 7: Test Image Upload

Create a test upload script:

**Create file**: `backend/test-upload.js`

```javascript
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload a test image (replace with path to an actual image file)
const imagePath = path.join(__dirname, '../public/assets/images/no_image.png');

cloudinary.uploader.upload(imagePath, {
  folder: 'car-hire',
  public_id: 'test-upload',
  overwrite: true
})
  .then(result => {
    console.log('✅ Image uploaded successfully!');
    console.log('URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
  })
  .catch(error => {
    console.error('❌ Upload failed!');
    console.error('Error:', error.message);
  });
```

**Run the test:**
```bash
node backend/test-upload.js
```

---

## Step 8: Configure for Netlify (Production)

If deploying to Netlify, add your Cloudinary credentials to Netlify environment variables:

1. **Go to Netlify Dashboard** → Your Site → **Site Settings** → **Environment Variables**

2. **Add these variables**:
   - `CLOUDINARY_CLOUD_NAME` = `your-cloud-name`
   - `CLOUDINARY_API_KEY` = `your-api-key`
   - `CLOUDINARY_API_SECRET` = `your-api-secret`

3. **Redeploy** your site for changes to take effect

---

## ✅ Verification Checklist

- [ ] Cloudinary account created
- [ ] Credentials copied from Cloudinary dashboard
- [ ] `.env` file updated with credentials
- [ ] Test connection script runs successfully
- [ ] Test upload script works
- [ ] Netlify environment variables set (if deploying)

---

## 🎯 How It Works

1. **When you upload an image**:
   - Image is sent to Cloudinary servers
   - Cloudinary stores it and returns a URL
   - Only the URL is saved in MongoDB

2. **When displaying images**:
   - Frontend gets URL from MongoDB
   - Browser loads image directly from Cloudinary
   - Fast delivery via Cloudinary's CDN

---

## 🔧 Troubleshooting

### Error: "Invalid API credentials"
- ✅ Check your `.env` file has correct values
- ✅ Make sure there are no extra spaces in credentials
- ✅ Verify credentials in Cloudinary dashboard

### Error: "Module not found: cloudinary"
- ✅ Run: `npm install cloudinary multer-storage-cloudinary`
- ✅ Make sure you're in the `backend` directory

### Images not uploading
- ✅ Check file size (free tier has limits)
- ✅ Verify file format (jpg, png, jpeg, gif only)
- ✅ Check Cloudinary dashboard for upload errors

### Images not displaying
- ✅ Check the URL stored in MongoDB
- ✅ Verify URL is accessible in browser
- ✅ Check Cloudinary dashboard to see if image exists

---

## 📚 Additional Resources

- **Cloudinary Documentation**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Free Tier Limits**: [https://cloudinary.com/pricing](https://cloudinary.com/pricing)
- **Dashboard**: [https://console.cloudinary.com](https://console.cloudinary.com)

---

## 🎉 You're All Set!

Once configured, your vehicle images will be:
- ✅ Stored on Cloudinary (not in MongoDB)
- ✅ Delivered via fast CDN
- ✅ Automatically optimized and resized
- ✅ Accessible from anywhere

Happy uploading! 🚗📸





