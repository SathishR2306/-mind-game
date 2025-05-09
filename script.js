let cards = [
    'Apple', 'Apple', 'Dog', 'Dog',
    'Cat', 'Cat', 'Banana', 'Banana',
    'Lion', 'Lion', 'Tiger', 'Tiger'
];

let shuffledCards = shuffle(cards);
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timer = 0;
let gameStarted = false;
let gameInterval;
let playerName = '';
let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];

const board = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const resetBtn = document.getElementById('resetBtn');
const startGameBtn = document.getElementById('startGameBtn');
const playerNameInput = document.getElementById('playerName');
const historyList = document.getElementById('historyList');
const playerSection = document.getElementById('playerSection');
const historySection = document.getElementById('historySection');

// Show history from localStorage
updateHistory();

// Event Listeners
startGameBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

// Shuffle function
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Initialize the game board
function initializeBoard() {
    board.innerHTML = '';
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-id', index);
        cardElement.textContent = '';
        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });
}

// Flip card logic
function flipCard() {
    if (flippedCards.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    this.textContent = shuffledCards[this.getAttribute('data-id')];
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// Check for matching pairs
function checkMatch() {
    const [card1, card2] = flippedCards;
    const card1Text = card1.textContent;
    const card2Text = card2.textContent;

    if (card1Text === card2Text) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        score++;
        matchedPairs++;
        scoreDisplay.textContent = score;

        if (matchedPairs === shuffledCards.length / 2) {
            clearInterval(gameInterval);
            alert('You win!');
            addToHistory(playerName, timer);
            updateHistory();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
        }, 1000);
    }

    flippedCards = [];
}

// Start or reset the game
function startGame() {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }

    playerSection.style.display = 'none';  // Hide the name input section
    historySection.style.display = 'block';  // Show the history section

    shuffledCards = shuffle(cards);
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    scoreDisplay.textContent = score;
    timer = 0;
    timerDisplay.textContent = timer;
    clearInterval(gameInterval);

    if (!gameStarted) {
        gameStarted = true;
        gameInterval = setInterval(updateTimer, 1000);
    }

    initializeBoard();
}

// Add to game history
function addToHistory(name, time) {
    gameHistory.push({ name, time });
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory)); // Save to localStorage
}

// Update game history display
function updateHistory() {
    historyList.innerHTML = '';
    gameHistory.forEach(game => {
        const li = document.createElement('li');
        li.innerHTML = `${game.name} <span>${game.time} seconds</span>`;
        historyList.appendChild(li);
    });
}

// Update timer
function updateTimer() {
    timer++;
    timerDisplay.textContent = timer;
}

// Reset the game
function resetGame() {
    shuffledCards = shuffle(cards);
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    scoreDisplay.textContent = score;
    timer = 0;
    timerDisplay.textContent = timer;
    clearInterval(gameInterval);

    initializeBoard();
}
