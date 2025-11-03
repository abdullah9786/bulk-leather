# 🚀 Quick Start with MongoDB Atlas (Cloud)

## Get Your Site Running in 10 Minutes

---

## 1️⃣ **Install Dependencies** (2 min)

```bash
cd /Users/ansari.a/React/bulk-leather
npm install
```

---

## 2️⃣ **Set Up MongoDB Atlas** (5 min)

### A. Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)

### B. Create FREE Cluster
1. Click **"Build a Database"**
2. Choose **FREE M0 tier**
3. Select **AWS** provider
4. Choose **region** (closest to you)
5. Cluster name: `Cluster0` (default)
6. Click **"Create"** (wait 3-5 min)

### C. Create Database User
1. Click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Username: `bulkleather`
4. Password: Click **"Autogenerate Secure Password"**
5. **📝 COPY AND SAVE THIS PASSWORD!**
6. Role: "Atlas admin"
7. Click **"Add User"**

### D. Allow Network Access
1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
4. Click **"Confirm"**

### E. Get Connection String
1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy connection string
5. It looks like:
   ```
   mongodb+srv://bulkleather:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 3️⃣ **Create .env.local File** (1 min)

Create `.env.local` in project root:

```env
MONGODB_URI=mongodb+srv://bulkleather:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/bulkleather?retryWrites=true&w=majority

JWT_SECRET=kj234h5kj2h34k5jh23k4j5h2k3j4h523kj4h5k23jh45k23jh4k5

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace:**
- `YOUR_PASSWORD_HERE` → Your actual MongoDB password
- `cluster0.xxxxx` → Your actual cluster address
- `JWT_SECRET` → Any random 32+ character string

---

## 4️⃣ **Seed Database** (1 min)

```bash
npm run seed
```

**You should see:**
```
🔌 Connecting to MongoDB...
✅ MongoDB Connected Successfully
🗑️  Clearing existing data...
👤 Creating admin user...
📁 Seeding categories...
📦 Seeding products...
✅ Database seeded successfully!

📝 Admin Credentials:
   Email: admin@bulkleather.com
   Password: admin123
```

**If you see connection errors:**
- Double-check your password in .env.local
- Verify IP is whitelisted (0.0.0.0/0)
- Make sure cluster is active (green status)

---

## 5️⃣ **Start Development Server** (1 min)

```bash
npm run dev
```

**You should see:**
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

---

## 6️⃣ **Access Your Site**

### **Public Website:**
```
http://localhost:3000
```

### **Admin Dashboard:**
```
http://localhost:3000/admin/login

Email: admin@bulkleather.com
Password: admin123
```

---

## ✅ **Verification Checklist**

Test these to confirm everything works:

### **Public Site:**
- [ ] Home page loads
- [ ] Products page shows all items
- [ ] Click product to see details
- [ ] Add sample to cart (cart icon shows badge)
- [ ] Open cart drawer
- [ ] Schedule a meeting (floating button or page button)
- [ ] Submit contact form
- [ ] Switch themes (palette icon)

### **Admin Dashboard:**
- [ ] Login at /admin/login
- [ ] Dashboard shows statistics
- [ ] Products page shows table
- [ ] Inquiries page (should be empty initially)
- [ ] Meetings page (should be empty initially)
- [ ] Categories page shows grid

---

## 🎯 **What's Connected**

### **Forms → Database**
When users submit forms, data is saved to MongoDB:
- Contact form → Creates inquiry in database
- Meeting scheduler → Creates meeting in database
- Customization form → Creates inquiry in database
- All include sample cart items!

### **Admin → Database**
Admin dashboard reads from MongoDB:
- Products list from database
- Categories from database
- Inquiries from database
- Meetings from database

---

## 🔍 **View Your Data in MongoDB Atlas**

1. Go to: https://cloud.mongodb.com
2. Click **"Database"**
3. Click **"Browse Collections"**
4. Select **"bulkleather"** database
5. View collections:
   - **users** - Admin users
   - **products** - Product catalog
   - **categories** - Product categories
   - **inquiries** - Customer inquiries
   - **meetings** - Scheduled meetings

---

## 🐛 **Common Issues & Solutions**

### **❌ "MongooseServerSelectionError"**
**Solution:**
- Check MONGODB_URI in .env.local
- Verify password is correct (no special chars unencoded)
- Confirm IP is whitelisted (0.0.0.0/0)

### **❌ "Authentication failed"**
**Solution:**
- Double-check database user password
- Recreate database user if needed
- URL encode special characters in password

### **❌ Seed script fails**
**Solution:**
- Ensure MongoDB cluster is active (not paused)
- Check internet connection
- Verify .env.local file exists and is correct

### **❌ Admin login doesn't work**
**Solution:**
- Run `npm run seed` first
- Clear browser localStorage
- Check browser console for errors

---

## 📊 **Free Tier Limits**

MongoDB Atlas M0 (Free):
- **Storage:** 512 MB
- **RAM:** Shared
- **Connections:** 500 concurrent
- **Backup:** Not included

**Perfect for:**
- ✅ Development
- ✅ Testing  
- ✅ Small production sites
- ✅ Up to ~5,000 products
- ✅ Learning & prototyping

**This is more than enough for your needs!**

---

## 🎉 **You're Live!**

Once all steps complete:
- ✅ Cloud database running
- ✅ Data seeded
- ✅ Frontend working
- ✅ Backend connected
- ✅ Admin dashboard accessible

**Time to explore your new site!** 🚀

---

## 📞 **Resources**

- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Connection String Help:** https://docs.mongodb.com/manual/reference/connection-string/
- **Free Tutorials:** https://university.mongodb.com/

---

## 💡 **Pro Tips**

1. **Bookmark your cluster page** for easy access
2. **Save your credentials** securely (password manager)
3. **Monitor usage** in Atlas dashboard
4. **Set up alerts** for cluster issues
5. **Enable auto-pause** (free tier auto-pauses after 60 days inactive)

---

**Need help? Check BACKEND_SETUP.md for detailed troubleshooting!**

