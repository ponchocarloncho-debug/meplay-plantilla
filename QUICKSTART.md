# ⚡ Quick Start Guide

Get your video site running in 5 minutes!

## 📦 What You Have

```
✓ index.html          - Main page with all videos
✓ favorites.html      - Favorites page  
✓ template.js         - Site configuration (EDIT THIS!)
✓ search.js           - Search functionality
✓ widget.js           - Video widgets
✓ videodata.json      - Your video database
✓ video-template.html - Template for video pages
✓ videos/            - Folder for individual video pages
```

## 🚀 3 Steps to Launch

### Step 1: Configure Your Site (2 minutes)

Open `template.js` and edit:

```javascript
const SITE_CONFIG = {
  siteName: "My Video Site",        // ← Change this
  logoText: "MY VIDEOS",            // ← Change this
  adScript: `
    <!-- Paste your ad code here -->
  `
};
```

### Step 2: Test Locally (1 minute)

Open terminal in project folder:

```bash
# Simple Python server
python -m http.server 8000

# Or use Node.js
npx http-server
```

Open browser: **http://localhost:8000**

### Step 3: Deploy to GitHub (2 minutes)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

Then: **GitHub Settings → Pages → Select main branch → Save**

Your site will be live at: `https://yourusername.github.io/repo-name`

## ✅ Quick Checks

**Home page working?** → Check videodata.json is present  
**Search not working?** → Open browser console for errors  
**Favorites not saving?** → Check browser allows localStorage  
**Videos not showing?** → Verify JSON syntax is valid  

## 🎯 Next Steps

### Create Video Pages

**Option A: Use script (Fast!)**
```bash
# Node.js
node generate-pages.js

# Python
python generate-pages.py
```

**Option B: Manual**
1. Copy `video-template.html` to `videos/`
2. Rename to match your video URL (e.g., `my-video.html`)
3. Edit the file:
   - Update `<title>`
   - Replace `VIDEO_EMBED_URL_HERE` 
   - Update title and description

### Customize Colors

Edit color variables at the top of `template.js`:
- `#e50914` = Primary color (red)
- `#141414` = Background
- `#2a2a2a` = Cards

Or use the included `styles.css` for more control.

## 🔧 Common Modifications

### Change Logo
```javascript
// In template.js
logoImage: "assets/logo.png",  // Add image path
logoText: "",                  // Clear text
```

### Change Widget Settings
```javascript
// In widget.js
const WIDGET_CONFIG = {
  randomVideosCount: 12,  // Show more/less random videos
  recentVideosCount: 4,   // Show more/less recent videos
};
```

### Add Social Links
```javascript
// In template.js
socialLinks: {
  twitter: "https://twitter.com/yourhandle",
  instagram: "https://instagram.com/yourhandle",
}
```

## 💡 Pro Tips

1. **Always test locally first** before pushing to GitHub
2. **Backup videodata.json** before making changes
3. **Use consistent naming** for video files (lowercase, dashes)
4. **Optimize images** for faster loading
5. **Check browser console** if something doesn't work

## 🆘 Need Help?

1. Check the main **README.md** for detailed docs
2. Look at the example: **videos/diego-yoga.html**
3. Check browser console (F12) for errors
4. Verify JSON syntax at jsonlint.com

## 📚 Files Reference

| File | Purpose | Edit? |
|------|---------|-------|
| `template.js` | Site config, ads, logo | ✅ YES |
| `videodata.json` | Video database | ✅ YES |
| `widget.js` | Widget settings | ✅ YES |
| `index.html` | Home page | ⚠️ Optional |
| `favorites.html` | Favorites page | ⚠️ Optional |
| `search.js` | Search logic | ❌ No need |
| `video-template.html` | Video page template | ⚠️ Copy only |

---

**That's it!** Your site should be running now. 🎉

For advanced customization, see the full README.md
