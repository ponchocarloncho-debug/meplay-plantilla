// ========================================
// CONFIGURATION - Edit these values
// ========================================
const SITE_CONFIG = {
  siteName: "Your Site Name",
  logoText: "VIDEO SITE", // Text shown in logo
  logoImage: "", // Leave empty to use text, or add path to logo image (e.g., "assets/logo.png")
  
  // AD SCRIPT - Place your ad code here (will be injected in <head>)
  adScript: `
    <!-- Your Ad Script Here -->
    <!-- Example: Google AdSense, PropellerAds, etc. -->
    <script async src="https://example.com/ad-script.js"></script>
  `,
  
  // Social links (optional)
  socialLinks: {
    twitter: "",
    instagram: "",
    youtube: ""
  }
};
// ========================================

(function() {
  // Inject ad script in head
  if (SITE_CONFIG.adScript && SITE_CONFIG.adScript.trim() !== '') {
    const adContainer = document.createElement('div');
    adContainer.innerHTML = SITE_CONFIG.adScript;
    const scripts = adContainer.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = script.textContent;
      document.head.appendChild(newScript);
    });
  }

  // Determine current page
  const currentPath = window.location.pathname;
  const isHomePage = currentPath.endsWith('/') || currentPath.endsWith('index.html');
  const isFavoritesPage = currentPath.includes('favorites.html');
  const isVideoPage = currentPath.includes('/videos/');
  
  // Calculate correct paths
  const basePath = isVideoPage ? '../' : './';
  
  // Create header HTML
  const headerHTML = `
    <header style="
      background: #1a1a1a;
      border-bottom: 2px solid #e50914;
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    ">
      <div class="container" style="
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 1rem;
      ">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 1rem;">
          <a href="${basePath}index.html" style="text-decoration: none;">
            ${SITE_CONFIG.logoImage ? 
              `<img src="${basePath}${SITE_CONFIG.logoImage}" alt="${SITE_CONFIG.siteName}" style="max-height: 60px;">` :
              `<h1 style="
                color: #e50914;
                font-size: 2.5rem;
                font-weight: bold;
                margin: 0;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                letter-spacing: 2px;
              ">${SITE_CONFIG.logoText}</h1>`
            }
          </a>
        </div>
        
        <!-- Navigation -->
        <nav style="
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        ">
          <!-- Home Button -->
          <a href="${basePath}index.html" style="
            background: ${isHomePage ? '#e50914' : '#2a2a2a'};
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s;
            border: 2px solid ${isHomePage ? '#e50914' : '#3a3a3a'};
          " onmouseover="if(!this.classList.contains('active')) this.style.background='#3a3a3a'" 
             onmouseout="if(!this.classList.contains('active')) this.style.background='${isHomePage ? '#e50914' : '#2a2a2a'}'">
            🏠 HOME
          </a>
          
          <!-- Favorites Button -->
          <a href="${basePath}favorites.html" style="
            background: ${isFavoritesPage ? '#e50914' : '#2a2a2a'};
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s;
            border: 2px solid ${isFavoritesPage ? '#e50914' : '#3a3a3a'};
            position: relative;
          " onmouseover="if(!this.classList.contains('active')) this.style.background='#3a3a3a'" 
             onmouseout="if(!this.classList.contains('active')) this.style.background='${isFavoritesPage ? '#e50914' : '#2a2a2a'}'">
            ★ FAVORITES
            <span id="favorites-count" style="
              position: absolute;
              top: -8px;
              right: -8px;
              background: #e50914;
              color: white;
              border-radius: 50%;
              padding: 2px 6px;
              font-size: 0.7rem;
              font-weight: bold;
              display: none;
            "></span>
          </a>
          
          <!-- Search Box -->
          <div style="position: relative; flex: 1; max-width: 400px;">
            <input 
              type="text" 
              id="search-input" 
              placeholder="Search videos..."
              style="
                width: 100%;
                padding: 0.75rem 2.5rem 0.75rem 1rem;
                background: #2a2a2a;
                border: 2px solid #3a3a3a;
                border-radius: 4px;
                color: white;
                font-size: 1rem;
                transition: all 0.3s;
              "
              onfocus="this.style.borderColor='#e50914'"
              onblur="this.style.borderColor='#3a3a3a'"
            />
            <span style="
              position: absolute;
              right: 1rem;
              top: 50%;
              transform: translateY(-50%);
              color: #666;
              pointer-events: none;
            ">🔍</span>
          </div>
        </nav>
      </div>
    </header>
    
    <!-- Search Results Container -->
    <div id="search-results" style="
      display: none;
      background: #1a1a1a;
      border-bottom: 2px solid #2a2a2a;
      padding: 1rem;
    ">
      <div class="container" style="max-width: 1400px; margin: 0 auto; padding: 0 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="color: white; margin: 0;">
            Search Results: <span id="search-query" style="color: #e50914;"></span>
          </h3>
          <button id="clear-search" style="
            background: #e50914;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
          ">✕ Clear</button>
        </div>
        <div id="search-results-grid" class="video-grid"></div>
      </div>
    </div>
  `;

  // Create footer HTML
  const footerHTML = `
    <footer style="
      background: #1a1a1a;
      border-top: 2px solid #2a2a2a;
      padding: 2rem 0;
      margin-top: 3rem;
      text-align: center;
      color: #888;
    ">
      <div class="container" style="max-width: 1400px; margin: 0 auto; padding: 0 1rem;">
        <p style="margin: 0 0 1rem 0;">© ${new Date().getFullYear()} ${SITE_CONFIG.siteName}. All rights reserved.</p>
        ${Object.values(SITE_CONFIG.socialLinks).some(link => link) ? `
          <div style="display: flex; gap: 1rem; justify-content: center;">
            ${SITE_CONFIG.socialLinks.twitter ? `<a href="${SITE_CONFIG.socialLinks.twitter}" style="color: #888; transition: color 0.3s;" onmouseover="this.style.color='#1da1f2'" onmouseout="this.style.color='#888'">Twitter</a>` : ''}
            ${SITE_CONFIG.socialLinks.instagram ? `<a href="${SITE_CONFIG.socialLinks.instagram}" style="color: #888; transition: color 0.3s;" onmouseover="this.style.color='#e4405f'" onmouseout="this.style.color='#888'">Instagram</a>` : ''}
            ${SITE_CONFIG.socialLinks.youtube ? `<a href="${SITE_CONFIG.socialLinks.youtube}" style="color: #888; transition: color 0.3s;" onmouseover="this.style.color='#ff0000'" onmouseout="this.style.color='#888'">YouTube</a>` : ''}
          </div>
        ` : ''}
      </div>
    </footer>
  `;

  // Inject header at the start of body
  document.body.insertAdjacentHTML('afterbegin', headerHTML);
  
  // Inject footer at the end of body
  document.body.insertAdjacentHTML('beforeend', footerHTML);
  
  // Update favorites count
  function updateFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const countElement = document.getElementById('favorites-count');
    if (countElement) {
      if (favorites.length > 0) {
        countElement.textContent = favorites.length;
        countElement.style.display = 'block';
      } else {
        countElement.style.display = 'none';
      }
    }
  }
  
  updateFavoritesCount();
  
  // Listen for storage changes to update count
  window.addEventListener('storage', updateFavoritesCount);
  
  // Also update when favorites change in the same tab
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'favorites') {
      updateFavoritesCount();
    }
  };
})();
