# MongoDB Atlas Setup Guide

## 🌐 **Cloud Database for BulkLeather**

This guide will help you set up MongoDB Atlas (cloud database) for your application.

---

## 📋 **Prerequisites**

- Email address for MongoDB account
- Internet connection
- ~5-10 minutes

---

## 🚀 **Step-by-Step Setup**

### **Step 1: Create MongoDB Atlas Account**

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with:
   - Email address
   - Or Google/GitHub account
3. Complete registration
4. Verify your email

---

### **Step 2: Create Organization & Project**

1. After login, you'll be prompted to create organization
2. Organization name: **BulkLeather** (or your company name)
3. Click **"Next"**
4. Create project name: **Production** (or **BulkLeather**)
5. Click **"Create Project"**

---

### **Step 3: Build Your First Cluster**

1. Click **"Build a Database"**
2. Choose deployment option:
   - Select **M0** (FREE tier) ✅
   - Shared cluster
   - Perfect for development & small production
3. **Cloud Provider:** Choose one:
   - AWS (recommended)
   - Google Cloud
   - Azure
4. **Region:** Choose closest to your users
   - US East (N. Virginia) `us-east-1`
   - Or your preferred region
5. **Cluster Name:** `Cluster0` (default is fine)
6. Click **"Create Cluster"** (takes 3-5 minutes)

---

### **Step 4: Create Database User**

1. While cluster is creating, you'll see "Security Quickstart"
2. Or go to **"Database Access"** in left sidebar
3. Click **"Add New Database User"**
4. **Authentication Method:** Password
5. **Username:** `bulkleather`
6. **Password:** Click "Autogenerate Secure Password" or create your own
   - **IMPORTANT:** Copy and save this password!
7. **Database User Privileges:** 
   - Select "Atlas admin" (or "Read and write to any database")
8. Click **"Add User"**

**Save your credentials:**
```
Username: bulkleather
Password: [YOUR_GENERATED_PASSWORD]
```

---

### **Step 5: Configure Network Access**

1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Choose option:
   
   **For Development (Recommended for now):**
   - Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0`
   - Allows connections from any IP
   
   **For Production (More Secure):**
   - Add your specific IP address
   - Add your server's IP address
   - Can add multiple IPs

4. Click **"Confirm"**

---

### **Step 6: Get Connection String**

1. Go to **"Database"** in left sidebar
2. Your cluster should be ready (green "Active" status)
3. Click **"Connect"** button on your cluster
4. Choose **"Connect your application"**
5. **Driver:** Node.js
6. **Version:** 5.5 or later
7. **Copy the connection string**

**It will look like:**
```
mongodb+srv://bulkleather:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

8. **Modify the connection string:**
   - Replace `<password>` with your actual database password
   - Add database name: `/bulkleather` after `.net`
   
**Final connection string:**
```
mongodb+srv://bulkleather:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/bulkleather?retryWrites=true&w=majority
```

---

### **Step 7: Add to Your Project**

1. Open your project folder
2. Create `.env.local` file (if not exists)
3. Add your connection string:

```env
MONGODB_URI=mongodb+srv://bulkleather:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/bulkleather?retryWrites=true&w=majority

JWT_SECRET=your-secure-random-32-character-string

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Example with actual values:**
```env
MONGODB_URI=mongodb+srv://bulkleather:MyP@ssw0rd123@cluster0.abc123.mongodb.net/bulkleather?retryWrites=true&w=majority

JWT_SECRET=kj234h5kj2h34k5jh23k4j5h2k3j4h523kj4h
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### **Step 8: Test Connection**

Run the database seeder to test your connection:

```bash
npm run seed
```

**Expected output:**
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

🚀 You can now login to /admin/login
👋 Disconnected from MongoDB
```

**If you see errors:**
- Check password is correct (no special chars in URL)
- Verify IP is whitelisted (0.0.0.0/0)
- Check internet connection
- Verify cluster is active (green status)

---

## 🎯 **Quick Reference**

### **MongoDB Atlas Dashboard URLs**

- **Main Dashboard:** https://cloud.mongodb.com
- **Database Access:** https://cloud.mongodb.com/v2/[PROJECT_ID]#/security/database/users
- **Network Access:** https://cloud.mongodb.com/v2/[PROJECT_ID]#/security/network/accessList
- **Clusters:** https://cloud.mongodb.com/v2/[PROJECT_ID]#/clusters

---

## 🔒 **Security Best Practices**

### **For Development:**
✅ Allow access from anywhere (0.0.0.0/0)
✅ Use strong database password
✅ Never commit .env.local to git

### **For Production:**
- Use specific IP addresses (your server IPs)
- Rotate passwords regularly
- Enable MongoDB backup
- Use environment variables on hosting platform
- Monitor database access logs

---

## 💡 **Connection String Troubleshooting**

### **Common Issues:**

**❌ Error: "Authentication failed"**
- Solution: Check username and password are correct
- Password may contain special characters - URL encode them

**❌ Error: "IP not whitelisted"**
- Solution: Add 0.0.0.0/0 to Network Access
- Or add your specific IP address

**❌ Error: "ENOTFOUND cluster0"**
- Solution: Check cluster name in connection string
- Verify internet connection

**❌ Error: "Database name required"**
- Solution: Add `/bulkleather` after .mongodb.net

### **Special Characters in Password**

If your password contains special characters, URL encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `:` → `%3A`

**Example:**
- Password: `MyP@ss#123`
- Encoded: `MyP%40ss%23123`

---

## 📊 **MongoDB Atlas Features**

### **Free Tier (M0) Includes:**
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Perfect for development
- ✅ Can handle ~2,000-5,000 products
- ✅ Backup not included (upgrade for backups)
- ✅ SSL/TLS encryption included

### **When to Upgrade:**

Upgrade when you need:
- More storage (>512 MB)
- Dedicated resources
- Automated backups
- Advanced monitoring
- Performance optimization

**Pricing starts at ~$9/month for M10 cluster**

---

## 🔄 **Connection Pooling**

Your app is configured with connection pooling:
- Caches connection across requests
- Reuses connections efficiently
- Handles reconnection automatically
- Optimized for serverless (Next.js)

---

## 🛠️ **Useful MongoDB Atlas Tools**

### **1. Atlas Data Explorer**
- Browse your database
- View collections
- Run queries
- Edit documents manually

**Access:** Database → Browse Collections

### **2. Monitoring**
- Real-time metrics
- Connection stats
- Query performance
- Disk usage

**Access:** Database → Metrics

### **3. Performance Advisor**
- Index recommendations
- Slow query analysis
- Optimization tips

**Access:** Database → Performance Advisor

---

## 📝 **Quick Commands**

### **View Your Data in Atlas**
1. Go to "Database"
2. Click "Browse Collections"
3. Select "bulkleather" database
4. View collections: users, products, categories, inquiries, meetings

### **Create Indexes (For Performance)**

In Atlas Data Explorer:
```javascript
// Products collection - index on category
db.products.createIndex({ category: 1 })

// Products collection - index on isActive
db.products.createIndex({ isActive: 1 })

// Inquiries collection - index on status
db.inquiries.createIndex({ status: 1, createdAt: -1 })
```

---

## 🎉 **You're All Set!**

Your MongoDB Atlas cloud database is ready for:
- ✅ Development
- ✅ Production
- ✅ Global access
- ✅ Automatic scaling
- ✅ Built-in security

**Next:** Add connection string to `.env.local` and run `npm run seed`!

---

## 📞 **Need Help?**

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB University (Free): https://university.mongodb.com/
- Community Forums: https://www.mongodb.com/community/forums/

---

## 💰 **Pricing Info**

- **M0 (Free):** Perfect for this project initially
- **M10 ($9/mo):** When you need backups & more storage
- **M20+ ($50+/mo):** For high-traffic production

**Your current needs:** M0 Free Tier is perfect! ✅

