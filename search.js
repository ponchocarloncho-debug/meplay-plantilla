// Search functionality
(function() {
  let videosData = [];
  
  // Load videos data
  async function loadVideosData() {
    try {
      const currentPath = window.location.pathname;
      const isInVideosFolder = currentPath.includes('/videos/');
      const jsonPath = isInVideosFolder ? '../videodata.json' : 'videodata.json';
      
      const response = await fetch(jsonPath);
      if (!response.ok) return;
      
      videosData = await response.json();
      console.log('Search: Loaded', videosData.length, 'videos');
    } catch (error) {
      console.warn('Could not load video data for search');
    }
  }
  
  // Create video card HTML
  function createVideoCard(video) {
    const currentPath = window.location.pathname;
    const isInVideosFolder = currentPath.includes('/videos/');
    
    // Get persistent random image
    const imageMap = JSON.parse(localStorage.getItem('videoImageMap') || '{}');
    let thumbnail;
    
    if (imageMap[video.url]) {
      thumbnail = imageMap[video.url];
    } else {
      const images = video.images || [video.thumbnail];
      thumbnail = images[Math.floor(Math.random() * images.length)];
      imageMap[video.url] = thumbnail;
      localStorage.setItem('videoImageMap', JSON.stringify(imageMap));
    }
    
    // Normalize URL
    let videoUrl = video.url;
    if (!videoUrl.startsWith('http') && !videoUrl.startsWith('/')) {
      if (!isInVideosFolder && !videoUrl.startsWith('videos/')) {
        videoUrl = 'videos/' + videoUrl;
      } else if (isInVideosFolder && videoUrl.startsWith('videos/')) {
        videoUrl = '../' + videoUrl;
      }
    }
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorited = favorites.includes(video.url);
    
    return `
      <div class="video-card" style="
        background: #2a2a2a;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
        cursor: pointer;
        position: relative;
      " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(229,9,20,0.3)'"
         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
        <a href="${videoUrl}" class="video-link" style="text-decoration: none; color: inherit;">
          <div style="position: relative; padding-top: 56.25%; overflow: hidden; background: #1a1a1a;">
            <img src="${thumbnail}" alt="${video.title}" style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
            " loading="lazy" />
          </div>
          <div style="padding: 1rem;">
            <h3 style="
              color: white;
              font-size: 1rem;
              margin: 0;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            ">${video.title}</h3>
          </div>
        </a>
        <button 
          class="favorite-btn ${isFavorited ? 'favorited' : ''}"
          onclick="toggleFavorite(this, event)"
          data-video-url="${video.url}"
          data-video-title="${video.title}"
          style="
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            background: rgba(0,0,0,0.9);
            border: none;
            padding: 0.5rem;
            border-radius: 50%;
            font-size: 1.3rem;
            cursor: pointer;
            z-index: 10;
            line-height: 1;
            transition: all 0.3s;
            color: ${isFavorited ? '#e50914' : '#666'};
          "
        >${isFavorited ? '★' : '☆'}</button>
      </div>
    `;
  }
  
  // Perform search
  function performSearch(query) {
    const searchResults = document.getElementById('search-results');
    const searchResultsGrid = document.getElementById('search-results-grid');
    const searchQuerySpan = document.getElementById('search-query');
    
    if (!query || query.trim() === '') {
      searchResults.style.display = 'none';
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = videosData.filter(video => {
      return video.title.toLowerCase().includes(lowerQuery) ||
             (video.description && video.description.toLowerCase().includes(lowerQuery)) ||
             (video.tags && video.tags.some(tag => tag.toLowerCase().includes(lowerQuery)));
    });
    
    searchQuerySpan.textContent = query;
    
    if (filtered.length === 0) {
      searchResultsGrid.innerHTML = '<p style="color: #888; text-align: center; padding: 2rem;">No videos found</p>';
    } else {
      searchResultsGrid.innerHTML = filtered.map(video => createVideoCard(video)).join('');
      searchResultsGrid.style.display = 'grid';
      searchResultsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
      searchResultsGrid.style.gap = '1.5rem';
    }
    
    searchResults.style.display = 'block';
    searchResults.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Initialize search
  function initSearch() {
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;
    
    // Debounce search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(e.target.value);
      }, 300);
    });
    
    // Clear search
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchResults.style.display = 'none';
      });
    }
    
    // Search on Enter
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch(searchInput.value);
      }
    });
  }
  
  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadVideosData().then(initSearch);
    });
  } else {
    loadVideosData().then(initSearch);
  }
})();
