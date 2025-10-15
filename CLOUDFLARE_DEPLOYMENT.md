# 🚀 Cloudflare Deployment Guide for Date Night Restaurants

## Why Cloudflare?
- ✅ **Free hosting** with generous limits
- ✅ **Global CDN** for fast loading worldwide
- ✅ **Free SSL certificates** automatically
- ✅ **Easy domain management** 
- ✅ **Built-in analytics** and security
- ✅ **Page Rules** for advanced routing

## Method 1: Cloudflare Pages (Recommended)

### Step 1: Prepare Your Repository
```bash
# Initialize git if you haven't already
git init
git add .
git commit -m "Initial commit - Date Night Restaurants website"

# Push to GitHub (create repo first at github.com)
git remote add origin https://github.com/yourusername/date-night-restaurants.git
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages
1. **Go to Cloudflare Dashboard**
   - Visit [dash.cloudflare.com](https://dash.cloudflare.com)
   - Sign up/login with your account

2. **Create New Pages Project**
   - Click "Pages" in the left sidebar
   - Click "Create a project"
   - Click "Connect to Git"

3. **Connect GitHub Repository**
   - Select your `date-night-restaurants` repository
   - Click "Begin setup"

4. **Configure Build Settings**
   ```
   Project name: date-night-restaurants
   Production branch: main
   Framework preset: Astro
   Build command: npm run build
   Build output directory: dist
   ```

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete (2-3 minutes)

### Step 3: Connect Your Domain
1. **Add Custom Domain**
   - In your Pages project, go to "Custom domains"
   - Click "Set up a custom domain"
   - Enter: `datenightrestaurants.com`
   - Click "Continue"

2. **Update DNS Records**
   - Cloudflare will show you the DNS records to add
   - Go to your domain registrar (where you bought the domain)
   - Update nameservers to Cloudflare's:
     ```
     Nameserver 1: [Cloudflare will provide]
     Nameserver 2: [Cloudflare will provide]
     ```

## Method 2: Cloudflare Workers (Advanced)

### Step 1: Install Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### Step 2: Create Workers Project
```bash
# Create new Workers project
wrangler generate date-night-restaurants
cd date-night-restaurants

# Install dependencies
npm install
```

### Step 3: Configure for Static Site
Create `wrangler.toml`:
```toml
name = "date-night-restaurants"
compatibility_date = "2023-12-01"

[site]
bucket = "./dist"
```

### Step 4: Deploy
```bash
# Build your site first
cd /path/to/your/project
npm run build

# Deploy to Cloudflare Workers
wrangler pages deploy dist --project-name=date-night-restaurants
```

## Method 3: Cloudflare R2 + Workers (Most Flexible)

### Step 1: Set Up R2 Bucket
1. **Create R2 Bucket**
   - Go to Cloudflare Dashboard → R2 Object Storage
   - Click "Create bucket"
   - Name: `date-night-restaurants`
   - Click "Create bucket"

2. **Upload Your Site**
   ```bash
   # Install R2 CLI
   npm install -g @cloudflare/workers-types
   
   # Upload dist folder
   r2 cp dist/ r2://date-night-restaurants/ --recursive
   ```

### Step 2: Create Workers Script
Create `worker.js`:
```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Serve static files from R2
    const object = await env.MY_BUCKET.get(url.pathname);
    
    if (object === null) {
      return new Response('Not Found', { status: 404 });
    }
    
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata.contentType,
      },
    });
  },
};
```

## DNS Configuration

### If Using Cloudflare Nameservers
1. **Change Nameservers at Domain Registrar**
   ```
   Nameserver 1: [Provided by Cloudflare]
   Nameserver 2: [Provided by Cloudflare]
   ```

2. **Add DNS Records in Cloudflare**
   ```
   Type: A
   Name: @
   Content: [Your server IP or Cloudflare IP]
   Proxy: ✅ (Orange cloud)
   
   Type: CNAME
   Name: www
   Content: your-site.pages.dev
   Proxy: ✅ (Orange cloud)
   ```

### If Keeping Current Nameservers
```
Type: A
Name: @
Content: 104.21.0.0 (or any Cloudflare IP)

Type: CNAME
Name: www
Content: your-site.pages.dev
```

## Post-Deployment Configuration

### 1. SSL/TLS Settings
- **SSL/TLS encryption mode**: Full (strict)
- **Edge certificates**: Enabled
- **Always Use HTTPS**: Enabled

### 2. Performance Settings
- **Auto Minify**: HTML, CSS, JavaScript
- **Brotli Compression**: Enabled
- **Rocket Loader**: Enabled (optional)

### 3. Caching Rules
Create Page Rules:
```
URL Pattern: datenightrestaurants.com/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 day
```

### 4. Security Settings
- **Security Level**: Medium
- **Bot Fight Mode**: Enabled
- **DDoS Protection**: Enabled

## Environment Variables (if needed)

### For Pages Projects
1. Go to Pages project → Settings → Environment variables
2. Add any needed variables:
   ```
   NODE_VERSION=18
   NPM_VERSION=9
   ```

## Monitoring and Analytics

### 1. Cloudflare Analytics
- **Web Analytics**: Free, built-in
- **Real User Monitoring**: Available in Pro plan
- **Core Web Vitals**: Track performance metrics

### 2. Custom Analytics
Add to your site:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Domain Not Working:**
- Wait 24-48 hours for DNS propagation
- Check nameservers are correct
- Verify DNS records in Cloudflare dashboard

**SSL Issues:**
- Ensure "Always Use HTTPS" is enabled
- Check SSL/TLS mode is set to "Full (strict)"
- Wait for certificate provisioning

**Performance Issues:**
- Enable Cloudflare's optimization features
- Check caching rules
- Monitor Core Web Vitals

## Advanced Features

### 1. Custom Error Pages
Create `404.html` in your `dist` folder:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Page Not Found - Date Night Restaurants</title>
</head>
<body>
    <h1>Oops! Page Not Found</h1>
    <p>This restaurant page doesn't exist yet.</p>
    <a href="/">Back to Home</a>
</body>
</html>
```

### 2. Redirects
Create `_redirects` file in `public` folder:
```
/old-page /new-page 301
/restaurant/* /restaurants/:splat 301
```

### 3. Headers
Create `_headers` file in `public` folder:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

## Cost Breakdown

### Free Tier Includes:
- ✅ **100,000 requests/month**
- ✅ **Unlimited bandwidth**
- ✅ **Global CDN**
- ✅ **Free SSL certificates**
- ✅ **Basic analytics**
- ✅ **DDoS protection**

### Paid Plans (if needed):
- **Pro**: $20/month - Advanced features
- **Business**: $200/month - Priority support
- **Enterprise**: Custom pricing

## Next Steps After Deployment

1. **Test Your Site**
   - Visit `https://datenightrestaurants.com`
   - Check all pages load correctly
   - Test mobile responsiveness

2. **SEO Setup**
   - Submit sitemap to Google Search Console
   - Verify domain ownership
   - Set up Google Analytics

3. **Performance Optimization**
   - Enable Cloudflare's optimization features
   - Monitor Core Web Vitals
   - Set up caching rules

4. **Security**
   - Enable security features
   - Set up monitoring
   - Configure firewall rules

---

**Ready to deploy?** Choose Method 1 (Cloudflare Pages) for the easiest setup! 🚀
