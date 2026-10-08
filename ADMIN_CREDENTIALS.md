# Administrator Credentials & Security

## Default Administrator Account

**Important:** Change these credentials in production before deploying!

### Login Credentials
- **Phone Number:** 9649183422
- **Password:** `BL@Diag#2026$Secure!Admin`

### Password Strength
- Length: 26 characters
- Contains: Uppercase, lowercase, numbers, special characters (@, #, $, !)
- Security Score: Strong

## Security Features Implemented

### 1. Account Lockout
- **Failed Attempts Limit:** 5 attempts
- **Lockout Duration:** 5 minutes
- **Automatic Reset:** After lockout period expires
- **Storage:** LocalStorage (client-side)

### 2. Session Management
- **Session Timeout:** 30 minutes of inactivity
- **Token Format:** `bld-jwt-{base64-encoded-timestamp}`
- **Storage:** LocalStorage (client-side)
- **Auto-logout:** On timeout or manual logout

### 3. Route Protection
- **Admin Route:** `/admin` and `#admin`
- **Authentication Check:** Required before accessing admin panel
- **Fallback:** Redirects to login gate if not authenticated
- **UI Indication:** "Admin Suite (Active)" badge when logged in

### 4. Action Logging
- **All Admin Actions:** Logged to activity logs
- **Failed Login Attempts:** Tracked with timestamp
- **Session Events:** Login, logout, lockout recorded
- **Log Persistence:** Stored in LocalStorage

### 5. API Security
- **Authentication Middleware:** `requireAdminAuth` on protected routes
- **Token Validation:** Bearer token required format
- **RBAC Enforcement:** Role-based access control
- **Error Messages:** Generic (no credential leakage)

## Admin Capabilities

### What Admin Can See
- ✅ All user bookings (no user restriction)
- ✅ All diagnostic reports
- ✅ All test catalog entries
- ✅ All health packages
- ✅ All user profiles
- ✅ Revenue analytics
- ✅ Activity logs
- ✅ Database management

### What Admin Can Do
- ✅ Create, update, delete tests
- ✅ Create, update, delete packages
- ✅ Update booking status
- ✅ Assign phlebotomists
- ✅ Upload/publish reports
- ✅ Manage user profiles
- ✅ Update website configuration
- ✅ Change admin password
- ✅ View analytics

## Security Best Practices

### For Production Deployment
1. **Change default password** immediately
2. **Use environment variables** for credentials
3. **Enable HTTPS** on all endpoints
4. **Implement rate limiting** on API
5. **Use a real JWT library** (jsonwebtoken)
6. **Store credentials securely** (Vault, Secrets Manager)
7. **Enable IP whitelisting** for admin access
8. **Implement 2FA** for additional security
9. **Regular security audits**
10. **Monitor activity logs** for suspicious behavior

### Password Management
- Never commit credentials to git
- Use strong, unique passwords
- Rotate passwords regularly
- Use a password manager
- Enable password complexity requirements

## Testing Admin Access

### Test the Lockout Feature
1. Navigate to `/admin`
2. Enter correct phone (9649183422)
3. Enter wrong password 5 times
4. Account should lock for 5 minutes
5. Wait or clear localStorage to reset

### Test Session Timeout
1. Login as admin
2. Wait 30 minutes without activity
3. Session should auto-logout
4. Redirect to login gate

### Test Order Visibility
1. Create bookings as different users
2. Login as admin
3. Navigate to Bookings Management
4. Verify all bookings from all users are visible

## Troubleshooting

### Locked Out of Admin
```javascript
// Clear localStorage to reset lockout
localStorage.removeItem('bl_admin_failed_attempts');
localStorage.removeItem('bl_admin_last_attempt');
localStorage.removeItem('bl_admin_auth');
localStorage.removeItem('bl_admin_token');
```

### Reset Admin Password
1. Open Admin Security Settings
2. Use "Change Admin Password" feature
3. Enter old password and new password
4. Settings persist to localStorage

### Check Admin Status
```javascript
// Check if admin is authenticated
const isAdminAuth = localStorage.getItem('bl_admin_auth') === 'true';
const adminToken = localStorage.getItem('bl_admin_token');
```

## Contact
For security issues or password reset requests, contact the system administrator.
