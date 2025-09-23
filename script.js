const gameSources = [
    {
        src: "games/game1/index.html",
        title: "Breakout Classic",
        creator: "jafar",
        width: "500",
        height: "800"
    },
    {
        src: "games/game2/index.html",
        title: "Tetris",
        creator: "jafar",
        width: "500",
        height: "800"
    },
    {
        src: "games/game3/index.html",
        title: "Snake Game",
        creator: "jafar",
        width: "500",
        height: "800"
    },
    {
        src: "games/game4/index.html",
        title: "Pac-Man",
        creator: "jafar",
        width: "500",
        height: "800"
    },
    {
        src: "games/game5/index.html",
        title: "Space Invaders",
        creator: "jafar",
        width: "500",
        height: "800"
    },
    {
        src: "games/game6/index.html",
        title: "Frogger",
        creator: "jafar",
        width: "500",
        height: "800"
    },
    {
        src: "games/game7/index.html",
        title: "Asteroids",
        creator: "jafar",
        width: "500",
        height: "800"
    },
    {
        src: "games/game8/index.html",
        title: "Centipede",
        creator: "jafar",
        width: "500",
        height: "800"
    },
    {
        src: "games/game9/index.html",
        title: "Pong",
        creator: "jafar",
        width: "500",
        height: "800"
    },
    {
        src: "games/game10/index.html",
        title: "Missile Command",
        creator: "jafar",
        width: "500",
        height: "800"
    }
];

let currentGameIndex = 0;
let isLoading = false;
let loadedGames = 0;
let isSearchMode = false;
let isFocusMode = false;
let currentPage = 'home';
let savedGames = []; // Array to store saved games
let currentPlayingGame = null; // Track current game for saving

// Dummy user data
const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    followers: 1200,
    following: 856,
    gamesPlayed: 24
};

let containerWidth = Math.min(window.innerWidth, window.innerHeight * .5);
let containerHeight = containerWidth * 18.5 / 9;

const gamesContainer = document.getElementById('gamesContainer');
const searchBar = document.getElementById('searchBar');
const searchResults = document.getElementById('searchResults');
const searchGrid = document.getElementById('searchGrid');
const backButton = document.getElementById('backButton');
const noResults = document.getElementById('noResults');
const exitFocusButton = document.getElementById('exitFocusButton');
const container = document.querySelector('.container');

// Profile elements
const profileButton = document.getElementById('profileButton');
const dropdownMenu = document.getElementById('dropdownMenu');
const profilePage = document.getElementById('profilePage');
const savedGamesPage = document.getElementById('savedGamesPage');
const profileBackButton = document.getElementById('profileBackButton');
const savedBackButton = document.getElementById('savedBackButton');
const savedGamesGrid = document.getElementById('savedGamesGrid');
const savedCount = document.getElementById('savedCount');
const noSavedGames = document.getElementById('noSavedGames');
const savedSearchBar = document.getElementById('savedSearchBar');
const headerContainer = document.getElementById('headerContainer');

// Game icons for search preview (simple emojis)
const gameIcons = {
    'Breakout Classic': 'BC',
    'Tetris': 'T',
    'Snake Game': 'SG',
    'Pac-Man': 'PM',
    'Space Invaders': 'SI',
    'Frogger': 'F',
    'Asteroids': 'A',
    'Centipede': 'C',
    'Pong': 'P',
    'Missile Command': 'MC'
};

// Create a game element with title and creator outside iframe
function createGameElement(gameData, index) {
    let width = parseFloat(gameData.width);
    let height = parseFloat(gameData.height);
    let scale = Math.min(containerWidth / width, containerHeight / height);

    const gameDiv = document.createElement('div');
    gameDiv.className = 'game';
    gameDiv.innerHTML = `
        <iframe class="playableGames" 
                src="${gameData.src}" 
                style="width:${width}px;height:${height}px;scale:${scale};transform:translate(-${(1-scale) * 50 / scale}%,-${(1-scale) * 50 / scale}%);">
        </iframe>
        <div class="game-info">
            <div class="game-info-content">
                <div class="game-details">
                    <div class="game-title">${gameData.title}</div>
                    <div class="game-creator">by ${gameData.creator}</div>
                </div>
                <button class="focus-button" onclick="toggleFocusMode()" title="Focus Mode">Focus</button>
            </div>
        </div>
    `;
    return gameDiv;
}

// Create search result item
function createSearchItem(gameData, index) {
    const searchItem = document.createElement('div');
    searchItem.className = 'search-item';
    searchItem.innerHTML = `
        <div class="search-item-preview">${gameIcons[gameData.title] || '🎮'}</div>
        <div class="search-item-title">${gameData.title}</div>
        <div class="search-item-creator">by ${gameData.creator}</div>
    `;
    
    searchItem.addEventListener('click', () => {
        selectGame(index);
    });
    
    return searchItem;
}

// Select a game and return to scroll view
function selectGame(gameIndex, enterFocus = false) {
    hideSearchResults();
    showPage('home');
    
    // Clear current games and load selected game
    gamesContainer.innerHTML = '';
    currentGameIndex = gameIndex;
    loadedGames = 0;
    
    // Load selected game and a few more
    for (let i = 0; i < Math.min(3, gameSources.length); i++) {
        const gameData = gameSources[(gameIndex + i) % gameSources.length];
        const gameElement = createGameElement(gameData, (gameIndex + i) % gameSources.length);
        gamesContainer.appendChild(gameElement);
        loadedGames++;
    }
    
    currentGameIndex = (gameIndex + Math.min(3, gameSources.length)) % gameSources.length;
    
    // Scroll to top to show selected game
    gamesContainer.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Enter focus mode if requested
    if (enterFocus && !isFocusMode) {
        setTimeout(() => toggleFocusMode(), 500);
    }
}

// Show search results
function showSearchResults(results) {
    isSearchMode = true;
    gamesContainer.style.display = 'none';
    searchResults.style.display = 'block';
    searchGrid.innerHTML = '';
    
    if (results.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    results.forEach((game, index) => {
        const originalIndex = gameSources.findIndex(g => g.title === game.title);
        const searchItem = createSearchItem(game, originalIndex);
        searchGrid.appendChild(searchItem);
    });
}

// Hide search results
function hideSearchResults() {
    isSearchMode = false;
    searchResults.style.display = 'none';
    gamesContainer.style.display = 'flex';
    searchBar.value = '';
}

// Toggle focus mode
function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    if (isFocusMode) {
        container.classList.add('focus-mode');
        gamesContainer.style.scrollBehavior = 'auto';
        gamesContainer.scrollTop = Math.floor(gamesContainer.scrollTop / gamesContainer.clientHeight) * gamesContainer.clientHeight;
        headerContainer.style.display = 'none';
        document.querySelector('.footer_container').style.display = 'none';
    } else {
        container.classList.remove('focus-mode');
        headerContainer.style.display = 'flex';
        document.querySelector('.footer_container').style.display = 'flex';
    }
}

// Page navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    gamesContainer.style.display = 'none';
    searchResults.style.display = 'none';
    
    currentPage = pageName;
    
    // Show/hide header and footer based on page
    if (pageName === 'profile' || pageName === 'savedGames') {
        headerContainer.style.display = 'none';
        document.querySelector('.footer_container').style.display = 'none';
    } else {
        headerContainer.style.display = 'flex';
        document.querySelector('.footer_container').style.display = 'flex';
    }
    
    if (pageName === 'home') {
        gamesContainer.style.display = 'flex';
        if (isSearchMode) {
            searchResults.style.display = 'block';
            gamesContainer.style.display = 'none';
        }
    } else {
        const page = document.getElementById(pageName + 'Page');
        if (page) page.classList.add('active');
        
        if (pageName === 'savedGames') {
            updateSavedGamesDisplay();
        }
    }
    
    hideDropdown();
}

function hideDropdown() {
    dropdownMenu.classList.remove('active');
}

// Save game functionality
function saveGame(gameData) {
    const existingIndex = savedGames.findIndex(game => game.title === gameData.title);
    if (existingIndex === -1) {
        savedGames.push({...gameData, savedAt: new Date().toISOString()});
        updateSavedCount();
        return true; // Game saved
    }
    return false; // Game already saved
}

function unsaveGame(gameTitle) {
    savedGames = savedGames.filter(game => game.title !== gameTitle);
    updateSavedCount();
    updateSavedGamesDisplay();
}

function updateSavedCount() {
    savedCount.textContent = savedGames.length;
}

function updateSavedGamesDisplay(filteredGames = null) {
    savedGamesGrid.innerHTML = '';
    
    const gamesToShow = filteredGames || savedGames;
    
    if (gamesToShow.length === 0) {
        noSavedGames.style.display = 'block';
        noSavedGames.textContent = filteredGames ? 'No saved games match your search.' : 'No saved games yet. Save some games to see them here!';
        return;
    }
    
    noSavedGames.style.display = 'none';
    
    gamesToShow.forEach(game => {
        const savedItem = document.createElement('div');
        savedItem.className = 'saved-game-item';
        savedItem.innerHTML = `
            <button class="unsave-btn" onclick="unsaveGame('${game.title}')">×</button>
            <div class="search-item-preview">${gameIcons[game.title] || '🎮'}</div>
            <div class="search-item-title">${game.title}</div>
            <div class="search-item-creator">by ${game.creator}</div>
        `;
        
        savedItem.addEventListener('click', (e) => {
            if (!e.target.classList.contains('unsave-btn')) {
                const originalIndex = gameSources.findIndex(g => g.title === game.title);
                selectGame(originalIndex, true); // Enter focus mode automatically
            }
        });
        
        savedGamesGrid.appendChild(savedItem);
    });
}

// Update current playing game for save functionality
function updateCurrentGame() {
    const scrollTop = gamesContainer.scrollTop;
    const gameHeight = gamesContainer.clientHeight;
    const currentIndex = Math.round(scrollTop / gameHeight);
    
    // Make sure we get the right game from the current loaded games
    const gameElements = gamesContainer.querySelectorAll('.game');
    if (gameElements.length > 0 && currentIndex < gameElements.length) {
        // Get the game title from the currently visible game element
        const currentGameElement = gameElements[currentIndex];
        const gameTitle = currentGameElement.querySelector('.game-title')?.textContent;
        
        if (gameTitle) {
            currentPlayingGame = gameSources.find(game => game.title === gameTitle);
        }
    }
}

// Shuffle array function
function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Load initial games with randomized order
function loadInitialGames() {
    gamesContainer.innerHTML = '';
    currentGameIndex = 0;
    loadedGames = 0;
    
    // Shuffle the games array
    const shuffledGames = shuffleArray(gameSources);
    
    // Load first 3 games from shuffled array
    for (let i = 0; i < Math.min(3, shuffledGames.length); i++) {
        const gameElement = createGameElement(shuffledGames[i], i);
        gamesContainer.appendChild(gameElement);
        loadedGames++;
    }
    currentGameIndex = Math.min(3, shuffledGames.length);
    
    // Update the gameSources to use shuffled order for this session
    gameSources.length = 0;
    gameSources.push(...shuffledGames);
    
    // Set initial current game
    updateCurrentGame();
}

// Load more games
function loadMoreGames() {
    if (isLoading || isSearchMode || isFocusMode) return;
    
    isLoading = true;

    setTimeout(() => {
        const gamesToLoad = Math.min(2, gameSources.length - currentGameIndex);
        
        for (let i = 0; i < gamesToLoad; i++) {
            const gameData = gameSources[(currentGameIndex + i) % gameSources.length];
            const gameElement = createGameElement(gameData, (currentGameIndex + i) % gameSources.length);
            gamesContainer.appendChild(gameElement);
            loadedGames++;
        }
        
        currentGameIndex = (currentGameIndex + gamesToLoad) % gameSources.length;
        isLoading = false;
    }, 500);
}

// Search functionality
function performSearch(searchTerm) {
    if (searchTerm.trim() === '') {
        hideSearchResults();
        return;
    }

    const results = gameSources.filter(game => 
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.creator.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        const aStartsWith = a.title.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bStartsWith = b.title.toLowerCase().startsWith(searchTerm.toLowerCase());
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        const aIndex = a.title.toLowerCase().indexOf(searchTerm.toLowerCase());
        const bIndex = b.title.toLowerCase().indexOf(searchTerm.toLowerCase());
        
        if (aIndex !== bIndex) return aIndex - bIndex;
        
        return a.title.localeCompare(b.title);
    });

    showSearchResults(results);
}

// Event Listeners
searchBar.addEventListener('input', function() {
    const searchTerm = this.value.trim();
    performSearch(searchTerm);
});

backButton.addEventListener('click', hideSearchResults);

exitFocusButton.addEventListener('click', toggleFocusMode);

// Profile menu functionality
profileButton.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('active');
});

document.addEventListener('click', () => {
    hideDropdown();
});

// Dropdown menu items
document.getElementById('profileMenuItem').addEventListener('click', () => showPage('profile'));
document.getElementById('savedGamesMenuItem').addEventListener('click', () => showPage('savedGames'));
document.getElementById('homeMenuItem').addEventListener('click', () => showPage('home'));

// Back buttons
profileBackButton.addEventListener('click', () => showPage('home'));
savedBackButton.addEventListener('click', () => showPage('home'));

// Saved games search functionality
savedSearchBar.addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        updateSavedGamesDisplay();
        return;
    }
    
    const filteredGames = savedGames.filter(game => 
        game.title.toLowerCase().includes(searchTerm) ||
        game.creator.toLowerCase().includes(searchTerm)
    ).sort((a, b) => {
        const aStartsWith = a.title.toLowerCase().startsWith(searchTerm);
        const bStartsWith = b.title.toLowerCase().startsWith(searchTerm);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        return a.title.localeCompare(b.title);
    });
    
    updateSavedGamesDisplay(filteredGames);
});

// Handle scroll events
gamesContainer.addEventListener('scroll', () => {
    if (isSearchMode || isFocusMode) return;
    
    const scrollTop = gamesContainer.scrollTop;
    const scrollHeight = gamesContainer.scrollHeight;
    const clientHeight = gamesContainer.clientHeight;
    
    // Update current game for save functionality
    updateCurrentGame();
    
    // Load more games when near bottom
    if (scrollTop + clientHeight >= scrollHeight - 1000) {
        loadMoreGames();
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (isSearchMode || isFocusMode) {
        if (e.key === 'Escape') {
            if (isSearchMode) hideSearchResults();
            if (isFocusMode) toggleFocusMode();
        }
        return;
    }
    
    if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        const currentScroll = gamesContainer.scrollTop;
        const nextGame = Math.floor(currentScroll / gamesContainer.clientHeight) + 1;
        gamesContainer.scrollTo({
            top: nextGame * gamesContainer.clientHeight,
            behavior: 'smooth'
        });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentScroll = gamesContainer.scrollTop;
        const prevGame = Math.floor(currentScroll / gamesContainer.clientHeight) - 1;
        if (prevGame >= 0) {
            gamesContainer.scrollTo({
                top: prevGame * gamesContainer.clientHeight,
                behavior: 'smooth'
            });
        }
    } else if (e.key === 'Escape') {
        hideSearchResults();
    }
});

// Button event listeners (you can customize these)
document.getElementById('likeButton').addEventListener('click', () => {
    console.log('Liked!');
    // Add like functionality
});

document.getElementById('shareButton').addEventListener('click', () => {
    console.log('Shared!');
    // Add share functionality
});

document.getElementById('followButton').addEventListener('click', () => {
    console.log('Followed!');
    // Add follow functionality
});

document.getElementById('saveButton').addEventListener('click', () => {
    if (currentPlayingGame) {
        const saved = saveGame(currentPlayingGame);
        if (saved) {
            // Visual feedback
            const saveBtn = document.getElementById('saveButton');
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'Saved!';
            saveBtn.style.background = '#4CAF50';
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.style.background = '';
            }, 1500);
        } else {
            // Game already saved
            const saveBtn = document.getElementById('saveButton');
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'Already Saved';
            setTimeout(() => {
                saveBtn.textContent = originalText;
            }, 1500);
        }
    }
});

// Initialize the app
loadInitialGames();

// Make functions global for HTML onclick
window.unsaveGame = unsaveGame;
window.toggleFocusMode = toggleFocusMode;