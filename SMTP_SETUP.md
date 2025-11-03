# 📧 SMTP Email Setup Guide

## 🎯 **Setup Gmail SMTP (5 Minutes)**

Your emails will never go to spam when sent from Gmail!

---

## 📋 **Step 1: Enable 2-Step Verification**

1. Go to: https://myaccount.google.com/security
2. Find **"2-Step Verification"**
3. Click **"Get Started"**
4. Follow the prompts to set up
5. Verify with your phone

---

## 🔑 **Step 2: Create App Password**

1. Go to: https://myaccount.google.com/apppasswords
2. Or: Google Account → Security → 2-Step Verification → App passwords
3. **Select app:** Choose **"Mail"**
4. **Select device:** Choose **"Other (Custom name)"**
5. **Name it:** Type **"BulkLeather"**
6. Click **"Generate"**
7. **Copy the 16-character password** that appears
   - Example: `abcd efgh ijkl mnop`
   - **Save this!** You won't see it again

---

## 📝 **Step 3: Add to .env.local**

Open your `.env.local` file and add:

```env
# SMTP Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=abcdefghijklmnop
EMAIL_FROM=BulkLeather <youremail@gmail.com>
ADMIN_EMAIL=youremail@gmail.com
```

**Replace:**
- `youremail@gmail.com` → Your Gmail address
- `abcdefghijklmnop` → Your app password (remove spaces)

**Complete Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=john@gmail.com
SMTP_PASS=xyzabc123def456g
EMAIL_FROM=BulkLeather Sales <john@gmail.com>
ADMIN_EMAIL=john@gmail.com
```

---

## 🔄 **Step 4: Restart Server**

```bash
# Stop server in terminal (Ctrl+C)
npm run dev
```

---

## ✅ **Step 5: Test**

1. Schedule a meeting on your site
2. Check server console for:
   ```
   ✅ SMTP connection verified
   ✅ Email sent successfully via SMTP
   ✅ Confirmation email sent to customer
   ✅ Admin notification sent
   ```
3. Check your Gmail inbox
4. Email should be there! ✅

---

## 🐛 **Troubleshooting**

### **Error: "connect ETIMEDOUT"**

**Problem:** Port 587 is blocked by your network/firewall

**Solution 1 - Try Port 465:**
```env
SMTP_PORT=465
```
Then restart server.

**Solution 2 - Try Port 25:**
```env
SMTP_PORT=25
```

**Solution 3 - Check Firewall:**
- Your network might block SMTP ports
- Try on different network (mobile hotspot)
- Check corporate firewall settings

---

### **Error: "Invalid login"**

**Problem:** Wrong credentials

**Fix:**
- Check email is correct
- Verify you're using **app password** (not regular password)
- Make sure 2-Step Verification is enabled
- Regenerate app password if needed

---

### **Error: "Authentication failed"**

**Fix:**
1. Enable "Less secure app access" (if option available)
2. Or use app password (recommended)
3. Check Gmail hasn't blocked the login

---

### **Still Getting Timeout?**

**Your network might block SMTP. Try this:**

1. **Use different port:**
   ```env
   SMTP_PORT=465
   ```

2. **Use your ISP's SMTP:**
   - Contact your internet provider
   - Ask for SMTP server details
   - Use their server instead

3. **Use mobile hotspot:**
   - Connect to phone's hotspot
   - Bypass corporate/home network restrictions

4. **Use different email provider:**
   - Outlook: `smtp-mail.outlook.com:587`
   - Yahoo: `smtp.mail.yahoo.com:587`

---

## 🌐 **Alternative SMTP Providers**

### **Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### **Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### **Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### **SendGrid (Free tier):**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

---

## 💡 **Quick Fix for Network Issues**

**If SMTP is blocked, use SendGrid (free):**

1. Sign up: https://sendgrid.com/ (free 100 emails/day)
2. Create API key
3. Add to .env.local:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=SG.your_api_key_here
   EMAIL_FROM=youremail@gmail.com
   ```
4. Restart server

SendGrid works even if port 587 is blocked on Gmail!

---

## ✅ **Verification**

After setup, you should see:
```
✅ SMTP connection verified
✅ Email sent successfully via SMTP
Message ID: <unique-id@gmail.com>
To: customer@email.com
```

---

## 🎯 **Your Options**

### **Option 1: Fix Port Issue**
- Try port 465 or 25
- Check firewall settings
- Use different network

### **Option 2: Use SendGrid**
- Free 100 emails/day
- Works around network blocks
- 2-minute setup

### **Option 3: Disable Emails**
- System works without emails
- Meet links still shown on screen
- Manual follow-up

---

## 📝 **Current .env.local Should Have:**

```env
# Try port 465 if 587 times out
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=youremail@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=BulkLeather <youremail@gmail.com>
ADMIN_EMAIL=youremail@gmail.com
```

---

Try changing `SMTP_PORT=465` and restart the server. That often fixes timeout issues! 🔧

