
const gameSources = [
    {
        src: "https://funhtml5games.com/?play=wordle",
        title: "Breakout Classic",
        creator: "jafar"
    },
    {
        src: "https://funhtml5games.com/?play=wordle",
        title: "Tetris",
        creator: "jafar"
    },
    {
        src: "https://funhtml5games.com/?play=wordle",
        title: "Snake Game",
        creator: "jafar"
    },
    {
        src: "https://funhtml5games.com/?play=wordle",
        title: "Pac-Man",
        creator: "jafar"
    },
    {
        src: "https://funhtml5games.com/?play=wordle",
        title: "Space Invaders",
        creator: "jafar"
    },
    {
        src: "https://funhtml5games.com/?play=wordle",
        title: "Frogger",
        creator: "jafar"
    },
    {
        src: "https://funhtml5games.com/?play=wordle",
        title: "Asteroids",
        creator: "jafar"
    },
    {
        src: "https://funhtml5games.com/?play=wordle",
        title: "Centipede",
        creator: "jafar"
    },
    {
        src: "https://funhtml5games.com/?play=wordle",
        title: "Pong",
        creator: "jafar"
    },
    {
        src: "https://funhtml5games.com/?play=wordle",
        title: "Missile Command",
        creator: "jafar"
    }
];

let currentGameIndex = 0;
let isLoading = false;
let loadedGames = 0;

const gamesContainer = document.getElementById('gamesContainer');

// Create a game element
function createGameElement(gameData) {
    const gameDiv = document.createElement('div');
    gameDiv.className = 'game';
    gameDiv.innerHTML = `
        <iframe class="playableGames" src="${gameData.src}"></iframe>
        <div class="game-info">
            <div class="game-title">${gameData.title}</div>
            <div class="game-description">${gameData.description}</div>
        </div>
    `;
    return gameDiv;
}

// Load initial games
function loadInitialGames() {
    // Load first 3 games
    for (let i = 0; i < Math.min(3, gameSources.length); i++) {
        const gameElement = createGameElement(gameSources[i], i);
        gamesContainer.appendChild(gameElement);
        loadedGames++;
    }
    currentGameIndex = Math.min(3, gameSources.length);
}

// Load more games
function loadMoreGames() {
    if (isLoading) return;
    
    isLoading = true;

    setTimeout(() => {
        const gamesToLoad = Math.min(2, gameSources.length - currentGameIndex);
        
        for (let i = 0; i < gamesToLoad; i++) {
            const gameData = gameSources[(currentGameIndex + i) % gameSources.length];
            const gameElement = createGameElement(gameData, currentGameIndex + i);
            gamesContainer.appendChild(gameElement);
            loadedGames++;
        }
        
        currentGameIndex = (currentGameIndex + gamesToLoad) % gameSources.length;
    
        isLoading = false;
    }, 1000);
}

// Handle scroll events
gamesContainer.addEventListener('scroll', () => {
    const scrollTop = gamesContainer.scrollTop;
    const scrollHeight = gamesContainer.scrollHeight;
    const clientHeight = gamesContainer.clientHeight;
    
    // Load more games
    if (scrollTop + clientHeight >= scrollHeight - 1000) {
        loadMoreGames();
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        const currentScroll = gamesContainer.scrollTop;
        const nextGame = Math.floor(currentScroll / window.innerHeight) + 1;
        gamesContainer.scrollTo({
            top: nextGame * window.innerHeight,
            behavior: 'smooth'
        });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentScroll = gamesContainer.scrollTop;
        const prevGame = Math.floor(currentScroll / window.innerHeight) - 1;
        if (prevGame >= 0) {
            gamesContainer.scrollTo({
                top: prevGame * window.innerHeight,
                behavior: 'smooth'
            });
        }
    }
});

loadInitialGames();