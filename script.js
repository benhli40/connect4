const rows = 6; // Number of rows in the grid
const cols = 7; // Number of columns in the grid
let board = []; // 2D array representing the game board
let currentPlayer = 1; // Player 1 starts
let isAIPlayer1 = false; // Toggle for Player 1 AI
let isAIPlayer2 = true; // Toggle for Player 2 AI
const boardDiv = document.getElementById("board");
const resetButton = document.getElementById("reset");
const currentPlayerDisplay = document.getElementById("current-player");
const player1AIButton = document.getElementById("toggle-player1-ai");
const player2AIButton = document.getElementById("toggle-player2-ai");

// Initialize the game board
function createBoard() {
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    boardDiv.innerHTML = ""; // Clear the board container
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener("click", () => handlePlayerMove(c));
            boardDiv.appendChild(cell);
        }
    }
    updateCurrentPlayerDisplay();
    if (isAIPlayer1 && currentPlayer === 1) {
        setTimeout(aiMove, 500);
    }
}

// Handle a player's move
function handlePlayerMove(col) {
    if ((currentPlayer === 1 && isAIPlayer1) || (currentPlayer === 2 && isAIPlayer2)) {
        return; // Skip if the current player is AI
    }
    playMove(col);
}

// Play a move
function playMove(col) {
    for (let r = rows - 1; r >= 0; r--) {
        if (board[r][col] === 0) { // Find the first empty spot in the column
            board[r][col] = currentPlayer; // Place the player's piece
            const cell = document.querySelector(`[data-row="${r}"][data-col="${col}"]`);
            cell.classList.add(`player${currentPlayer}`);
            if (checkWin(r, col)) {
                highlightWinningPieces(r, col);
                alert(`Player ${currentPlayer} wins!`);
                disableBoard();
                return;
            }
            currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch player
            updateCurrentPlayerDisplay();
            if ((currentPlayer === 1 && isAIPlayer1) || (currentPlayer === 2 && isAIPlayer2)) {
                setTimeout(aiMove, 500); // AI makes its move
            }
            return;
        }
    }
    alert("Column is full! Choose another column.");
}

// AI move logic
function aiMove() {
    let col;
    // Simple random AI
    do {
        col = Math.floor(Math.random() * cols);
    } while (board[0][col] !== 0); // Ensure the column isn't full
    playMove(col);
}

// Check for a win
function checkWin(row, col) {
    const directions = [
        { dr: 0, dc: 1 },  // Horizontal
        { dr: 1, dc: 0 },  // Vertical
        { dr: 1, dc: 1 },  // Diagonal (bottom-left to top-right)
        { dr: 1, dc: -1 }  // Diagonal (top-left to bottom-right)
    ];

    for (const { dr, dc } of directions) {
        let count = 1;
        count += countInDirection(row, col, dr, dc);
        count += countInDirection(row, col, -dr, -dc);
        if (count >= 4) {
            return { win: true, dr, dc }; // Return the winning direction
        }
    }
    return false;
}

// Highlight all winning pieces
function highlightWinningPieces(row, col) {
    const winData = checkWin(row, col);
    if (!winData) return;
    const { dr, dc } = winData;

    // Highlight the four consecutive pieces in the winning direction
    for (let i = -3; i <= 3; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
            const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            cell.classList.remove(`player1`, `player2`);
            cell.classList.add("player1"); // Red for the winner
        }
    }
}

// Count consecutive pieces in a given direction
function countInDirection(row, col, dr, dc) {
    let r = row + dr;
    let c = col + dc;
    let count = 0;
    while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
        count++;
        r += dr;
        c += dc;
    }
    return count;
}

// Disable the board after the game ends
function disableBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.replaceWith(cell.cloneNode(true))); // Remove all event listeners
}

// Update the current player display
function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.textContent = `Player ${currentPlayer}`;
    currentPlayerDisplay.style.color = currentPlayer === 1 ? "#e74c3c" : "#f1c40f";
}

// Toggle Player 1 AI
player1AIButton.addEventListener("click", () => {
    isAIPlayer1 = !isAIPlayer1;
    player1AIButton.textContent = isAIPlayer1 ? "Player 1: AI" : "Player 1: Human";
    if (isAIPlayer1 && currentPlayer === 1) {
        setTimeout(aiMove, 500);
    }
});

// Toggle Player 2 AI
player2AIButton.addEventListener("click", () => {
    isAIPlayer2 = !isAIPlayer2;
    player2AIButton.textContent = isAIPlayer2 ? "Player 2: AI" : "Player 2: Human";
    if (isAIPlayer2 && currentPlayer === 2) {
        setTimeout(aiMove, 500);
    }
});

// Reset the game
resetButton.addEventListener("click", () => {
    currentPlayer = 1;
    createBoard();
});

// Initialize the game on load
createBoard();