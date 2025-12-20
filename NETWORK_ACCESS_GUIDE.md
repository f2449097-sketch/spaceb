# Network Access Guide - SpaceBorne Car Hire

## 🌐 Access Your Development Server from Other Devices

Your application is already configured to accept connections from other devices on your local network!

---

## 📱 How to Access from Another Device

### Step 1: Start Your Servers

Run both frontend and backend servers:

```bash
npm run dev:all
```

Or start them separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

### Step 2: Find Your Computer's IP Address

**On Windows:**
1. Press `Win + R`, type `cmd`, and press Enter
2. Type: `ipconfig`
3. Look for **"IPv4 Address"** under your active network adapter (WiFi or Ethernet)
   - Example: `192.168.1.100`

**Quick PowerShell command:**
```powershell
(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Wi-Fi*).IPAddress
```

### Step 3: Access from Other Devices

Once your servers are running, you'll see network URLs in the console:

**Frontend Access:**
```
➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.100:3000/
```

**Backend Access:**
```
📡 Access the backend using any of these URLs:
   http://192.168.1.100:3001
```

From any device on the **same network** (phone, tablet, another computer):

1. **Open the browser** on that device
2. **Type the Network URL**: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

---

## 🔥 Windows Firewall Configuration

If you **can't connect** from other devices, you may need to allow the ports through Windows Firewall:

### Option 1: Quick Fix (Recommended for Development)

Run these commands in **PowerShell as Administrator**:

```powershell
# Allow Frontend (Port 3000)
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Allow Backend (Port 3001)  
New-NetFirewallRule -DisplayName "Node Backend Server" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

### Option 2: Manual Configuration

1. Open **Windows Defender Firewall with Advanced Security**
2. Click **Inbound Rules** → **New Rule**
3. Select **Port** → Click **Next**
4. Choose **TCP** → Enter port `3000` → Click **Next**
5. Select **Allow the connection** → Click **Next**
6. Check all profiles (Domain, Private, Public) → Click **Next**
7. Name it "Vite Dev Server" → Click **Finish**
8. **Repeat** for port `3001` (Backend)

---

## ✅ Current Configuration Status

Your servers are already configured with:

### Frontend (Vite)
- ✅ Host: `0.0.0.0` (accepts connections from all network interfaces)
- ✅ Port: `3000`
- ✅ Allowed Hosts: `all`
- ✅ Proxy to backend configured

### Backend (Express)
- ✅ Host: `0.0.0.0` (accepts connections from all network interfaces)
- ✅ Port: `3001`
- ✅ CORS: Accepts all origins (`*`)
- ✅ Network IP displayed on startup

---

## 🔍 Troubleshooting

### Problem: "Cannot connect from other device"

**Solution 1: Check Firewall**
- Make sure Windows Firewall allows ports 3000 and 3001 (see above)
- Temporarily disable firewall to test if that's the issue

**Solution 2: Verify Same Network**
- Both devices must be on the **same WiFi network**
- Check if your phone/tablet is on the same network as your computer

**Solution 3: Check IP Address**
- Verify you're using the correct IP address
- Run `ipconfig` again to confirm
- Try both IPv4 addresses shown in the console

**Solution 4: Antivirus Software**
- Some antivirus programs block incoming connections
- Add exceptions for Node.js and npm

### Problem: "API calls failing"

**Solution:**
The frontend uses a proxy in development, but if accessing via IP address, you may need to:

1. Set environment variable before starting:
```bash
set VITE_BACKEND_URL=http://192.168.1.100:3001
npm run dev
```

2. Or edit `.env` file (create if doesn't exist):
```env
VITE_BACKEND_URL=http://192.168.1.100:3001
```

### Problem: "ERR_CONNECTION_REFUSED"

**Check if servers are running:**
```bash
# Check if port 3000 is listening
netstat -an | findstr :3000

# Check if port 3001 is listening  
netstat -an | findstr :3001
```

---

## 📲 Testing on Mobile

### iOS (iPhone/iPad)
1. Connect to same WiFi
2. Open Safari
3. Enter: `http://YOUR_IP:3000`

### Android
1. Connect to same WiFi
2. Open Chrome
3. Enter: `http://YOUR_IP:3000`

### Desktop Browser
1. Connect to same network
2. Open any browser
3. Enter: `http://YOUR_IP:3000`

---

## 🎯 Quick Test Checklist

- [ ] Both servers running (`npm run dev:all`)
- [ ] Know your computer's IP address (`ipconfig`)
- [ ] Other device on same WiFi network
- [ ] Windows Firewall configured (ports 3000, 3001)
- [ ] Browser URL: `http://YOUR_IP:3000`

---

## 💡 Tips

1. **Keep IP Address handy**: Your IP might change if you reconnect to WiFi
2. **Bookmark on mobile**: Save the URL for quick access
3. **Network Quality**: Ensure good WiFi signal on both devices
4. **HTTPS not available**: Development servers use HTTP only (this is normal)

---

## 🚀 Production Deployment

For public access (not just local network), you'll need to:
- Deploy to a hosting service (Netlify, Vercel, Heroku, etc.)
- Use a proper domain name
- Configure SSL certificates for HTTPS

---

**Need Help?**
If you're still having issues, check the console output when starting the servers - it will show all available network addresses!
