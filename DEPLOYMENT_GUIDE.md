# 🚀 TrackStudy Deployment Guide

TrackStudy is a fully self-contained static site that works on any hosting platform. Follow the steps below for your preferred deployment method.

## 📋 Prerequisites
- Built app in `dist/` folder (run `npm run build`)
- Firebase project with domain whitelisting configured
- Hosting platform account

## 🌐 Quick Deployment Options

### Option 1: GitHub Pages (Free, Automatic)
**Best for**: Open source projects, quick setup

```bash
# 1. Push code to GitHub
git add .
git commit -m "Deploy TrackStudy"
git push origin main

# 2. Enable GitHub Pages:
#    Settings → Pages → Source: Deploy from branch
#    Branch: main → folder: /(root) or /docs
```

**Then whitelist your domain in Firebase:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `my-study-dashboard`
3. Authentication → Settings → Authorized Domains
4. Add: `yourusername.github.io`

---

### Option 2: Vercel (Free, Recommended)
**Best for**: Professional deployments, automatic CI/CD

```bash
# 1. Connect GitHub repo to Vercel
#    Visit: https://vercel.com/new

# 2. Select TrackStudy repository
# 3. Deploy (Vercel auto-detects Vite)
```

**Then whitelist in Firebase:**
1. Firebase Console → Authorized Domains
2. Add: `your-project.vercel.app`

---

### Option 3: Netlify (Free)
**Best for**: Quick deployment without GitHub

```bash
# 1. Drag and drop dist/ folder to Netlify
#    Visit: https://app.netlify.com/drop

# 2. Wait for deployment
```

**Then whitelist in Firebase:**
1. Firebase Console → Authorized Domains
2. Add the Netlify domain (shown after deployment)

---

### Option 4: Any Static Hosting
**Best for**: Complete control

```bash
# 1. Upload dist/ folder to:
#    - AWS S3 + CloudFront
#    - Google Cloud Storage
#    - Cloudflare Pages
#    - Any static host
```

**Then whitelist in Firebase:**
1. Firebase Console → Authorized Domains
2. Add your custom domain

---

## 🔐 Firebase Domain Whitelisting (Required Step)

This is the critical step for authentication to work:

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com
   ```

2. **Select project:** `my-study-dashboard`

3. **Navigate to:**
   ```
   Authentication → Settings → Authorized Domains
   ```

4. **Add your deployment domain:**
   - GitHub Pages: `yourusername.github.io`
   - Vercel: `your-app.vercel.app`
   - Netlify: `your-app.netlify.app`
   - Custom: `yourdom.com`

5. **Save and wait 5-10 minutes for propagation**

---

## ✅ Testing After Deployment

1. Visit your deployed URL
2. Click "Go To Your Personal Study Tracker"
3. Test login/signup functionality
4. Verify password recovery and change features work

---

## 📱 Features That Work Everywhere

✓ Complete offline support (PWA)  
✓ Password recovery  
✓ Password change  
✓ Guest login  
✓ Syllabus tracking  
✓ All UI features  

---

## 🆘 Troubleshooting

### "Account not found or incorrect password"
**Cause:** Firebase domain not whitelisted  
**Fix:** Add your domain to Authorized Domains in Firebase Console

### App loads but login fails
**Cause:** Domain propagation delay  
**Fix:** Wait 10 minutes and try again, or clear browser cache

### Build fails
**Run locally first:**
```bash
npm run build  # Should complete without errors
npm run preview  # Test the build
```

---

## 🔄 Continuous Updates

After deployment, push changes to trigger automatic rebuilds:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Your deployment platform will automatically rebuild and deploy!

---

## 💡 Tips

- **Always build locally before deploying:** `npm run build`
- **Test locally first:** `npm run dev`
- **Clear browser cache if changes don't appear**
- **Check Firebase Console for domain errors**

---

Need help? Check the [Firebase Auth Troubleshooting Guide](https://firebase.google.com/docs/auth/web/manage-domains)
