import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
  console.log(e.key);
  switch (e.key) {
    case "w":
    case "ArrowUp": {
      await moveUp();
      break;
    }
    case "s":
    case "ArrowDown": {
      await moveDown();
      break;
    }
    case "a":
    case "ArrowLeft": {
      await moveLeft();
      break;
    }
    case "d":
    case "ArrowRight": {
      await moveRight();
      break;
    }
    default:
      setupInput();
      return;
  }

  //other code
  grid.cells.forEach((cell) => cell.mergeTiles());

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
  cells.forEach((group) => {
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
        if (lastValidCell.tile != null) {
          lastValidCell.mergeTile = cell.tile;
        } else {
          lastValidCell.tile = cell.tile;
        }
        cell.tile = null;
      }
    }
  });
}
