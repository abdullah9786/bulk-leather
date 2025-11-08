# SEO & Deployment Guide for BulkLeather

## 🚀 Deploying to Vercel with Proper SEO

### Step 1: Set Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

```bash
# CRITICAL FOR SEO - Set your production domain
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Calendar API
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_google_private_key
GOOGLE_CALENDAR_ID=primary

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Environment
NODE_ENV=production
```

### Step 2: Why NEXT_PUBLIC_BASE_URL is Critical

The `NEXT_PUBLIC_BASE_URL` environment variable is used for:

1. **Canonical URLs** - Prevents duplicate content penalties
2. **OpenGraph URLs** - Ensures social media previews work correctly
3. **Structured Data** - Provides correct URLs for search engine rich snippets
4. **Sitemap Generation** - Creates proper absolute URLs

**Without this variable**, your SEO metadata will use:
- Vercel preview URLs (e.g., `your-app-xyz123.vercel.app`) 
- Or localhost URLs in production ❌

**With this variable**, your SEO metadata will use:
- Your custom domain (e.g., `https://bulkleather.com`) ✅

### Step 3: Deploy & Verify

1. **Push to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Fix SSR metadata with environment variables"
   git push origin main
   ```

2. **Trigger Vercel Deployment**
   - Vercel will automatically deploy when you push
   - Or manually trigger in Vercel dashboard

3. **Verify SEO is Working**

   After deployment, check your site's SEO:

   ```bash
   # View page source (Ctrl+U or Cmd+Option+U)
   # You should see:
   ```

   ```html
   <title>BulkLeather - Premium Wholesale Leather Goods Manufacturer</title>
   <meta name="description" content="Leading wholesale leather manufacturer...">
   <meta property="og:url" content="https://yourdomain.com">
   <link rel="canonical" href="https://yourdomain.com">
   <script type="application/ld+json">
     {"@context":"https://schema.org","@type":"Organization"...}
   </script>
   ```

## 🔍 Testing Your SEO

### 1. View Page Source
- Right-click → View Page Source (or Ctrl+U / Cmd+Option+U)
- Check that all meta tags are present in the HTML
- Verify URLs are using your domain, not Vercel preview URLs

### 2. Google Rich Results Test
- Visit: https://search.google.com/test/rich-results
- Enter your page URL
- Check for structured data validation

### 3. Facebook Sharing Debugger
- Visit: https://developers.facebook.com/tools/debug/
- Enter your page URL
- Check OpenGraph metadata

### 4. Twitter Card Validator
- Visit: https://cards-dev.twitter.com/validator
- Enter your page URL
- Check Twitter card metadata

### 5. Lighthouse SEO Audit
- Open Chrome DevTools → Lighthouse
- Run SEO audit
- Should score 90+ for SEO

## 📊 Expected SEO Features

Your site now has:

✅ **Server-Side Rendering (SSR)** - All metadata rendered on the server
✅ **Dynamic Metadata** - Each page has unique title/description
✅ **OpenGraph Tags** - Social media previews work correctly
✅ **Twitter Cards** - Twitter previews work correctly
✅ **Canonical URLs** - Prevents duplicate content
✅ **Structured Data (JSON-LD)** - Rich snippets for search engines
✅ **Mobile-Responsive** - Google mobile-first indexing ready
✅ **Sitemap Ready** - Can be generated with correct URLs

## 🛠️ Troubleshooting

### Issue: SEO tags showing Vercel URL instead of custom domain

**Solution:**
1. Check that `NEXT_PUBLIC_BASE_URL` is set in Vercel environment variables
2. Redeploy the site after adding the variable
3. Clear your browser cache and check page source

### Issue: Build fails for /admin/products

**Solution:**
- Fixed by adding `isMounted` check in admin layout
- localStorage is now only accessed client-side

### Issue: Metadata not updating after deployment

**Solution:**
1. Clear Vercel build cache: `Settings → Clear Cache`
2. Trigger new deployment
3. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

## 🎯 Custom Domain Setup

If using a custom domain:

1. Add domain in Vercel: `Settings → Domains`
2. Update DNS records as instructed by Vercel
3. Update `NEXT_PUBLIC_BASE_URL` to your custom domain:
   ```
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```
4. Redeploy

## 📈 SEO Best Practices Implemented

1. **Unique page titles** - Each page has descriptive, keyword-rich title
2. **Meta descriptions** - 150-160 characters, compelling and informative
3. **Semantic HTML** - Proper heading hierarchy (H1, H2, H3)
4. **Alt text for images** - All images have descriptive alt attributes
5. **Fast loading** - Next.js optimizations + image optimization
6. **Mobile responsive** - Works on all screen sizes
7. **Structured data** - Organization schema for rich snippets

## 🔗 Additional Resources

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Google Search Console](https://search.google.com/search-console)
- [Schema.org Documentation](https://schema.org)

---

**Need help?** Check your Vercel deployment logs for any errors during build.

