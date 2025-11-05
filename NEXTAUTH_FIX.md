# NextAuth Redirect URL Fix

## Problem
After Google login, redirecting to `http://localhost/api/auth/callback/google` (missing port :3000)

## Solution

### 1. Check Your `.env.local` File

Make sure you have this line **exactly** as shown:

```env
NEXTAUTH_URL=http://localhost:3000
```

**Important:** 
- Must include the port `:3000`
- No trailing slash
- Must match your development server port

### 2. Restart Your Development Server

After updating `.env.local`, **restart** your Next.js server:

```bash
# Stop the current server (Ctrl+C)
# Then start again
npm run dev
```

### 3. Update Google Cloud Console

Make sure your Google OAuth redirect URI is set to:

```
http://localhost:3000/api/auth/callback/google
```

**Steps:**
1. Go to https://console.cloud.google.com/
2. Select your project
3. Navigate to: APIs & Services → Credentials
4. Click on your OAuth 2.0 Client ID
5. Under "Authorized redirect URIs", make sure you have:
   - `http://localhost:3000/api/auth/callback/google`
6. Save changes

### 4. Clear Browser Data

Sometimes cached redirects cause issues:

1. Open Chrome DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

Or use Incognito/Private mode to test.

### 5. Verify Environment Variables

Check that all required environment variables are set in `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-min-32-chars
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 6. Common Issues

**Port Mismatch:**
- Your app runs on `localhost:3000`
- But `NEXTAUTH_URL` says `localhost` (without port)
- Fix: Add `:3000` to `NEXTAUTH_URL`

**Wrong Google Redirect URI:**
- Google Console has: `http://localhost/api/auth/callback/google`
- Should be: `http://localhost:3000/api/auth/callback/google`
- Fix: Update in Google Console

**Environment Variables Not Loaded:**
- You updated `.env.local` but didn't restart server
- Fix: Stop and restart `npm run dev`

### 7. Test the Fix

1. Stop your dev server (Ctrl+C)
2. Verify `.env.local` has `NEXTAUTH_URL=http://localhost:3000`
3. Start dev server: `npm run dev`
4. Try Google login again
5. Should redirect to `http://localhost:3000/api/auth/callback/google` (with port)

### 8. Still Not Working?

Check server logs for:
```
NEXTAUTH_URL: http://localhost:3000
```

If it shows anything different, your `.env.local` isn't being read correctly.

### Quick Checklist

- [ ] `.env.local` has `NEXTAUTH_URL=http://localhost:3000`
- [ ] Development server restarted
- [ ] Google Console redirect URI includes `:3000`
- [ ] Browser cache cleared
- [ ] All environment variables present
- [ ] Server running on port 3000

---

**After following these steps, Google login should work correctly!**

