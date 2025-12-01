# Superadmin Security System

## 🔒 Overview

The system now implements role-based access control (RBAC) with two admin levels:
- **Admin**: Standard administrative access
- **Superadmin**: Full administrative access with special privileges

## 🚨 Key Security Feature

**Only superadmins can delete approved or confirmed bookings (historical data).**

This protects your business data by preventing accidental deletion of completed transactions while allowing cleanup of pending/rejected bookings.

---

## 📋 Role Permissions

### Admin (Standard)
- ✅ View all bookings
- ✅ Approve/reject pending bookings
- ✅ Delete **pending**, **new**, **rejected**, or **cancelled** bookings
- ❌ **Cannot** delete approved or confirmed bookings
- ✅ Manage vehicles
- ✅ Manage adventures
- ✅ View analytics

### Superadmin
- ✅ All admin permissions
- ✅ Delete **ANY** booking (including approved/confirmed)
- ✅ Promote/demote other admins (future feature)
- ✅ Access to sensitive operations

---

## 🛠️ Setup Instructions

### 1. Promote an Existing Admin to Superadmin

**Option A: Using the Utility Script**

```bash
cd backend
node scripts/promote-to-superadmin.js <username>
```

Example:
```bash
node scripts/promote-to-superadmin.js admin
```

**Option B: List All Admins First**

```bash
node scripts/promote-to-superadmin.js --list
```

This shows all admins with their current roles:
```
📋 Admin Users:

Username             Role            Created                   Last Login
--------------------------------------------------------------------------------
admin                admin           10/22/2025, 7:00:00 AM    10/22/2025, 7:30:00 AM
superuser            superadmin      10/20/2025, 3:00:00 PM    10/22/2025, 7:25:00 AM
```

### 2. User Must Re-login

After promotion, the user **must logout and login again** for the new role to take effect (JWT token needs to be refreshed).

---

## 🔐 How It Works

### Delete Booking Flow

```
User attempts to delete booking
         ↓
Check: Is user authenticated? ────→ NO → 401 Unauthorized
         ↓ YES
Check: Booking status
         ↓
    ┌────┴────┐
    ↓         ↓
PENDING    APPROVED/CONFIRMED
    ↓         ↓
Any admin  Check: Is user superadmin?
can delete     ↓
         ┌─────┴─────┐
         ↓           ↓
        YES         NO
         ↓           ↓
    Allow delete  403 Forbidden
```

### Error Messages

**When regular admin tries to delete approved booking:**
```json
{
  "success": false,
  "error": "Access denied. Only superadmin can delete approved or confirmed bookings.",
  "requiresSuperadmin": true,
  "bookingStatus": "approved"
}
```

**Successful deletion (logged):**
```
Admin john deleting pending booking 507f1f77bcf86cd799439011
Booking deleted successfully: 507f1f77bcf86cd799439011
```

**Superadmin deletion (logged):**
```
Superadmin alice deleting approved booking 507f1f77bcf86cd799439012
Booking deleted successfully: 507f1f77bcf86cd799439012
```

---

## 📊 Database Changes

### Admin Model Updates

```javascript
{
  username: String,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'  // New admins are regular admins by default
  },
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### JWT Token

Tokens now include the role:
```javascript
{
  id: "...",
  username: "admin",
  role: "superadmin",  // <-- New field
  iat: 1234567890,
  exp: 1234654290
}
```

---

## 🔍 Testing

### Test as Regular Admin

1. Login as regular admin
2. Try to delete a pending booking → ✅ Should succeed
3. Try to delete an approved booking → ❌ Should get 403 error

### Test as Superadmin

1. Login as superadmin
2. Try to delete a pending booking → ✅ Should succeed
3. Try to delete an approved booking → ✅ Should succeed

### Test Console Logs

Check backend console for audit trail:
```
Admin john (admin) attempted to delete approved booking 507f191e810c19729de860ea
```

---

## 🚀 Migration Guide

### For Existing Databases

All existing admin users will have `role: 'admin'` by default.

**To promote your first superadmin:**

```bash
# Connect to backend directory
cd backend

# Promote admin to superadmin
node scripts/promote-to-superadmin.js admin

# Verify
node scripts/promote-to-superadmin.js --list
```

---

## 💡 Best Practices

1. **Limited Superadmins**: Only promote trusted personnel to superadmin
2. **Audit Logs**: Check backend logs regularly for deletion attempts
3. **Regular Backups**: Always backup your database before bulk operations
4. **Role Review**: Periodically review who has superadmin access

---

## 🔧 Future Enhancements

Planned features:
- [ ] Admin user management UI
- [ ] Role promotion/demotion from dashboard
- [ ] Detailed audit log system
- [ ] Multi-factor authentication for superadmins
- [ ] Soft delete for approved bookings (archive instead of delete)
- [ ] Booking restoration feature

---

## 📝 API Documentation

### Delete Booking Endpoint

**Endpoint**: `DELETE /api/bookings/:id`

**Authentication**: Required (Bearer token)

**Authorization**: 
- Any authenticated admin for pending/new/cancelled/rejected bookings
- Superadmin only for approved/confirmed bookings

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Booking deleted successfully",
  "booking": {
    "id": "507f1f77bcf86cd799439011",
    "customerName": "John Doe",
    "status": "approved",
    "deletedBy": "superadmin_user",
    "deletedAt": "2025-10-22T07:40:00.000Z"
  }
}
```

**Error Response** (403 - Insufficient Permissions):
```json
{
  "success": false,
  "error": "Access denied. Only superadmin can delete approved or confirmed bookings.",
  "requiresSuperadmin": true,
  "bookingStatus": "approved"
}
```

---

## 🆘 Troubleshooting

### Issue: "Access denied" but I'm logged in as superadmin

**Solution**: Logout and login again. Your JWT token was issued before the role upgrade.

### Issue: Can't promote admin to superadmin

**Check**:
1. MongoDB connection is working
2. Username is spelled correctly (case-sensitive)
3. `.env` file has correct `MONGODB_URI`

### Issue: All admins can delete approved bookings

**Check**:
1. Backend server was restarted after code changes
2. Admin model has `role` field
3. JWT token includes role (check token in browser DevTools)

---

## 📞 Support

For issues or questions:
1. Check backend console logs
2. Verify database schema with `node scripts/promote-to-superadmin.js --list`
3. Review this documentation

---

**Last Updated**: October 22, 2025  
**Version**: 1.0.0
