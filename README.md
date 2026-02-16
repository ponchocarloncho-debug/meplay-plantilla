# Video Site Template for GitHub Pages

A complete video site template with dark theme, search functionality, favorites system, and widget support.

## 📁 File Structure

```
/
├── index.html              # Home page with all videos
├── favorites.html          # Favorites page
├── template.js            # Template configuration (EDIT THIS!)
├── search.js              # Search functionality
├── widget.js              # Video widget (random/recent videos)
├── videodata.json         # Video database
├── video-template.html    # Template for individual video pages
└── videos/
    ├── video-1.html       # Individual video pages
    ├── video-2.html       # (Create based on video-template.html)
    └── ...
```

## 🚀 Quick Start

### 1. Edit Site Configuration

Open `template.js` and edit the configuration at the top:

```javascript
const SITE_CONFIG = {
  siteName: "Your Site Name",
  logoText: "VIDEO SITE", // Change this
  logoImage: "", // Or add path to logo image
  
  // ADD YOUR AD SCRIPT HERE
  adScript: `
    <script async src="https://your-ad-network.com/script.js"></script>
  `,
  
  socialLinks: {
    twitter: "https://twitter.com/yourhandle",
    instagram: "",
    youtube: ""
  }
};
```

### 2. Test Locally

1. Open a terminal in the project folder
2. Run a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have http-server installed)
   npx http-server
   ```
3. Open browser: `http://localhost:8000`

### 3. Create Video Pages

#### Method A: Copy from template
1. Copy `video-template.html` to `/videos/` folder
2. Rename it (e.g., `diego-yoga.html`)
3. Edit the file:
   - Update `<title>` tag
   - Replace `VIDEO_EMBED_URL_HERE` with embed URL
   - Update video title in `<h1 class="video-title">`
   - Update date and description

#### Method B: Generate from videodata.json
Create a script to auto-generate pages from your videodata.json:

```javascript
// generate-pages.js (optional)
const fs = require('fs');
const videos = JSON.parse(fs.readFileSync('videodata.json'));
const template = fs.readFileSync('video-template.html', 'utf8');

videos.forEach(video => {
  let page = template
    .replace('VIDEO_EMBED_URL_HERE', video.embed)
    .replace('Video Title Here', video.title)
    .replace('2026-01-23', video.date)
    .replace('Video description goes here...', video.description);
  
  const filename = video.url.split('/').pop();
  fs.writeFileSync(`videos/${filename}`, page);
});
```

### 4. Update videodata.json

Add your videos to `videodata.json`:

```json
{
  "title": "Video Title",
  "url": "videos/video-slug.html",
  "thumbnail": "https://example.com/thumb.jpg",
  "description": "Video description",
  "tags": ["tag1", "tag2"],
  "images": ["image1.jpg", "image2.jpg"],
  "embed": "https://embed-url.com/video",
  "date": "2026-01-23"
}
```

### 5. Customize Widget

Edit `widget.js` configuration:

```javascript
const WIDGET_CONFIG = {
  randomVideosCount: 12,      // Number of random videos
  recentVideosCount: 4,       // Number of recent videos
  individualPagesOnlyRandom: false,  // Show only random on video pages
  individualPagesOnlyRecent: false,  // Show only recent on video pages
  prioritizeSameTags: false,  // Prioritize videos with same tags
  sectionOrder: 'random-first' // or 'recent-first'
};
```

## 🎨 Customization

### Change Colors

Edit the inline styles in the template files:

- **Primary color**: `#e50914` (Netflix red) - Search for this and replace
- **Background**: `#141414`, `#1a1a1a`, `#2a2a2a`
- **Text**: `white`, `#888`, `#ccc`

### Add More Sections

Edit `template.js` to add more navigation items in the header section.

### Modify Layout

Edit CSS in individual HTML files:
- `index.html` - Grid layout
- `favorites.html` - Favorites layout
- `video-template.html` - Two-column layout

## 📝 Features

### ✅ Included Features

- **Dark theme** optimized for video sites
- **Search functionality** - Search by title, description, tags
- **Favorites system** - Uses localStorage, works across pages
- **Responsive design** - Mobile, tablet, desktop
- **Random video widget** - Refreshable random videos
- **Recent videos widget** - Load more functionality
- **Sticky header** - Always visible navigation
- **Toast notifications** - When adding/removing favorites
- **SEO friendly** - Proper meta tags and structure
- **Fast loading** - Lazy loading images

### 🔧 Easy Modifications

**Change ad script** → Edit `template.js` → `SITE_CONFIG.adScript`

**Change logo** → Edit `template.js` → `SITE_CONFIG.logoText` or `logoImage`

**Change colors** → Search and replace color codes in files

**Add social links** → Edit `template.js` → `SITE_CONFIG.socialLinks`

## 🌐 Deploy to GitHub Pages

1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select branch (usually `main`) and folder (`/` root)
5. Save and wait for deployment
6. Visit: `https://yourusername.github.io/repository-name`

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🔒 LocalStorage Data

The site uses localStorage to save:
- `favorites` - Array of favorited video URLs

To clear: Open browser console and run:
```javascript
localStorage.clear()
```

## 🐛 Troubleshooting

**Videos not showing:**
- Check `videodata.json` is in root folder
- Check console for errors
- Verify JSON is valid

**Search not working:**
- Ensure `search.js` is loaded
- Check browser console for errors

**Widget not showing:**
- Verify `widget.js` is loaded
- Check `videodata.json` exists

**Favorites not saving:**
- Check browser allows localStorage
- Try clearing localStorage and retry

## 📄 License

Free to use and modify for your projects.

## 💡 Tips

1. **Keep videodata.json organized** - Use consistent naming
2. **Optimize images** - Use compressed thumbnails for faster loading
3. **Test locally first** - Always test changes before deploying
4. **Backup videodata.json** - Keep a backup before making changes
5. **Use meaningful URLs** - Create descriptive filenames for videos

---

**Need help?** Check browser console for error messages.
