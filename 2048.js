import Grid from './Grid.js';
import Tile from './Tile.js';
import Coordinate from './Coordinate.js';

const gameBoard = document.getElementById('game-board');
const currentScore = document.getElementById('current-score');
const bestScore = document.getElementById('best-score');

const gameOver = document.getElementById('game-over');

const localStorage = window.localStorage;
document.getElementById('restart-button').addEventListener('click', function () {
  restartGame(), { once: true };
});

document.getElementById('restart-button').addEventListener('touchend', function () {
  restartGame(), { once: true };
});

var score = 0;
var touchstartCord, touchendCord;

if (!localStorage.getItem('best-score')) {
  localStorage.setItem('best-score', 0);
}

var best = localStorage.getItem('best-score');
bestScore.innerHTML = localStorage.getItem('best-score');

var grid = new Grid(gameBoard);
// Get the bounding rectangle of the source element
let rect = gameBoard.getBoundingClientRect();

// Apply the position to the target element
gameOver.style.position = 'absolute'; // We need absolute positioning

gameOver.style.top = rect.top + 'px'; // Add 'px' to make it valid CSS
gameOver.style.left = rect.left + 'px';
gameOver.style.width = rect.width + 'px';
gameOver.style.height = rect.height + 'px';

grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();

function restartGame() {
  grid.cleanGrid();
  grid = new Grid(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  gameOver.style.display = 'none';
  setupInput();
  score = 0;
  currentScore.innerHTML = score;
  bestScore.innerHTML = localStorage.getItem('best-score');
}
function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
  window.addEventListener('touchstart', handleMobileInput, {
    once: true,
    passive: false,
  });
  window.addEventListener('touchend', handleMobileInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case 'w':
    case 'ArrowUp': {
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    }
    case 's':
    case 'ArrowDown': {
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    }
    case 'a':
    case 'ArrowLeft': {
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    }
    case 'd':
    case 'ArrowRight': {
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    }
    default:
      setupInput();
      return;
  }

  //other code
  grid.cells.forEach((cell) => {
    if (cell.mergeTile) {
      score += cell.mergeTile.value;
    }
    //update best score
    if (score > best) {
      localStorage.setItem('best-score', score);
      bestScore.innerHTML = score;
    }
    cell.mergeTiles();
    currentScore.innerHTML = score;
  });

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  //check for end state
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      //update best score
      if (score > best) {
        localStorage.setItem('best-score', score);
      }
    });
    document.getElementById('game-over').style.display = 'flex';

    return;
  }
  setupInput();
}

async function handleMobileInput(e) {
  e.preventDefault();
  if (e.type == 'touchstart') {
    touchstartCord = new Coordinate(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
  } else {
    console.log(e.preventDefault());

    touchendCord = new Coordinate(e.changedTouches[0].screenX, e.changedTouches[0].screenY);

    let deltaX = touchendCord.x - touchstartCord.x;
    let deltaY = touchendCord.y - touchstartCord.y;

    if (deltaY < 0 && (deltaY / deltaX > 1 || deltaY / deltaX <= -1)) {
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
    } else if (deltaY > 0 && (deltaY / deltaX > 1 || deltaY / deltaX <= -1)) {
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
    } else if (deltaX < 0 && (deltaY / deltaX <= 1 || deltaY / deltaX > -1)) {
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
    } else if (deltaX > 0 && (deltaY / deltaX <= 1 || deltaY / deltaX > -1)) {
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
    } else {
      setupInput();
      return;
    }

    console.log(touchendCord);
    //other code
    grid.cells.forEach((cell) => {
      if (cell.mergeTile) {
        score += cell.mergeTile.value;
      }
      //update best score
      if (score > best) {
        localStorage.setItem('best-score', score);
        bestScore.innerHTML = score;
      }
      cell.mergeTiles();
      currentScore.innerHTML = score;

      const digits = Math.ceil(Math.log10(this.value));

      switch (digits) {
        case 1:
          currentScore.style.fontSize = '7.5vmin';
          log(currentScore);
          break;
        case 2:
          currentScore.style.fontSize = '6.75vmin';
          break;
        case 3:
          currentScore.style.fontSize = '6vmin';
          break;
        case 4:
          currentScore.style.fontSize = '5.25vmin';
          break;
      }
    });

    const newTile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = newTile;

    //check for end state
    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
      newTile.waitForTransition(true).then(() => {
        //update best score
        if (score > best) {
          localStorage.setItem('best-score', score);
        }
      });
      document.getElementById('game-over').style.display = 'flex';
      return;
    }
    setupInput();
  }
  setupInput();
}

function moveUp() {
  sildeTiles(grid.cellsByColumn);
}

function moveDown() {
  sildeTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
  sildeTiles(grid.cellsByRow);
}

function moveRight() {
  sildeTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function sildeTiles(cells) {
  cells.flatMap((group) => {
    const promises = [];
    for (let i = 1; i < group.length; i++) {
      const cell = group[i];
      if (cell.tile == null) continue;
      let lastValidCell;
      for (let j = i - 1; j >= 0; j--) {
        const moveToCell = group[j];
        if (!moveToCell.canAccept(cell.tile)) break;
        lastValidCell = moveToCell;
      }
      if (lastValidCell != null) {
        promises.push(cell.tile.waitForTransition());
        if (lastValidCell.tile != null) {
          lastValidCell.mergeTile = cell.tile;
        } else {
          lastValidCell.tile = cell.tile;
        }
        cell.tile = null;
      }
    }
    return promises;
  });
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}
