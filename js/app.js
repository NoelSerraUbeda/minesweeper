const container = document.getElementById('container');
const modal = document.getElementById('modal-container');
const modalText = document.getElementById('modal-text');
const rows = 10;
const cols = 10;
const mines = 20;

const grid = [];
let gameOver = false;
const resetButton = document.querySelector('.reset');

function createGrid() {
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push({ isMine: false, revealed: false });
    }
    grid.push(row);
  }
  placeMines();
}

function placeMines() {
  let minesToPlace = mines;
  while (minesToPlace > 0) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!grid[row][col].isMine) {
      grid[row][col].isMine = true;
      minesToPlace--;
    }
  }
}

function renderGrid() {
  container.innerHTML = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', handleClick);
      container.appendChild(cell);

      // // Muestra las minas al inicio
      // if (grid[i][j].isMine) {
      //   cell.classList.add('mine');
      // }
    }
  }
}


function handleClick(event) {
  if (gameOver) return;

  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  if (grid[row][col].isMine) {
    event.target.classList.add('mine');
    revealMines();
    gameOver = true;
    showModal('¡Perdiste!');
    resetButton.removeAttribute('disabled');
    document.dispatchEvent(new Event('gameEnd'));
    document.querySelector('.face img').src = './icon/sad.svg';
  } else {
    revealCell(row, col);
    if (checkWin()) {
      revealMines();
      gameOver = true;
      showModal('¡Ganaste!');
      resetButton.removeAttribute('disabled');
      document.dispatchEvent(new Event('gameEnd'));
      document.querySelector('.face img').src = './icon/cool.svg';
    }
  }
}

function showModal(message) {
  modalText.textContent = message;
  modal.style.display = 'block';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 3000);
}

function revealCell(row, col) {
  const cell = container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (!cell || grid[row][col].revealed) return;

  grid[row][col].revealed = true;
  cell.classList.add('hidden');

  const minesNearby = countMinesNearby(row, col);
  if (minesNearby > 0) {
    cell.textContent = minesNearby;
  } else {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols) {
          revealCell(i, j);
        }
      }
    }
  }
}

function countMinesNearby(row, col) {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < rows && j >= 0 && j < cols && grid[i][j].isMine) {
        count++;
      }
    }
  }
  return count;
}

function revealMines() {
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.isMine) {
        const mineCell = container.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
        mineCell.classList.add('mine');
      }
    });
  });
}

function checkWin() {
  let unrevealedSafeCells = 0;
  grid.forEach(row => {
    row.forEach(cell => {
      if (!cell.isMine && !cell.revealed) {
        unrevealedSafeCells++;
      }
    });
  });
  return unrevealedSafeCells === 0;
}

createGrid();
renderGrid();

const resetButtons = document.getElementsByClassName("reset");
for (let i = 0; i < resetButtons.length; i++) {
    resetButtons[i].addEventListener("click", function() {
        resetGame();
    });
}

function resetGame() {
  location.reload();
}
