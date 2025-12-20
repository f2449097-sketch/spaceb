# M-Pesa STK Push Integration Setup Guide

## Overview
This guide will help you set up M-Pesa STK Push (Lipa Na M-Pesa Online) integration for your SpaceBorne car hire system.

## What is STK Push?
STK Push sends a payment prompt directly to the customer's phone with the amount already filled in. The customer only needs to enter their M-Pesa PIN to complete the payment.

---

## Step 1: Get M-Pesa API Credentials

### For Sandbox (Testing)
1. Go to [Daraja Portal](https://developer.safaricom.co.ke/)
2. Create an account and log in
3. Create a new app:
   - Click "My Apps" → "Create App"
   - Select the APIs you want (choose **Lipa Na M-Pesa Sandbox**)
   - Fill in app name and description
4. Get your credentials:
   - **Consumer Key** - Found in your app details
   - **Consumer Secret** - Found in your app details
   - **Passkey** - Provided in Lipa Na M-Pesa Sandbox test credentials page
   - **Shortcode** - Sandbox shortcode is `174379`

### For Production (Live)
1. Submit your app for production approval on Daraja Portal
2. Complete the approval process
3. Get production credentials:
   - **Business Shortcode** (Paybill or Till Number)
   - **Consumer Key & Secret**
   - **Passkey**

---

## Step 2: Configure Environment Variables

1. Create or update `.env` file in the `backend` folder:

```env
# M-Pesa API Configuration
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_PASSKEY=your_passkey_here
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
MPESA_ENV=sandbox
```

### Important Notes:
- For **sandbox testing**: Use `MPESA_ENV=sandbox`
- For **production**: Change to `MPESA_ENV=production`
- **Callback URL**: Must be a publicly accessible HTTPS URL
  - For local testing, use tools like [ngrok](https://ngrok.com/) to expose your local server

---

## Step 3: Install Required Dependencies

Make sure `axios` is installed in your backend:

```bash
cd backend
npm install axios
```

---

## Step 4: Test with Sandbox

### Sandbox Test Credentials (For Testing Only)
- **Shortcode**: `174379`
- **Passkey**: Get from Daraja Portal test credentials page
- **Test Phone Numbers**: Any Safaricom number will work in sandbox

### Test STK Push

Using **Postman** or **curl**:

```bash
POST http://localhost:3001/api/mpesa/stkpush
Content-Type: application/json

{
  "phoneNumber": "0712345678",
  "amount": 100,
  "accountReference": "TEST123",
  "transactionDesc": "Test Payment"
}
```

Response:
```json
{
  "success": true,
  "message": "STK push sent successfully",
  "data": {
    "MerchantRequestID": "...",
    "CheckoutRequestID": "...",
    "ResponseCode": "0",
    "ResponseDescription": "Success...",
    "CustomerMessage": "Success..."
  }
}
```

---

## Step 5: Setup Callback URL

### For Local Development
1. Install ngrok: `npm install -g ngrok`
2. Start your backend server: `npm start`
3. In another terminal, run: `ngrok http 3001`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Update your `.env`:
   ```env
   MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/mpesa/callback
   ```

### For Production
- Use your actual domain: `https://yourdomain.com/api/mpesa/callback`
- Ensure your server has a valid SSL certificate
- Must be accessible from Safaricom's servers

---

## Step 6: Using the Payment Component

Import and use the `MpesaPayment` component in your app:

```javascript
import MpesaPayment from '../components/MpesaPayment';

function BookingPage() {
  const [showPayment, setShowPayment] = useState(false);
  
  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    // Update booking status, show success message, etc.
  };

  return (
    <div>
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <MpesaPayment
            amount={5000}
            accountReference="BOOKING123"
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        </div>
      )}
      
      <button onClick={() => setShowPayment(true)}>
        Pay with M-Pesa
      </button>
    </div>
  );
}
```

---

## API Endpoints

### 1. Initiate STK Push
```
POST /api/mpesa/stkpush
```
**Body:**
```json
{
  "phoneNumber": "0712345678",
  "amount": 1000,
  "accountReference": "BOOKING123",
  "transactionDesc": "Payment for booking"
}
```

### 2. Query Payment Status
```
POST /api/mpesa/query
```
**Body:**
```json
{
  "checkoutRequestId": "ws_CO_260520211133524545"
}
```

### 3. Callback (Webhook)
```
POST /api/mpesa/callback
```
- This is called automatically by M-Pesa
- Don't call this manually
- Used to receive payment confirmation

---

## Testing Phone Numbers

### Sandbox Testing
- Any Safaricom phone number works in sandbox
- Format: `0712345678` or `254712345678`
- You'll receive the STK push on your actual phone

### Common Test Scenarios
1. **Successful Payment**: Enter correct PIN
2. **Cancelled Payment**: Cancel the STK push prompt
3. **Timeout**: Don't respond to the prompt
4. **Insufficient Funds**: Test with low balance

---

## Troubleshooting

### "Invalid Access Token"
- Check your Consumer Key and Secret
- Ensure they match your environment (sandbox/production)

### "Request Cancelled by User"
- Customer cancelled the STK push prompt
- Handle this gracefully in your UI

### "STK Push Not Received"
- Check phone number format (should be 07XX or 01XX)
- Ensure phone is Safaricom
- Check network connectivity

### "Callback Not Received"
- Verify callback URL is publicly accessible (HTTPS)
- Check server logs for callback data
- Use ngrok for local development

### "DS timeout"
- Network issue or M-Pesa server busy
- Retry after a few seconds

---

## Production Checklist

Before going live:
- [ ] Replace sandbox credentials with production credentials
- [ ] Change `MPESA_ENV` to `production`
- [ ] Update `MPESA_SHORTCODE` to your business shortcode
- [ ] Set up proper callback URL with SSL
- [ ] Test with small amounts first
- [ ] Implement proper error handling
- [ ] Set up logging and monitoring
- [ ] Store transaction records in database
- [ ] Implement reconciliation process

---

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Validate callback data** to prevent fraud
4. **Log all transactions** for auditing
5. **Implement rate limiting** to prevent abuse
6. **Use HTTPS** for all communication
7. **Verify callback IP** (optional but recommended)

---

## Support

- **Daraja Portal**: https://developer.safaricom.co.ke/
- **Documentation**: https://developer.safaricom.co.ke/docs
- **Support Email**: apisupport@safaricom.co.ke

---

## Example Flow

1. Customer selects "Pay with M-Pesa"
2. Enter phone number
3. Click "Pay Now"
4. Backend sends STK push request
5. Customer receives prompt on phone with amount
6. Customer enters M-Pesa PIN
7. M-Pesa processes payment
8. Callback received on your server
9. Update booking status
10. Show success message to customer

---

## Next Steps

1. Get your API credentials from Daraja Portal
2. Update `.env` with your credentials
3. Restart your backend server
4. Test with sandbox credentials
5. Integrate payment component into your booking flow
6. Test thoroughly before going live
