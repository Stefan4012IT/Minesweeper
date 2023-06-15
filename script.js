// Game settings
const boardSize = 10; // Size of the board (10x10)
const totalMines = 10; // Total number of mines

let board = []; // Represents the game board
let minePositions = []; // Stores positions of mines on the board

// Create the game board
function createBoard() {
  for (let row = 0; row < boardSize; row++) {
    let boardRow = [];
    for (let col = 0; col < boardSize; col++) {
      boardRow.push({ mine: false, revealed: false });
    }
    board.push(boardRow);
  }
}

// Place mines randomly on the board
function placeMines() {
  let totalMinesPlaced = 0;
  while (totalMinesPlaced < totalMines) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    if (!board[row][col].mine) {
      board[row][col].mine = true;
      minePositions.push({ row, col });
      totalMinesPlaced++;
    }
  }
}

// Count adjacent mines for each tile
function countAdjacentMines(row, col) {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c].mine) {
        count++;
      }
    }
  }
  return count;
}

// Reveal a tile on the board
function revealTile(row, col) {
  if (board[row][col].mine) {
    gameOver();
  } else {
    const count = countAdjacentMines(row, col);
    board[row][col].revealed = true;
    const paragraph = document.createElement('p');
    if(count === 0){
        document.getElementById(`tile-${row}-${col}`).appendChild(paragraph).innerText = ' '; 
        document.getElementById(`tile-${row}-${col}`).classList.add("revealed"); 
    }else{
        document.getElementById(`tile-${row}-${col}`).appendChild(paragraph).innerText = count;
        document.getElementById(`tile-${row}-${col}`).classList.add("revealed");
    }
    if (count === 0) {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && !board[r][c].revealed) {
            revealTile(r, c);
          }
        }
      }
    }
  }
}


function markTile(row, col) {
    document.getElementById(`tile-${row}-${col}`).classList.add("marker"); 
}

function demarker(row, col) {
    const clickedElem = document.getElementById(`tile-${row}-${col}`).classList.contains("marker");
    if(clickedElem){
        document.getElementById(`tile-${row}-${col}`).classList.remove("marker"); 
    } else {
        markTile(row, col)
    }
}

// Game over
function gameOver() {
  // Reveal all mines
  minePositions.forEach(position => {
    const { row, col } = position;
    document.getElementById(`tile-${row}-${col}`).classList.add("mine");
  });

  // Disable further clicks
//   const tiles = document.getElementsByClassName("tile");
//   for (let i = 0; i < tiles.length; i++) {
//     tiles[i].removeEventListener("click", handleTileClick);
//     // tiles[i].disabled = true;
//   }
  document.getElementById('board').style.pointerEvents = "none";
  
}

// Initialize the game
function initializeGame() {
  createBoard();
  placeMines();
  renderBoard();
}

// Render the game board
function renderBoard() {
  const boardContainer = document.getElementById("board");
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const tile = document.createElement("div");
      tile.id = `tile-${row}-${col}`;
      tile.className = "tile hidden";
      tile.setAttribute('data-long-press-delay', '300');
      tile.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        rightClickMarker(row, col);
      });

    //   tile.addEventListener('long-press', e => {
    //     e.preventDefault();
    //     rightClickMarker(row, col);
    //     return;
    //   })
      tile.addEventListener("click", () => handleTileClick(row, col));
      boardContainer.appendChild(tile);
    }
    boardContainer.appendChild(document.createElement("br"));
  }
  boardContainer.classList.add('initBoard')
}

// Handle tile click event
function handleTileClick(row, col) {
  revealTile(row, col);
}

function rightClickMarker(row, col) {
    demarker(row, col);
}

// Start the game
initializeGame();