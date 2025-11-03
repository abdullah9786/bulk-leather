# 🔐 Google OAuth Setup Guide

## Quick Setup for User Authentication & Checkout

---

## 📋 **Prerequisites**

- Google account
- Google Cloud Console access
- 10 minutes

---

## 🚀 **Step-by-Step Setup**

### **Step 1: Access Google Cloud Console**

1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account

---

### **Step 2: Create New Project**

1. Click **project dropdown** (top navigation bar)
2. Click **"New Project"**
3. Project name: **"BulkLeather"**
4. Click **"Create"**
5. Wait for project creation
6. **Select your new project** from dropdown

---

### **Step 3: Enable Google+ API**

1. Go to **"APIs & Services" → "Library"**
2. Search for **"Google+ API"**
3. Click on it
4. Click **"Enable"**
5. Wait for activation

---

### **Step 4: Configure OAuth Consent Screen**

1. Go to **"APIs & Services" → "OAuth consent screen"**
2. Choose **"External"** (for public users)
3. Click **"Create"**

**App Information:**
- App name: **BulkLeather**
- User support email: **your-email@gmail.com**
- App logo: (optional)

**App Domain:**
- Application home page: `http://localhost:3000`
- Privacy policy: (optional for now)
- Terms of service: (optional for now)

**Developer contact:**
- Email: **your-email@gmail.com**

4. Click **"Save and Continue"**
5. **Scopes:** Click **"Save and Continue"** (use default)
6. **Test users:** Add your email (for testing)
7. Click **"Save and Continue"**
8. Review and click **"Back to Dashboard"**

---

### **Step 5: Create OAuth Credentials**

1. Go to **"APIs & Services" → "Credentials"**
2. Click **"Create Credentials"**
3. Choose **"OAuth client ID"**

**Application type:**
- Select **"Web application"**

**Name:**
- **BulkLeather Web App**

**Authorized JavaScript origins:**
Click **"+ Add URI"** and add:
- `http://localhost:3000`
- `http://localhost:3000` (you can add production URL later)

**Authorized redirect URIs:**
Click **"+ Add URI"** and add:
- `http://localhost:3000/api/auth/callback/google`

4. Click **"Create"**

---

### **Step 6: Copy Credentials**

You'll see a popup with:
- **Client ID**: Long string ending in `.apps.googleusercontent.com`
- **Client Secret**: Shorter secret string

**📝 SAVE THESE IMMEDIATELY!**

Example:
```
Client ID: 123456789-abc123def456.apps.googleusercontent.com
Client Secret: GOCSPX-abc123xyz789def456
```

---

### **Step 7: Add to .env.local**

Open/create `.env.local` in project root:

```env
# Existing MongoDB config
MONGODB_URI=mongodb+srv://...

# Add these new variables:
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz789def456
NEXTAUTH_SECRET=any-random-string-at-least-32-characters-long
NEXTAUTH_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET:**
```bash
# Option 1: In terminal
openssl rand -base64 32

# Option 2: Just use any random string
# Example: kj34h5kj2h34k5jh23k4j5h2k3j4h523kj4h
```

---

## 🔄 **Step 8: Restart Server**

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## ✅ **Step 9: Test Authentication**

1. Visit: `http://localhost:3000`
2. Add sample to cart
3. Click **"Checkout Now"**
4. Should redirect to sign-in page
5. Click **"Continue with Google"**
6. Select your Google account
7. Authorize the app
8. Should redirect back to checkout page
9. **Your cart data is now in the database!**

---

## 🎯 **Verification Checklist**

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth client ID created
- [ ] Redirect URIs added correctly
- [ ] Credentials added to .env.local
- [ ] NEXTAUTH_SECRET generated
- [ ] Server restarted
- [ ] Can sign in with Google
- [ ] Redirects to checkout after sign in
- [ ] Cart data syncs to database

---

## 🐛 **Common Issues**

### **❌ "redirect_uri_mismatch" error**

**Problem:** Redirect URI not configured correctly

**Solution:**
- Go to Google Cloud Console → Credentials
- Edit your OAuth client
- Add exact URI: `http://localhost:3000/api/auth/callback/google`
- Save and try again

### **❌ "Access blocked: This app's request is invalid"**

**Problem:** OAuth consent screen not configured

**Solution:**
- Complete OAuth consent screen setup
- Add your email as test user
- Make sure app is in "Testing" mode

### **❌ Sign in button does nothing**

**Problem:** Missing environment variables

**Solution:**
- Check .env.local has all variables
- Restart dev server
- Check browser console for errors

### **❌ "NEXTAUTH_SECRET is not set"**

**Problem:** Missing NEXTAUTH_SECRET

**Solution:**
- Add to .env.local: `NEXTAUTH_SECRET=random-32-char-string`
- Restart server

---

## 📱 **For Production Deployment**

### **Update OAuth Settings:**

1. Go to Google Cloud Console → Credentials
2. Edit OAuth client
3. **Add production URLs:**

**Authorized JavaScript origins:**
- `https://yourdomain.com`

**Authorized redirect URIs:**
- `https://yourdomain.com/api/auth/callback/google`

4. **Update .env (production):**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   GOOGLE_CLIENT_ID=same-client-id
   GOOGLE_CLIENT_SECRET=same-secret
   ```

5. **OAuth Consent Screen:**
   - Change from "Testing" to "In Production"
   - Complete verification if needed

---

## 🎁 **Benefits of Google OAuth**

✅ **No password management** - Google handles it
✅ **Secure** - Industry-standard OAuth 2.0
✅ **Fast sign in** - One click
✅ **Trusted** - Users trust Google
✅ **Auto-fill** - Name and email from Google
✅ **Cross-device** - Cart syncs across devices

---

## 📊 **User Experience**

### **Guest User:**
```
Browse → Add to Cart → Checkout
→ Sign in with Google → Checkout Page → Place Order
```

### **Returning User:**
```
Browse → Already signed in → Add to Cart → Checkout
→ Address pre-filled → Place Order
```

### **Cart Sync:**
```
Guest: Cart in localStorage
Signs In: Cart moves to database
Logs Out: Cart stays in database
Logs In Again: Cart restored from database
```

---

## 🎉 **You're Set Up!**

Once Google OAuth is configured:
- ✅ Users can sign in with Google
- ✅ Cart syncs to database
- ✅ Checkout process works
- ✅ Orders saved in MongoDB
- ✅ Admin can view all orders

**Complete the setup and test the checkout flow!** 🚀

---

## 📞 **Resources**

- Google Cloud Console: https://console.cloud.google.com/
- NextAuth Docs: https://next-auth.js.org/
- Google OAuth Guide: https://developers.google.com/identity/protocols/oauth2

