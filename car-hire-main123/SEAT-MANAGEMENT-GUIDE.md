# 🎯 Adventure Seat Management System

## Overview
The adventure booking system now automatically tracks available seats and prevents overbooking.

---

## ✨ Features Implemented

### 1. **Automatic Seat Tracking**
- ✅ Each adventure has `maxParticipants` and `bookedSeats` fields
- ✅ Virtual `availableSeats` field calculates remaining capacity
- ✅ Real-time updates when bookings are approved/rejected

### 2. **Booking Validation**
- ✅ Prevents booking if seats aren't available
- ✅ Shows clear error messages to customers
- ✅ Prevents admin from approving bookings without seats

### 3. **Visual Indicators**
- 🟢 **Green** - Plenty of seats available (4+)
- 🟡 **Orange** - Limited seats (1-3 remaining)
- 🔴 **Red** - Fully booked (0 seats)

---

## 🔄 How It Works

### **Customer Books Adventure:**
1. Customer selects adventure and fills form
2. System checks if seats are available
3. If available, booking is created with `status: 'pending'`
4. If not available, customer sees error message

### **Admin Approves Booking:**
1. Admin clicks "Approve" in dashboard
2. System checks if seats are still available
3. If available:
   - Booking status → `approved`
   - Adventure `bookedSeats` increases by `numberOfParticipants`
   - Customer gets confirmation
4. If not available:
   - Approval fails with error message
   - Booking remains `pending`

### **Admin Rejects Booking:**
1. Admin clicks "Reject"
2. If booking was previously approved:
   - Seats are restored to the adventure
   - `bookedSeats` decreases by `numberOfParticipants`
3. Booking status → `rejected`

### **Booking Deleted:**
1. If approved booking is deleted
2. Seats are automatically restored
3. Adventure becomes available again

---

## 📊 Database Schema

### Adventure Model
```javascript
{
  maxParticipants: 30,      // Maximum capacity
  bookedSeats: 12,          // Currently booked seats
  availableSeats: 18        // Virtual field (max - booked)
}
```

### Adventure Booking Model
```javascript
{
  numberOfParticipants: 2,  // Seats requested
  status: 'pending',        // pending, approved, rejected
  adventureId: '...'        // Links to Adventure
}
```

---

## 🎨 Frontend Display

### Adventure Cards Show:
```
📍 Maasai Mara Safari
💰 KES 20,000
👥 30 max capacity
✅ 18 seats available  ← Calculated in real-time
```

### Status Colors:
- **Green** (18 seats) → "18 seats available"
- **Orange** (3 seats) → "3 seats available ⚡ Only 3 left!"
- **Red** (0 seats) → "Fully Booked - No seats available"

### Buttons:
- **Available** → Green "Pay & Book Now", Blue "Reserve Now"
- **Fully Booked** → Both buttons disabled, red badge shown

---

## 🧪 Testing the Feature

### **Step 1: Check Current Status**
```bash
cd backend
node test-seat-management.js
```

This will show:
- Current seat availability for each adventure
- Booking statistics
- Recent bookings

### **Step 2: Create Test Booking**
1. Go to `/road-trip-adventures`
2. Click "Reserve Now" on any adventure
3. Fill in the form and submit
4. Check admin dashboard → should show as `pending`

### **Step 3: Approve Booking**
1. Go to admin dashboard
2. Find the pending booking
3. Click "Approve"
4. Check the adventure page → available seats decreased!

### **Step 4: Test Overbooking Protection**
1. Create multiple bookings for same adventure
2. Approve them until fully booked
3. Try to approve one more → Should fail with error!
4. Check frontend → Adventure shows "Fully Booked"

### **Step 5: Test Seat Restoration**
1. Reject an approved booking
2. Check adventure → seats restored!
3. Or delete an approved booking → seats also restored!

---

## 🔧 Admin Dashboard Integration

Make sure your admin dashboard shows:
```javascript
// In adventure booking list
<td>Seats: {booking.numberOfParticipants || 1}</td>
<td>Status: {booking.status}</td>

// When displaying adventure
<td>Available: {adventure.availableSeats}/{adventure.maxParticipants}</td>
```

---

## ⚠️ Important Notes

### **Preventing Double-Counting:**
- Approving an already-approved booking returns error
- System checks current status before updating seats

### **Data Integrity:**
- All seat operations use `Math.max(0, ...)` to prevent negative values
- Atomic operations prevent race conditions

### **Booking Flow:**
```
Customer Books → PENDING (no seats reserved)
       ↓
Admin Approves → APPROVED (seats reserved)
       ↓
Customer Pays → PAID (seats confirmed)
```

---

## 📱 API Endpoints

### **Create Booking** (POST /api/adventure-bookings)
- Checks seat availability before creating
- Returns error if no seats available

### **Approve Booking** (PATCH /api/adventure-bookings/:id/approve)
- Validates seat availability
- Decreases available seats
- Returns success with updated booking

### **Reject Booking** (PATCH /api/adventure-bookings/:id/reject)
- Restores seats if previously approved
- Updates booking status

### **Delete Booking** (DELETE /api/adventure-bookings/:id)
- Restores seats if approved
- Removes booking record

---

## 🚀 Next Steps

### **Recommended Enhancements:**
1. **Email Notifications** - Notify customers when approved/rejected
2. **Waitlist** - Allow customers to join waitlist for full adventures
3. **Expiration** - Auto-cancel pending bookings after X days
4. **Seat Selection** - Let customers choose specific number of seats
5. **Group Bookings** - Special handling for large groups

---

## 📞 Support

If you encounter any issues:
1. Check backend logs for detailed error messages
2. Run `node test-seat-management.js` to see current state
3. Verify MongoDB connection
4. Check that all adventures have `bookedSeats: 0` initially

---

**🎉 Your adventure booking system now has professional seat management!**
