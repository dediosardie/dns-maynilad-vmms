# Authentication System Documentation

## Overview
The Vehicle Management System now includes a complete Supabase-based authentication system with login, registration, password reset, and password change functionality.

## Features

### 1. User Authentication
- **Sign In**: Email and password authentication
- **Sign Up**: New user registration with email verification
- **Auto-session Management**: Automatic session restoration on page refresh
- **Protected Routes**: App content only accessible to authenticated users

### 2. Password Management
- **Forgot Password**: Send password reset link to email
- **Change Password**: Update password while logged in
- **Password Requirements**: Minimum 6 characters

### 3. User Interface
- **Login Page**: Full-screen authentication interface with brand elements
- **User Menu**: Dropdown menu in header with user email and actions
- **Change Password Modal**: In-app password update dialog
- **Sign Out**: Secure logout with session cleanup

## File Structure

```
src/
├── services/
│   └── authService.ts          # Authentication service layer
├── components/
│   ├── LoginPage.tsx           # Login/signup/forgot password UI
│   ├── ChangePasswordModal.tsx # Password change dialog
│   └── ...
└── App.tsx                      # Authentication state management
```

## Authentication Service API

### `authService.signIn(email, password)`
Authenticates user with email and password.

**Parameters:**
- `email` (string): User email address
- `password` (string): User password

**Returns:** `Promise<AuthResponse>`
```typescript
{
  user: User | null,
  session: Session | null,
  error: AuthError | null
}
```

### `authService.signUp(email, password)`
Creates new user account. Sends verification email.

**Parameters:**
- `email` (string): New user email
- `password` (string): New user password (min 6 chars)

**Returns:** `Promise<AuthResponse>`

### `authService.signOut()`
Signs out current user and clears session.

**Returns:** `Promise<{ error: AuthError | null }>`

### `authService.forgotPassword(email)`
Sends password reset email with link.

**Parameters:**
- `email` (string): User email address

**Returns:** `Promise<{ error: AuthError | null }>`

### `authService.updatePassword(newPassword)`
Updates password for currently authenticated user.

**Parameters:**
- `newPassword` (string): New password (min 6 chars)

**Returns:** `Promise<{ error: AuthError | null }>`

### `authService.getSession()`
Retrieves current session.

**Returns:** `Promise<{ session: Session | null, error: AuthError | null }>`

### `authService.getCurrentUser()`
Gets current authenticated user.

**Returns:** `Promise<{ user: User | null, error: AuthError | null }>`

### `authService.onAuthStateChange(callback)`
Subscribes to authentication state changes.

**Parameters:**
- `callback` (function): Called with user when auth state changes

**Returns:** Subscription object with `unsubscribe()` method

## Usage Examples

### Sign In
```typescript
const { user, error } = await authService.signIn('user@example.com', 'password123');
if (error) {
  console.error('Sign in failed:', error.message);
} else {
  console.log('Signed in:', user.email);
}
```

### Sign Up
```typescript
const { user, error } = await authService.signUp('newuser@example.com', 'password123');
if (error) {
  console.error('Sign up failed:', error.message);
} else {
  console.log('Account created. Check email for verification.');
}
```

### Forgot Password
```typescript
const { error } = await authService.forgotPassword('user@example.com');
if (error) {
  console.error('Reset failed:', error.message);
} else {
  console.log('Password reset email sent!');
}
```

### Change Password
```typescript
const { error } = await authService.updatePassword('newpassword123');
if (error) {
  console.error('Update failed:', error.message);
} else {
  console.log('Password updated successfully!');
}
```

### Sign Out
```typescript
const { error } = await authService.signOut();
if (!error) {
  console.log('Signed out successfully');
}
```

## App.tsx Integration

The `App` component manages authentication state:

1. **Initial Load**: Checks for existing session
2. **Loading State**: Shows spinner while checking auth
3. **Unauthenticated**: Displays `LoginPage`
4. **Authenticated**: Shows full application interface
5. **Auth Listener**: Subscribes to auth state changes
6. **User Menu**: Displays user email with dropdown
7. **Change Password**: Modal accessible from user menu
8. **Sign Out**: Clears session and returns to login

## Supabase Configuration

### Required Environment Variables
Add to `.env` file in project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Enable Authentication in Supabase

1. **Go to Supabase Dashboard** → Your Project → Authentication
2. **Enable Email Provider**:
   - Settings → Providers → Email
   - Enable "Email" provider
   - Configure email templates (optional)

3. **Email Templates** (Optional customization):
   - Confirm signup
   - Reset password
   - Invite user

4. **Site URL Configuration**:
   - Settings → URL Configuration
   - Set Site URL: `http://localhost:5173` (development)
   - Set Redirect URLs: `http://localhost:5173/reset-password`

5. **Email Rate Limiting** (Production):
   - Settings → Rate Limits
   - Adjust email rate limits as needed

### User Management

View and manage users:
- Dashboard → Authentication → Users
- See all registered users
- Manually verify emails
- Reset passwords
- Delete users

## Security Features

### Row Level Security (RLS)
All database tables should have RLS policies that check authentication:

```sql
-- Example policy for vehicles table
CREATE POLICY "Users can view their own vehicles"
  ON vehicles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

### Session Management
- Sessions stored securely in localStorage
- Automatic refresh on expiration
- Secure token handling via Supabase SDK

### Password Security
- Minimum 6 characters (configurable in Supabase)
- Hashed using bcrypt
- Never stored in plain text
- Secure transmission over HTTPS

## UI/UX Features

### Login Page
- Clean, centered design with gradient background
- Brand logo and title
- Toggle between Login/Signup modes
- Forgot password link
- Form validation with error messages
- Success messages with auto-redirect
- Loading states during authentication

### User Menu
- Displays user email in header
- Avatar circle with first letter of email
- Dropdown menu with:
  - User email display
  - Change Password option
  - Sign Out option
- Click outside to close

### Change Password Modal
- Modal overlay design
- New password + confirmation fields
- Real-time validation
- Success/error messages
- Auto-close on success

## Error Handling

Common authentication errors:

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid login credentials | Wrong email/password | Double-check credentials |
| Email not confirmed | Email verification pending | Check email inbox |
| User already registered | Email already exists | Use forgot password |
| Password too short | Less than 6 characters | Use longer password |
| Rate limit exceeded | Too many attempts | Wait before retrying |
| Invalid email | Malformed email address | Check email format |

## Testing

### Test Account Creation
1. Start development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Click "Sign up" on login page
4. Enter email and password
5. Check email for verification link
6. Click verification link
7. Sign in with credentials

### Test Password Reset
1. On login page, click "Forgot Password?"
2. Enter your email
3. Check email for reset link
4. Click reset link
5. Enter new password
6. Sign in with new password

### Test Password Change
1. Sign in to application
2. Click user avatar in top-right
3. Select "Change Password"
4. Enter new password twice
5. Click "Update Password"
6. Verify success message

## Troubleshooting

### "Missing Supabase environment variables"
- Create `.env` file in project root
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart development server

### "Email not confirmed"
- Check spam folder for verification email
- In Supabase Dashboard → Authentication → Users
- Manually verify user email

### "Invalid credentials" on correct password
- User may not be verified
- Check Supabase Dashboard for user status
- Resend verification email

### Session not persisting
- Check browser localStorage
- Look for `supabase.auth.token`
- Clear cache and try again

### Password reset email not received
- Check spam folder
- Verify email provider settings in Supabase
- Check Supabase logs for delivery issues

## Best Practices

1. **Always use HTTPS in production**
2. **Enable email verification** for new accounts
3. **Set strong password requirements** in Supabase settings
4. **Implement rate limiting** to prevent abuse
5. **Use environment variables** for all secrets
6. **Add RLS policies** to all database tables
7. **Log authentication events** for security auditing
8. **Implement MFA** (Multi-Factor Authentication) for high-security needs
9. **Regular security audits** of authentication flow
10. **User education** on password security

## Future Enhancements

Potential improvements:
- OAuth providers (Google, GitHub, Microsoft)
- Multi-Factor Authentication (MFA)
- Remember Me functionality
- Session timeout warnings
- Password strength meter
- Email verification resend
- Account deletion
- Profile management
- Role-based access control (RBAC)
- Audit logs for authentication events

## Support

For issues related to:
- **Supabase Auth**: [Supabase Documentation](https://supabase.com/docs/guides/auth)
- **Application Bugs**: Check console logs and network tab
- **Email Delivery**: Check Supabase logs and email provider settings
