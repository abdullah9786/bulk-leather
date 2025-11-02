# Deployment Guide

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All pages load without errors
- [ ] Forms submit correctly (connected to backend)
- [ ] Images are optimized and loading
- [ ] Theme switcher works in all browsers
- [ ] Mobile responsive on all pages
- [ ] SEO meta tags are set
- [ ] Favicon and app icons added
- [ ] Google Analytics configured (optional)
- [ ] Contact information is accurate
- [ ] All links work correctly
- [ ] No console errors in production build

### Environment Variables

Create `.env.production` with:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
# Add other production variables
```

### Build Commands

```bash
# Test production build locally
npm run build
npm run start

# Check for build errors
npm run lint
```

## 📦 Deployment Platforms

### Vercel (Recommended for Next.js)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add production variables

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

**Advantages:**
- Zero-config deployment for Next.js
- Automatic HTTPS
- Global CDN
- Automatic preview deployments
- Free tier available

**Setup:**
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### AWS Amplify

1. Connect GitHub repository
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm run start`
   - Port: `3000`

### Traditional VPS (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your-repo-url
cd bulk-leather

# Install dependencies
npm install

# Build
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "bulkleather" -- start

# Setup nginx reverse proxy
sudo nano /etc/nginx/sites-available/bulkleather

# Add configuration:
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/bulkleather /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API keys not exposed in frontend
- [ ] CORS properly configured
- [ ] Rate limiting enabled (backend)
- [ ] Input validation on all forms
- [ ] SQL injection prevention (backend)
- [ ] XSS protection headers
- [ ] CSP headers configured

## 🎯 Performance Optimization

### Images
```javascript
// Use Next/Image for optimization
import Image from 'next/image'

<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  loading="lazy"
  quality={85}
/>
```

### Code Splitting
- Already enabled by Next.js
- Dynamic imports for heavy components

### Caching
Configure in `next.config.js`:
```javascript
module.exports = {
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/webp'],
  },
  headers: async () => [
    {
      source: '/:all*(svg|jpg|png)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

## 📊 Analytics Setup

### Google Analytics
```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

### Google Tag Manager
Add to `app/layout.tsx`:
```html
<script
  dangerouslySetInnerHTML={{
    __html: `(function(w,d,s,l,i){...GTM script...})`
  }}
/>
```

## 🗺️ SEO Optimization

### Sitemap
Create `app/sitemap.ts`:
```typescript
export default function sitemap() {
  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
    },
    {
      url: 'https://yourdomain.com/products',
      lastModified: new Date(),
    },
    // Add all pages
  ]
}
```

### Robots.txt
Create `app/robots.ts`:
```typescript
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

### Open Graph Images
Add to page metadata:
```typescript
export const metadata = {
  title: 'BulkLeather',
  openGraph: {
    images: ['/og-image.jpg'],
  },
}
```

## 🔄 CI/CD Setup

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📱 Domain Setup

1. **Purchase Domain** (Namecheap, GoDaddy, etc.)

2. **Configure DNS**
   ```
   A Record: @ → Your server IP
   CNAME: www → yourdomain.com
   ```

3. **Vercel Custom Domain**
   - Project Settings → Domains
   - Add yourdomain.com
   - Follow DNS instructions

## 🧪 Post-Deployment Testing

- [ ] Test on multiple devices
- [ ] Check all pages load
- [ ] Verify forms submit correctly
- [ ] Test theme switcher
- [ ] Check mobile navigation
- [ ] Verify images load
- [ ] Test contact methods (email, WhatsApp)
- [ ] Check Google Maps embed
- [ ] Verify analytics tracking
- [ ] Test page speed (PageSpeed Insights)
- [ ] Check Lighthouse scores

## 📈 Monitoring

### Vercel Analytics
- Enable in Vercel dashboard
- Track Core Web Vitals
- Monitor real user metrics

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Uptime Monitoring
Use services like:
- UptimeRobot
- Pingdom
- StatusCake

## 🔄 Update Process

1. **Make changes locally**
2. **Test thoroughly**
3. **Commit and push**
   ```bash
   git add .
   git commit -m "Update: description"
   git push origin main
   ```
4. **Automatic deployment** (if CI/CD setup)
5. **Manual deployment** (if needed)
   ```bash
   vercel --prod
   ```

## 📞 Post-Launch Checklist

- [ ] Submit to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Test all contact methods
- [ ] Monitor error logs
- [ ] Check analytics setup
- [ ] Set up email notifications for forms
- [ ] Configure backup system
- [ ] Document deployment process
- [ ] Train team on updates

## 🎉 You're Live!

Congratulations on launching your BulkLeather website!

### Next Steps:
1. Monitor analytics
2. Gather user feedback
3. Plan backend integration
4. Iterate and improve

---

**Need help? Check the README or reach out to the development team.**

