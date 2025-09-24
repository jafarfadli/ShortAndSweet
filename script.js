
// Game sources with multiple categories
const gameSources = [
    {
        src: "games/game1/index.html",
        title: "Breakout Classic",
        creator: "jafar",
        width: "500",
        height: "800",
        categories: ["arcade", "casual"],
        createdAt: "2024-01-15"
    },
    {
        src: "games/game2/index.html",
        title: "Tetris",
        creator: "jafar",
        width: "500",
        height: "800",
        categories: ["puzzle", "arcade"],
        createdAt: "2024-01-20"
    },
    {
        src: "games/game3/index.html",
        title: "Snake Game",
        creator: "alex_dev",
        width: "500",
        height: "800",
        categories: ["arcade", "casual"],
        createdAt: "2024-02-01"
    },
    {
        src: "games/game4/index.html",
        title: "Pac-Man",
        creator: "retro_gamer",
        width: "500",
        height: "800",
        categories: ["arcade", "action"],
        createdAt: "2024-02-10"
    },
    {
        src: "games/game5/index.html",
        title: "Space Invaders",
        creator: "jafar",
        width: "500",
        height: "800",
        categories: ["action", "arcade"],
        createdAt: "2024-02-15"
    },
    {
        src: "games/game6/index.html",
        title: "Frogger",
        creator: "pixel_master",
        width: "500",
        height: "800",
        categories: ["arcade", "casual"],
        createdAt: "2024-02-20"
    },
    {
        src: "games/game7/index.html",
        title: "Asteroids",
        creator: "space_fan",
        width: "500",
        height: "800",
        categories: ["action", "arcade"],
        createdAt: "2024-03-01"
    },
    {
        src: "games/game8/index.html",
        title: "Centipede",
        creator: "bug_hunter",
        width: "500",
        height: "800",
        categories: ["arcade", "action"],
        createdAt: "2024-03-05"
    },
    {
        src: "games/game9/index.html",
        title: "Pong",
        creator: "classic_games",
        width: "500",
        height: "800",
        categories: ["casual", "arcade"],
        createdAt: "2024-03-10"
    },
    {
        src: "games/game10/index.html",
        title: "Missile Command",
        creator: "jafar",
        width: "500",
        height: "800",
        categories: ["action", "strategy"],
        createdAt: "2024-03-15"
    }
];

const MASTER_GAME_SOURCES = [...gameSources];

// Categories
const categories = [
    { id: 'arcade', name: 'Arcade', selected: true },
    { id: 'puzzle', name: 'Puzzle', selected: true },
    { id: 'action', name: 'Action', selected: true },
    { id: 'strategy', name: 'Strategy', selected: true },
    { id: 'casual', name: 'Casual', selected: true }
];

// Dummy creator data
const creators = {
    'jafar': { name: 'jafar', avatar: 'JF', email: 'Game Developer', followers: 1200, following: 856, isFollowing: false },
    'alex_dev': { name: 'alex_dev', avatar: 'AD', email: 'Indie Developer', followers: 543, following: 234, isFollowing: false },
    'retro_gamer': { name: 'retro_gamer', avatar: 'RG', email: 'Retro Enthusiast', followers: 2100, following: 445, isFollowing: true },
    'pixel_master': { name: 'pixel_master', avatar: 'PM', email: 'Pixel Artist', followers: 887, following: 123, isFollowing: false },
    'space_fan': { name: 'space_fan', avatar: 'SF', email: 'Space Game Developer', followers: 654, following: 287, isFollowing: false },
    'bug_hunter': { name: 'bug_hunter', avatar: 'BH', email: 'Bug Squasher', followers: 432, following: 165, isFollowing: false },
    'classic_games': { name: 'classic_games', avatar: 'CG', email: 'Classic Game Lover', followers: 765, following: 298, isFollowing: false }
};

let isLoading = false;
let loadedGames = 0;
let isSearchMode = false;
let isFocusMode = false;
let currentPage = 'home';
let savedGames = [];
let currentPlayingGame = null;
let touchStartX = 0;
let touchStartY = 0;
let selectedCategories = new Set(['arcade', 'puzzle', 'action', 'strategy', 'casual']);
let createdGames = [];

// DOM elements
const gamesContainer = document.getElementById('gamesContainer');
const searchBar = document.getElementById('searchBar');
const searchResults = document.getElementById('searchResults');
const searchGrid = document.getElementById('searchGrid');
const noResults = document.getElementById('noResults');
const container = document.querySelector('.container');
const headerContainer = document.getElementById('headerContainer');
const profileButton = document.getElementById('profileButton');
const dropdownMenu = document.getElementById('dropdownMenu');
const filterButton = document.getElementById('filterButton');
const filterModal = document.getElementById('filterModal');
const swipeLeftIndicator = document.getElementById('swipeLeftIndicator');
const swipeRightIndicator = document.getElementById('swipeRightIndicator');

const gameIcons = {
    'Breakout Classic': 'BC', 'Tetris': 'T', 'Snake Game': 'SG', 'Pac-Man': 'PM', 'Space Invaders': 'SI',
    'Frogger': 'F', 'Asteroids': 'A', 'Centipede': 'C', 'Pong': 'P', 'Missile Command': 'MC'
};

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Updated createGameElement with repositioned buttons
function createGameElement(gameData, index) {
    const gameDiv = document.createElement('div');
    gameDiv.className = 'game';
    gameDiv.innerHTML = `
        <iframe src="${gameData.src}" style="width:100%;height:100%;" loading="lazy"></iframe>
        <div class="game-overlay">
            <div class="game-info">
                <div class="creator-profile" onclick="showCreatorProfile('${gameData.creator}')">
                    ${creators[gameData.creator]?.avatar || gameData.creator.substring(0, 2).toUpperCase()}
                </div>
                <div class="game-details">
                    <div class="game-title">${gameData.title}</div>
                    <div class="game-creator">@${gameData.creator}</div>
                </div>
                <div class="action-buttons">
                    <button class="focus-entry-btn" onclick="toggleFocusMode()">Focus</button>
                    <button class="action-btn" onclick="saveGame('${gameData.title}')" id="save-${gameData.title}">Save</button>
                </div>
            </div>
        </div>
    `;
    return gameDiv;
}

function createSearchItem(gameData) {
    const searchItem = document.createElement('div');
    searchItem.className = 'search-item';
    searchItem.innerHTML = `
        <div class="search-item-preview">${gameIcons[gameData.title] || 'G'}</div>
        <div class="search-item-title">${gameData.title}</div>
        <div class="search-item-creator">@${gameData.creator}</div>
    `;
    searchItem.addEventListener('click', () => {
        selectGame(gameData, true);
    });
    return searchItem;
}

function loadInitialGames() {
    gamesContainer.innerHTML = '';
    loadedGames = 0;
    
    const filteredGames = MASTER_GAME_SOURCES.filter(game => 
        game.categories.some(category => selectedCategories.has(category))
    );
    
    const shuffledGames = shuffleArray(filteredGames);
    gameSources.length = 0;
    gameSources.push(...shuffledGames);
    
    for (let i = 0; i < Math.min(3, gameSources.length); i++) {
        const gameElement = createGameElement(gameSources[i], i);
        gamesContainer.appendChild(gameElement);
        loadedGames++;
    }
    updateCurrentGame();
}

function updateActionButtonStates(gameTitle) {
    const saveBtns = document.querySelectorAll(`[id="save-${gameTitle}"]`);
    const isSaved = savedGames.some(game => game.title === gameTitle);
    saveBtns.forEach(btn => btn.classList.toggle('saved', isSaved));
}

function performSearch(searchTerm) {
    if (searchTerm.trim() === '') {
        hideSearchResults();
        return;
    }
    const results = MASTER_GAME_SOURCES.filter(game => 
        (game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.creator.toLowerCase().includes(searchTerm.toLowerCase())) &&
        game.categories.some(category => selectedCategories.has(category))
    );
    showSearchResults(results);
}

function loadMoreGames() {
    if (isLoading || isSearchMode || isFocusMode || gameSources.length === 0) return;
    
    isLoading = true;
    setTimeout(() => {
        const gamesToLoad = 2;
        for (let i = 0; i < gamesToLoad; i++) {
            const gameIndex = loadedGames % gameSources.length;
            const gameData = gameSources[gameIndex];
            const gameElement = createGameElement(gameData, gameIndex);
            gamesContainer.appendChild(gameElement);
            updateActionButtonStates(gameData.title);
            loadedGames++;
        }
        isLoading = false;
    }, 300);
}

function updateCurrentGame() {
    const scrollTop = gamesContainer.scrollTop;
    const gameHeight = window.innerHeight;
    const currentIndex = Math.round(scrollTop / gameHeight);
    
    const gameElements = gamesContainer.querySelectorAll('.game');
    if (gameElements.length > 0 && currentIndex < gameElements.length) {
        const gameTitle = gameElements[currentIndex].querySelector('.game-title')?.textContent;
        if (gameTitle) {
            currentPlayingGame = MASTER_GAME_SOURCES.find(game => game.title === gameTitle);
            updateActionButtonStates(gameTitle);
        }
    }
}

function selectGame(selectedGame, enterFocus = false) {
    if (!selectedGame) return;

    hideSearchResults();
    showPage('home');

    let gameIndex = gameSources.findIndex(g => g.title === selectedGame.title);

    if (gameIndex === -1) {
        gameSources.unshift(selectedGame);
        gameIndex = 0;
    }

    const [gameToMove] = gameSources.splice(gameIndex, 1);
    gameSources.unshift(gameToMove);

    gamesContainer.innerHTML = '';
    loadedGames = 0;

    for (let i = 0; i < Math.min(3, gameSources.length); i++) {
        const gameElement = createGameElement(gameSources[i], i);
        gamesContainer.appendChild(gameElement);
        loadedGames++;
    }
    
    gamesContainer.scrollTo({ top: 0, behavior: 'auto' });
    updateCurrentGame();
    
    if (enterFocus && !isFocusMode) {
        setTimeout(() => toggleFocusMode(), 500);
    }
}

function showSearchResults(results) {
    isSearchMode = true;
    gamesContainer.style.display = 'none';
    searchResults.style.display = 'block';
    searchGrid.innerHTML = '';
    noResults.style.display = results.length === 0 ? 'block' : 'none';
    
    results.forEach(game => {
        const searchItem = createSearchItem(game);
        searchGrid.appendChild(searchItem);
    });
}

function hideSearchResults() {
    isSearchMode = false;
    searchResults.style.display = 'none';
    gamesContainer.style.display = 'block';
    searchBar.value = '';
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    gamesContainer.style.display = 'none';
    searchResults.style.display = 'none';
    currentPage = pageName;
    
    if (pageName === 'home') {
        gamesContainer.style.display = 'block';
        headerContainer.style.display = 'flex';
        if (isSearchMode) {
            searchResults.style.display = 'block';
            gamesContainer.style.display = 'none';
        }
    } else {
        headerContainer.style.display = 'none';
        const page = document.getElementById(pageName + 'Page');
        if (page) page.classList.add('active');
        
        if (pageName === 'savedGames') updateSavedGamesDisplay();
        else if (pageName === 'profile') updateProfileStats();
    }
    hideDropdown();
    hideFilterModal();
}

function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    container.classList.toggle('focus-mode', isFocusMode);
    
    if (isFocusMode) {
        headerContainer.style.display = 'none';
        const scrollTop = gamesContainer.scrollTop;
        const gameHeight = window.innerHeight;
        const currentIndex = Math.round(scrollTop / gameHeight);
        gamesContainer.scrollTo({ top: currentIndex * gameHeight, behavior: 'smooth' });
    } else if (currentPage === 'home') {
        headerContainer.style.display = 'flex';
    }
}

function saveGame(gameTitle) {
    const game = MASTER_GAME_SOURCES.find(g => g.title === gameTitle);
    if (!game) return;
    
    const existingIndex = savedGames.findIndex(g => g.title === gameTitle);
    if (existingIndex === -1) {
        savedGames.push({...game, savedAt: new Date().toISOString()});
    } else {
        savedGames.splice(existingIndex, 1);
    }
    updateActionButtonStates(gameTitle);
    updateSavedCount();
}

function shareGame(gameTitle) {
    if (navigator.share) {
        navigator.share({ title: gameTitle, text: `Check out this game: ${gameTitle}`, url: window.location.href })
            .catch(err => console.log("Share failed:", err));
    } else {
        navigator.clipboard?.writeText(`Check out this game: ${gameTitle} - ${window.location.href}`);
        alert('Link copied to clipboard!');
    }
}

function showCreatorProfile(creatorName) {
    const creator = creators[creatorName];
    if (!creator) return;
    
    document.getElementById('creatorAvatar').textContent = creator.avatar;
    document.getElementById('creatorName').textContent = creator.name;
    document.getElementById('creatorEmail').textContent = creator.email;
    document.getElementById('creatorFollowers').textContent = formatNumber(creator.followers);
    document.getElementById('creatorFollowing').textContent = formatNumber(creator.following);
    
    const creatorGames = MASTER_GAME_SOURCES.filter(game => game.creator === creatorName);
    document.getElementById('creatorGamesCount').textContent = creatorGames.length;
    
    const followBtn = document.getElementById('followCreatorBtn');
    followBtn.textContent = creator.isFollowing ? 'Following' : 'Follow';
    followBtn.className = `follow-btn ${creator.isFollowing ? 'following' : ''}`;
    followBtn.onclick = () => toggleFollowCreator(creatorName);
    
    const gamesGrid = document.getElementById('creatorGamesGrid');
    gamesGrid.innerHTML = '';
    creatorGames.forEach(game => {
        const gameThumb = document.createElement('div');
        gameThumb.className = 'game-thumbnail';
        gameThumb.textContent = gameIcons[game.title] || 'G';
        gameThumb.title = game.title;
        gameThumb.onclick = () => selectGame(game, true);
        gamesGrid.appendChild(gameThumb);
    });
    
    showPage('creatorProfile');
}

function toggleFollowCreator(creatorName) {
    const creator = creators[creatorName];
    if (!creator) return;
    creator.isFollowing = !creator.isFollowing;
    creator.followers += creator.isFollowing ? 1 : -1;
    
    const followBtn = document.getElementById('followCreatorBtn');
    followBtn.textContent = creator.isFollowing ? 'Following' : 'Follow';
    followBtn.className = `follow-btn ${creator.isFollowing ? 'following' : ''}`;
    document.getElementById('creatorFollowers').textContent = formatNumber(creator.followers);
}

function showFilterModal() {
    filterModal.classList.add('active');
    updateCategoriesList();
}

function hideFilterModal() {
    filterModal.classList.remove('active');
}

function updateCategoriesList() {
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = '';
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-item';
        categoryDiv.innerHTML = `
            <input type="checkbox" class="category-checkbox" id="cat-${category.id}" ${selectedCategories.has(category.id) ? 'checked' : ''}>
            <label for="cat-${category.id}">${category.name}</label>`;
        
        const checkbox = categoryDiv.querySelector('input');
        checkbox.addEventListener('change', () => {
            checkbox.checked ? selectedCategories.add(category.id) : selectedCategories.delete(category.id);
            if (currentPage === 'home' && !isSearchMode) {
                loadInitialGames();
            }
        });
        categoriesList.appendChild(categoryDiv);
    });
}

function updateSavedGamesDisplay() {
    const savedGamesGrid = document.getElementById('savedGamesGrid');
    const noSavedGames = document.getElementById('noSavedGames');
    savedGamesGrid.innerHTML = '';
    noSavedGames.style.display = savedGames.length === 0 ? 'block' : 'none';
    
    savedGames.forEach(game => {
        const gameThumb = document.createElement('div');
        gameThumb.className = 'game-thumbnail';
        gameThumb.textContent = gameIcons[game.title] || 'G';
        gameThumb.title = game.title;
        gameThumb.onclick = () => selectGame(game, true);
        savedGamesGrid.appendChild(gameThumb);
    });
}

function updateSavedCount() {
    document.getElementById('savedCount').textContent = savedGames.length;
}

function updateProfileStats() {
    document.getElementById('createdGamesCount').textContent = createdGames.length;
    updateSavedCount();
}

function showUploadModal() { document.getElementById('uploadModal').classList.add('active'); }
function hideUploadModal() { document.getElementById('uploadModal').classList.remove('active'); }

function handleGameUpload(formData) {
    const selectedCats = Array.from(formData.getAll('categories'));
    if (selectedCats.length === 0) return alert('Please select at least one category');
    
    const gameData = {
        title: formData.get('title'), creator: 'jafar', categories: selectedCats,
        description: formData.get('description'), src: `games/user_${Date.now()}/index.html`,
        width: "500", height: "800", createdAt: new Date().toISOString()
    };
    
    createdGames.push(gameData);
    MASTER_GAME_SOURCES.unshift(gameData);
    alert(`Game "${gameData.title}" uploaded successfully!`);
    hideUploadModal();
    updateProfileStats();
    loadInitialGames();
}

function hideDropdown() { dropdownMenu.classList.remove('active'); }

function handleTouchStart(e) {
    if (currentPage !== 'home') return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    if (touchStartX < 20) swipeLeftIndicator.style.opacity = '1';
    if (touchStartX > window.innerWidth - 20) swipeRightIndicator.style.opacity = '1';
}

function handleTouchMove(e) {
    if (currentPage !== 'home') return;
    const touchCurrentX = e.touches[0].clientX;
    const diffX = touchCurrentX - touchStartX;
    if (touchStartX < 20 && diffX > 0) swipeLeftIndicator.style.opacity = Math.min(diffX / 100, 1);
    if (touchStartX > window.innerWidth - 20 && diffX < 0) swipeRightIndicator.style.opacity = Math.min(Math.abs(diffX) / 100, 1);
}

function handleTouchEnd(e) {
    if (currentPage !== 'home') return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    swipeLeftIndicator.style.opacity = '0';
    swipeRightIndicator.style.opacity = '0';
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(e.changedTouches[0].clientY - touchStartY)) {
        if (touchStartX < 20 && diffX > 100 && !isFocusMode) toggleFocusMode();
        if (touchStartX > window.innerWidth - 20 && diffX < -100 && isFocusMode) toggleFocusMode();
    }
}

// Event listeners
searchBar.addEventListener('input', function() { performSearch(this.value.trim()); });
filterButton.addEventListener('click', showFilterModal);
document.getElementById('closeFilterBtn').addEventListener('click', hideFilterModal);
profileButton.addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.classList.toggle('active'); });
document.addEventListener('click', hideDropdown);

document.getElementById('profileMenuItem').addEventListener('click', () => showPage('profile'));
document.getElementById('savedGamesMenuItem').addEventListener('click', () => showPage('savedGames'));
document.getElementById('homeMenuItem').addEventListener('click', () => showPage('home'));
document.getElementById('profileBackButton').addEventListener('click', () => showPage('home'));
document.getElementById('savedBackButton').addEventListener('click', () => showPage('profile'));
document.getElementById('creatorBackButton').addEventListener('click', () => showPage('home'));
document.getElementById('uploadGameBtn').addEventListener('click', showUploadModal);
document.getElementById('uploadBackButton').addEventListener('click', hideUploadModal);
document.getElementById('gameUploadForm').addEventListener('submit', (e) => { e.preventDefault(); handleGameUpload(new FormData(e.target)); });
document.getElementById('focusExitBtn').addEventListener('click', toggleFocusMode);

document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchmove', handleTouchMove, { passive: true });
document.addEventListener('touchend', handleTouchEnd, { passive: true });

gamesContainer.addEventListener('scroll', () => {
    if (isSearchMode) return;
    updateCurrentGame();
    if (isFocusMode) return;
    if (gamesContainer.scrollTop + gamesContainer.clientHeight >= gamesContainer.scrollHeight - 500) {
        loadMoreGames();
    }
});

document.addEventListener('keydown', (e) => {
    const isTyping = document.activeElement.tagName === 'INPUT';
    if (currentPage !== 'home' || isTyping) return;
    
    if (e.key === 'Escape') {
        if (isSearchMode) hideSearchResults();
        else if (isFocusMode) toggleFocusMode();
    }
    
    if (!isSearchMode && !isFocusMode) {
        const gameHeight = window.innerHeight;
        if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            gamesContainer.scrollTo({ top: gamesContainer.scrollTop + gameHeight, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            gamesContainer.scrollTo({ top: gamesContainer.scrollTop - gameHeight, behavior: 'smooth' });
        }
    }
});

window.saveGame = saveGame;
window.shareGame = shareGame;
window.showCreatorProfile = showCreatorProfile;
window.toggleFollowCreator = toggleFollowCreator;
window.toggleFocusMode = toggleFocusMode;

loadInitialGames();
updateSavedCount();