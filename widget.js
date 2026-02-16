/* ============================================================================
   VIDEO WIDGET - CONFIGURATION PANEL
   ============================================================================
   
   📋 INSTRUCCIONES:
   Edita los valores abajo para cambiar cómo se muestran los videos en tu sitio.
   Después de cambiar, guarda el archivo y refresca la página.
   
   ============================================================================ */

// ========== INDEX PAGE (Página Principal) ==========
const CONFIG_INDEX = {
    RANDOM_VIDEOS: 16,           // Cantidad de videos random en la página principal
    RECENTS_INITIAL: 4,          // Videos recents que se muestran inicialmente
    RECENTS_LOAD_MORE: 4,        // Cuántos más se cargan al presionar "Load more recents"
};

// ========== FAVORITES PAGE ==========
const CONFIG_FAVORITES = {
    INITIAL_DISPLAY: 8,          // Cantidad inicial de favoritos mostrados
    LOAD_MORE_AMOUNT: 4,         // Cuántos más se cargan al hacer click en "Load More"
};

// ========== IMAGE SLIDESHOW (Animación al pasar el mouse) ==========
const CONFIG_SLIDESHOW = {
    ENABLED: true,               // true = activado, false = desactivado
    HOVER_DELAY: 300,            // Milisegundos de espera antes de empezar (300 = 0.3 segundos)
    SLIDE_SPEED: 500,            // Milisegundos entre cada imagen (500 = 0.5 segundos)
    MAX_IMAGES: 4,               // Máximo de imágenes a usar por card (más imágenes = más datos)
};

/* ============================================================================
   FIN DE CONFIGURACIÓN - NO EDITES DEBAJO DE ESTA LÍNEA
   ============================================================================ */

// widget.js - Video management system (adapted for user's data structure)

let videosData = [];
let randomVideoPool = [];

// Load video data from videodata.json
async function loadVideoData() {
    try {
        // Detectar si estamos en subcarpeta (videos/)
        const isInSubfolder = window.location.pathname.includes('/videos/');
        const dataPath = isInSubfolder ? '../videodata.json' : 'videodata.json';
        
        const response = await fetch(dataPath);
        const data = await response.json();
        
        // Transform data to add IDs (extract from URL)
        videosData = data.map(video => {
            // Extract ID from URL: "videos/diego-yoga.html" -> "diego-yoga"
            const urlParts = video.url.split('/');
            const filename = urlParts[urlParts.length - 1];
            const id = filename.replace('.html', '');
            
            return {
                ...video,
                id: id,
                views: Math.floor(Math.random() * 50000) + 5000 // Generate random views for display
            };
        });
        
        resetRandomPool();
        console.log('✓ Video data loaded:', videosData.length, 'videos');
        return videosData;
    } catch (error) {
        console.error('✗ Error loading videodata.json:', error);
        alert('Error: Could not load videodata.json. Make sure the file is in the same folder.');
        return [];
    }
}

// Reset random pool
function resetRandomPool() {
    randomVideoPool = [...videosData.map(v => v.id)];
    shuffleArray(randomVideoPool);
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Get 16 random videos WITHOUT repetition
function getRandomVideos(count = 16, excludeId = null) {
    const results = [];
    
    while (results.length < count && randomVideoPool.length > 0) {
        const videoId = randomVideoPool.shift();
        
        if (videoId !== excludeId) {
            const video = videosData.find(v => v.id === videoId);
            if (video) results.push(video);
        }
        
        if (randomVideoPool.length === 0 && results.length < count) {
            resetRandomPool();
        }
    }
    
    return results;
}

// Get recent videos - LAST items in array are most recent
function getRecentVideos(count = 12) {
    return [...videosData]
        .slice(-count)  // Get last N items
        .reverse();     // Reverse to show newest first
}

// Search videos
function searchVideos(query) {
    const lowerQuery = query.toLowerCase();
    return videosData.filter(video => 
        video.title.toLowerCase().includes(lowerQuery) ||
        (video.tags && video.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
        (video.description && video.description.toLowerCase().includes(lowerQuery))
    );
}

// Favorites
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function isFavorite(videoId) {
    return getFavorites().includes(videoId);
}

function toggleFavorite(videoId) {
    let favorites = getFavorites();
    
    if (favorites.includes(videoId)) {
        favorites = favorites.filter(id => id !== videoId);
    } else {
        favorites.unshift(videoId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return favorites.includes(videoId);
}

// Format views
function formatViews(views) {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
}

// Get fire emoji based on views (NOTE: Views are randomly generated between 5K-55K on page load)
function getFireRating(views) {
    if (views >= 45000) return '🔥🔥🔥🔥🔥'; // 5 fires for 45K+
    if (views >= 35000) return '🔥🔥🔥🔥';   // 4 fires for 35K+
    if (views >= 25000) return '🔥🔥🔥';     // 3 fires for 25K+
    if (views >= 15000) return '🔥🔥';       // 2 fires for 15K+
    return '🔥';                            // 1 fire for <15K
}

// Format date (relative time)
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return diffDays + 'd ago';
    if (diffDays < 30) return Math.floor(diffDays / 7) + 'w ago';
    if (diffDays < 365) return Math.floor(diffDays / 30) + 'mo ago';
    return Math.floor(diffDays / 365) + 'y ago';
}

// Create video card
function createVideoCard(video, showRemoveButton = false, isRecent = false) {
    const isFav = isFavorite(video.id);
    
    // Pick RANDOM image from images array on each reload
    const randomImage = video.images && video.images.length > 0 
        ? video.images[Math.floor(Math.random() * video.images.length)]
        : video.thumbnail;
    
    // Prepare slideshow images (configured max for performance)
    const slideshowImages = video.images && video.images.length > 1 
        ? JSON.stringify(video.images.slice(0, CONFIG_SLIDESHOW.MAX_IMAGES))
        : '[]';
    
    // Different meta info - Recents no muestra nada, Random muestra views
    const metaInfo = isRecent ? '' : `<span>👁 ${formatViews(video.views)}</span>`;
    
    return `
        <div class="video-card" data-video-id="${video.id}" data-images='${slideshowImages}' onmouseenter="startImageSlideshow(this)" onmouseleave="stopImageSlideshow(this)">
            <a href="${video.url}" class="video-link">
                <div class="video-thumbnail">
                    <img src="${randomImage}" alt="${video.title}" loading="lazy" class="card-main-img">
                    <div class="video-overlay">
                        <span class="play-icon">▶</span>
                    </div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <div class="video-meta">
                        ${metaInfo}
                    </div>
                </div>
            </a>
            ${showRemoveButton ? 
                `<button class="remove-x-btn" onclick="handleRemoveFavorite(event, '${video.id}')" title="Remove from favorites">✕</button>` :
                `<button class="favorite-btn ${isFav ? 'active' : ''}" onclick="handleFavoriteClick(event, '${video.id}')" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">⭐</button>`
            }
        </div>
    `;
}

// Image slideshow on hover (optimized - only loads on hover)
const slideshowTimers = new Map();
const slideshowIntervals = new Map();

function startImageSlideshow(card) {
    // Check if feature is enabled
    if (!CONFIG_SLIDESHOW.ENABLED) return;
    
    const images = JSON.parse(card.getAttribute('data-images') || '[]');
    
    // Only start if there are multiple images
    if (images.length <= 1) return;
    
    // Clear any existing timer/interval for this card
    if (slideshowTimers.has(card)) {
        clearTimeout(slideshowTimers.get(card));
    }
    if (slideshowIntervals.has(card)) {
        clearInterval(slideshowIntervals.get(card));
    }
    
    // Delay before starting (avoid accidental hovers)
    const timer = setTimeout(() => {
        let currentIndex = 0;
        const img = card.querySelector('.card-main-img');
        if (!img) return;
        
        // Start slideshow
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            img.src = images[currentIndex];
        }, CONFIG_SLIDESHOW.SLIDE_SPEED); // Use configured speed
        
        slideshowIntervals.set(card, interval);
    }, CONFIG_SLIDESHOW.HOVER_DELAY); // Use configured delay
    
    slideshowTimers.set(card, timer);
}

function stopImageSlideshow(card) {
    // Clear timer if still waiting
    if (slideshowTimers.has(card)) {
        clearTimeout(slideshowTimers.get(card));
        slideshowTimers.delete(card);
    }
    
    // Clear interval if running
    if (slideshowIntervals.has(card)) {
        clearInterval(slideshowIntervals.get(card));
        slideshowIntervals.delete(card);
    }
    
    // Reset to original image
    const images = JSON.parse(card.getAttribute('data-images') || '[]');
    const img = card.querySelector('.card-main-img');
    if (img && images.length > 0) {
        // Keep the last shown image (don't reset) for better UX
        // Or uncomment below to reset to first image:
        // img.src = images[0];
    }
}

// Create sidebar video (2 columns)
function createSidebarVideoItem(video) {
    // Pick RANDOM image from images array on each reload
    const randomImage = video.images && video.images.length > 0 
        ? video.images[Math.floor(Math.random() * video.images.length)]
        : video.thumbnail;
    
    return `
        <div class="sidebar-video-item">
            <a href="${video.id}.html" class="sidebar-video-link">
                <img src="${randomImage}" alt="${video.title}" class="sidebar-video-thumb">
                <div class="sidebar-video-info">
                    <div class="sidebar-video-title">${video.title}</div>
                    <div class="sidebar-video-meta">👁 ${formatViews(video.views)}</div>
                </div>
            </a>
        </div>
    `;
}

// Handle favorite click
function handleFavoriteClick(event, videoId) {
    event.preventDefault();
    event.stopPropagation();
    
    const isNowFavorite = toggleFavorite(videoId);
    const button = event.currentTarget;
    
    if (isNowFavorite) {
        button.classList.add('active');
        button.title = 'Remove from favorites';
    } else {
        button.classList.remove('active');
        button.title = 'Add to favorites';
    }
}

// Handle remove favorite
function handleRemoveFavorite(event, videoId) {
    event.preventDefault();
    event.stopPropagation();
    
    toggleFavorite(videoId);
    loadFavoritesPage();
}

// Load videos into container
function loadVideosIntoContainer(containerId, videos, useSidebarStyle = false, showRemoveButton = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (videos.length === 0) {
        container.innerHTML = '<p style="color: #888; text-align: center; grid-column: 1/-1;">No videos available</p>';
        return;
    }
    
    const html = videos.map(video => 
        useSidebarStyle ? createSidebarVideoItem(video) : createVideoCard(video, showRemoveButton)
    ).join('');
    
    container.innerHTML = html;
}

// Load favorites page with pagination
let currentFavoritesPage = 1;
const FAVORITES_PER_PAGE = CONFIG_FAVORITES.INITIAL_DISPLAY;

// Load recents page with pagination
let currentRecentsPage = 1;
const RECENTS_PER_PAGE = CONFIG_INDEX.RECENTS_INITIAL;

function loadRecentsPage() {
    const recentVideos = getRecentVideos(videosData.length);
    const container = document.getElementById('recentVideos');
    if (!container) return;
    
    const totalToShow = currentRecentsPage * RECENTS_PER_PAGE;
    const videosToShow = recentVideos.slice(0, totalToShow);
    const hasMore = recentVideos.length > totalToShow;
    
    let html = videosToShow.map(video => createVideoCard(video, false, true)).join(''); // isRecent = true
    
    if (hasMore) {
        html += `
            <div style="grid-column: 1/-1; text-align: center; margin-top: 20px;">
                <button onclick="loadMoreRecents()" class="load-more-btn-big">Load more recents</button>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function loadMoreRecents() {
    currentRecentsPage++;
    loadRecentsPage();
}

function loadFavoritesPage() {
    const favoriteIds = getFavorites();
    const favoriteVideos = favoriteIds.map(id => videosData.find(v => v.id === id)).filter(v => v);
    
    const container = document.getElementById('favoritesVideos');
    if (!container) return;
    
    if (favoriteVideos.length === 0) {
        container.innerHTML = `
            <p style="color: #888; text-align: center; grid-column: 1/-1; padding: 60px 20px; font-size: 18px;">
                You haven't added any favorites yet.<br>
                Add videos to your favorites from the main page.
            </p>
        `;
        return;
    }
    
    const totalToShow = currentFavoritesPage * FAVORITES_PER_PAGE;
    const videosToShow = favoriteVideos.slice(0, totalToShow);
    const hasMore = favoriteVideos.length > totalToShow;
    
    let html = videosToShow.map(video => createVideoCard(video, true)).join('');
    
    if (hasMore) {
        html += `
            <div style="grid-column: 1/-1; text-align: center; margin-top: 20px;">
                <button onclick="loadMoreFavorites()" class="load-more-btn">Load More Favorites (${favoriteVideos.length - totalToShow} remaining)</button>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function loadMoreFavorites() {
    currentFavoritesPage++;
    loadFavoritesPage();
}

// Initialize widget
async function initWidget() {
    console.log('Initializing widget...');
    await loadVideoData();
    
    // Export data globally DESPUÉS de cargar
    window.videosData = videosData;
    
    const randomContainer = document.getElementById('randomVideos');
    const recentContainer = document.getElementById('recentVideos');
    const favoritesContainer = document.getElementById('favoritesVideos');
    const sidebarList = document.getElementById('randomVideosList');
    
    if (randomContainer && recentContainer) {
        console.log('Loading home page videos...');
        const randomVideos = getRandomVideos(CONFIG_INDEX.RANDOM_VIDEOS);
        
        loadVideosIntoContainer('randomVideos', randomVideos);
        
        // Load recents with pagination
        currentRecentsPage = 1;
        loadRecentsPage();
        
        console.log('✓ Home page loaded');
    }
    
    if (favoritesContainer) {
        console.log('Loading favorites page...');
        currentFavoritesPage = 1;
        loadFavoritesPage();
        console.log('✓ Favorites page loaded');
    }
    
    if (sidebarList) {
        // Skip loading - video pages handle their own sidebar
        // The generate_video_pages.py script creates custom sidebar
        console.log('✓ Sidebar container detected (handled by page script)');
    }
    
    console.log('✓ Widget initialized successfully');
}

// Inject styles
const widgetStyles = `
<style>
    .video-card {
        background-color: #2a2a2a;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
        cursor: pointer;
        position: relative;
    }
    
    .video-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(229, 9, 20, 0.3);
    }
    
    .video-link {
        text-decoration: none;
        color: inherit;
        display: block;
    }
    
    .video-thumbnail {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%;
        overflow: hidden;
        background-color: #1a1a1a;
    }
    
    .video-thumbnail img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .video-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .video-card:hover .video-overlay {
        opacity: 1;
    }
    
    .play-icon {
        font-size: 48px;
        color: #e50914;
    }
    
    .video-tag-badge {
        position: absolute;
        bottom: 8px;
        left: 8px;
        background-color: rgba(229, 9, 20, 0.9);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .video-info {
        padding: 15px;
    }
    
    .video-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #ffffff;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.4;
    }
    
    .video-meta {
        font-size: 14px;
        color: #888;
    }
    
    /* Favorite Star - RIGHT SIDE */
    .favorite-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 204, 0, 0.4);
        line-height: 1;
        padding: 0;
    }
    
    .favorite-btn:hover {
        background-color: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
        color: rgba(255, 204, 0, 0.7);
    }
    
    .favorite-btn.active {
        background-color: #e50914;
        filter: brightness(1.2);
        color: #ffffff;
    }
    
    /* Remove X button para favorites page - más discreto */
    .remove-x-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.6);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        font-size: 18px;
        font-weight: normal;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.3s;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        padding: 0;
    }
    
    .remove-x-btn:hover {
        background-color: #e50914;
        color: white;
        transform: scale(1.1);
    }
    
    /* Favorites counter badge */
    .favorites-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #e50914;
        color: white;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        font-size: 11px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #0f0f0f;
    }
    
    .remove-btn {
        position: absolute;
        bottom: 15px;
        right: 15px;
        background-color: #e50914;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s;
        z-index: 10;
    }
    
    .remove-btn:hover {
        background-color: #ff0a16;
    }
    
    .load-more-btn {
        background-color: #e50914;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .load-more-btn:hover {
        background-color: #ff0a16;
    }
    
    .load-more-btn-big {
        background-color: #e50914;
        color: white;
        border: none;
        padding: 18px 50px;
        border-radius: 8px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .load-more-btn-big:hover {
        background-color: #ff0a16;
        transform: scale(1.05);
    }
    
    .video-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 25px;
        margin-bottom: 50px;
    }
    
    .video-section h2 {
        font-size: 28px;
        margin-bottom: 25px;
        color: #ffffff;
        border-left: 4px solid #e50914;
        padding-left: 15px;
    }
    
    /* Sidebar - 2 COLUMNS */
    #randomVideosList {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }
    
    .sidebar-video-item {
        background-color: #2a2a2a;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s;
    }
    
    .sidebar-video-item:hover {
        transform: scale(1.05);
    }
    
    .sidebar-video-link {
        display: block;
        text-decoration: none;
        color: inherit;
    }
    
    .sidebar-video-thumb {
        width: 100%;
        aspect-ratio: 16/9;
        object-fit: cover;
    }
    
    .sidebar-video-info {
        padding: 10px;
    }
    
    .sidebar-video-title {
        font-size: 13px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.3;
    }
    
    .sidebar-video-meta {
        font-size: 11px;
        color: #888;
    }
    
    @media (max-width: 768px) {
        .video-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
        }
        
        /* 2 columns en móvil también */
        #randomVideosList {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .sidebar-video-title {
            font-size: 12px;
        }
    }
</style>
`;

document.head.insertAdjacentHTML('beforeend', widgetStyles);

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
} else {
    initWidget();
}

// Export functions
window.searchVideos = searchVideos;
window.getRandomVideos = getRandomVideos;
window.getRecentVideos = getRecentVideos;
window.handleFavoriteClick = handleFavoriteClick;
window.handleRemoveFavorite = handleRemoveFavorite;
window.loadMoreFavorites = loadMoreFavorites;
window.loadMoreRecents = loadMoreRecents;
window.getFavorites = getFavorites;
window.startImageSlideshow = startImageSlideshow;
window.stopImageSlideshow = stopImageSlideshow;
// videosData se exporta DESPUÉS de cargar en initWidget()
