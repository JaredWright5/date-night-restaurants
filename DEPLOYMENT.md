# 🚀 Deployment Guide for Date Night Restaurants

## Quick Deploy Options

### Option 1: Netlify (Recommended - Easiest)

**Why Netlify?**
- ✅ Perfect for Astro static sites
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Easy domain connection
- ✅ Automatic deployments from Git
- ✅ Free tier with generous limits

**Steps:**

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub (recommended)

2. **Deploy from Git (Recommended)**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Connect to Netlify**
   - In Netlify dashboard, click "New site from Git"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

4. **Connect Your Domain**
   - In Netlify dashboard → Site settings → Domain management
   - Add custom domain: `datenightrestaurants.com`
   - Update DNS records at your domain registrar:
     ```
     Type: A
     Name: @
     Value: 75.2.60.5
     
     Type: CNAME
     Name: www
     Value: your-site-name.netlify.app
     ```

### Option 2: Vercel (Also Excellent)

**Why Vercel?**
- ✅ Excellent for Astro
- ✅ Automatic deployments
- ✅ Edge functions support
- ✅ Great performance

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Connect Domain**
   - In Vercel dashboard → Project settings → Domains
   - Add `datenightrestaurants.com`

### Option 3: GitHub Pages (Free)

**Steps:**

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Use the workflow below

2. **Create GitHub Actions Workflow**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

## Domain Configuration

### DNS Settings for Your Domain

**For Netlify:**
```
Type: A Record
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

**For Vercel:**
```
Type: A Record
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Post-Deployment Checklist

### ✅ Essential Steps

1. **Test Your Site**
   - Visit `https://datenightrestaurants.com`
   - Check all pages load correctly
   - Test mobile responsiveness

2. **SEO Setup**
   - Submit sitemap to Google Search Console
   - Verify domain ownership
   - Check meta tags are working

3. **Analytics Setup**
   - Add Google Analytics
   - Set up Google Search Console
   - Monitor site performance

4. **SSL Certificate**
   - Verify HTTPS is working
   - Check certificate is valid

### 🔧 Optional Enhancements

1. **Performance Optimization**
   - Enable compression
   - Set up caching headers
   - Optimize images

2. **Monitoring**
   - Set up uptime monitoring
   - Error tracking
   - Performance monitoring

## Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version (use 18+)
- Clear node_modules and reinstall
- Check for TypeScript errors

**Domain Not Working:**
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct
- Verify domain is properly connected

**SSL Issues:**
- Wait for automatic SSL certificate
- Check domain configuration
- Contact hosting provider if needed

## Next Steps After Deployment

1. **Content Management**
   - Set up a CMS for easy content updates
   - Consider Strapi or Sanity

2. **Marketing**
   - Set up Google My Business
   - Create social media accounts
   - Start SEO optimization

3. **Analytics**
   - Install Google Analytics
   - Set up conversion tracking
   - Monitor user behavior

## Support

If you encounter any issues:
- Check the hosting provider's documentation
- Review build logs for errors
- Test locally with `npm run build && npm run preview`

---

**Ready to go live?** Choose your preferred option and follow the steps above! 🚀
