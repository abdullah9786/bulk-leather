# 🔧 OAuth Callback Error - Quick Fix

## ❌ Error: "Error in OAuth callback. Check redirect URI in Google Console"

This means the redirect URI in Google Cloud Console doesn't match what NextAuth is sending.

---

## ✅ **Quick Fix (5 minutes)**

### **Step 1: Go to Google Cloud Console**

1. Visit: https://console.cloud.google.com/apis/credentials
2. Sign in if needed
3. Select your project ("BulkLeather")

---

### **Step 2: Edit OAuth Client**

1. Find your OAuth 2.0 Client ID
2. Click the **pencil icon** (Edit) or click the client name
3. Scroll to **"Authorized redirect URIs"**

---

### **Step 3: Add/Fix Redirect URI**

**Remove any existing URIs and add exactly this:**

```
http://localhost:3000/api/auth/callback/google
```

**Important:**
- ✅ Use `http://` (not `https://` for localhost)
- ✅ No trailing slash
- ✅ Include `/api/auth/callback/google` path
- ✅ Port must be `3000`

**Screenshot of what it should look like:**
```
Authorized redirect URIs
┌─────────────────────────────────────────────────────┐
│ http://localhost:3000/api/auth/callback/google  [X]│
│                                                      │
│ [+ ADD URI]                                          │
└─────────────────────────────────────────────────────┘
```

---

### **Step 4: Save Changes**

1. Scroll to bottom
2. Click **"SAVE"**
3. Wait for "Saved" confirmation

---

### **Step 5: Restart Your Server**

```bash
# In terminal, stop server (Ctrl+C)
npm run dev
```

---

### **Step 6: Clear Browser Cache**

**In Browser:**
- Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
- Select "Cookies and site data"
- Click "Clear data"

**Or in Console (F12):**
```javascript
localStorage.clear()
sessionStorage.clear()
```

Then refresh the page.

---

### **Step 7: Try Again**

1. Go to: `http://localhost:3000`
2. Click "Sign In"
3. Click "Continue with Google"
4. Select your Google account
5. Should work now! ✅

---

## 🔍 **Verify Configuration**

### **Your .env.local should have:**

```env
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
NEXTAUTH_SECRET=any-random-32-char-string
NEXTAUTH_URL=http://localhost:3000
```

### **Google Console should have:**

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
```

---

## ⚠️ **Common Mistakes**

### **❌ Wrong:**
```
https://localhost:3000/api/auth/callback/google  (https instead of http)
http://localhost:3000/api/auth/callback/google/  (trailing slash)
http://localhost:3001/api/auth/callback/google   (wrong port)
http://127.0.0.1:3000/api/auth/callback/google   (use localhost not IP)
```

### **✅ Correct:**
```
http://localhost:3000/api/auth/callback/google
```

---

## 🧪 **Test Your Configuration**

### **1. Check Environment:**

Visit: `http://localhost:3000/api/auth/check`

Should show:
```json
{
  "googleClientIdSet": true,
  "googleSecretSet": true,
  "nextAuthSecretSet": true,
  "warnings": []
}
```

### **2. Check NextAuth Providers:**

Visit: `http://localhost:3000/api/auth/providers`

Should show:
```json
{
  "google": {
    "id": "google",
    "name": "Google",
    "type": "oauth",
    "signinUrl": "http://localhost:3000/api/auth/signin/google",
    "callbackUrl": "http://localhost:3000/api/auth/callback/google"
  }
}
```

**Check that `callbackUrl` matches exactly what you added to Google Console!**

---

## 🔄 **Alternative: Using Downloaded JSON**

I see you have a Google credentials JSON file downloaded. You can extract the values:

```bash
# View the file (it's in your Downloads)
cat ~/Downloads/client_secret_*.json | python3 -m json.tool
```

Look for:
- `client_id` → GOOGLE_CLIENT_ID
- `client_secret` → GOOGLE_CLIENT_SECRET

---

## 📱 **For Production Later**

When deploying, add production URLs:

**Authorized JavaScript origins:**
```
http://localhost:3000
https://yourdomain.com
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google
```

---

## 🎯 **Checklist**

- [ ] Go to Google Cloud Console
- [ ] Edit OAuth client
- [ ] Set redirect URI to: `http://localhost:3000/api/auth/callback/google`
- [ ] Save changes
- [ ] Restart dev server
- [ ] Clear browser cache/localStorage
- [ ] Try sign in again

---

## ✅ **Expected Result**

After fixing:
1. Click "Continue with Google"
2. Google popup opens
3. Select account
4. **Redirects back to your site** ← Should work now
5. Console shows: "✅ Sign in successful!"
6. User menu appears in header
7. Can proceed to checkout

---

## 🆘 **Still Not Working?**

**Check Server Console for:**
```
❌ Sign in error: ...
```

**Common server errors:**
- MongoDB connection failed
- User.create() error
- Database timeout

Share the server console error and I'll help fix it!

---

**The redirect URI is the #1 cause of OAuth errors. Double-check it matches exactly!** 🎯

