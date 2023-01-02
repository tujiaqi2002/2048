import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");
const currentScore = document.getElementById("current-score");
const highestScore = document.getElementById("highest-score");
const localStorage = window.localStorage;
var score = 0;

if (!localStorage.getItem("highest-score")) {
  localStorage.setItem("highest-score", 0);
  console.log("1");
}
var highest = localStorage.getItem("highest-score");

highestScore.innerHTML = localStorage.getItem("highest-score");


console.log(highest)


const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
  console.log(e.key);
  switch (e.key) {
    case "w":
    case "ArrowUp": {
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    }
    case "s":
    case "ArrowDown": {
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    }
    case "a":
    case "ArrowLeft": {
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    }
    case "d":
    case "ArrowRight": {
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
    cell.mergeTiles();
    currentScore.innerHTML = score;
  });

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  //check for end state
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
          //update highest score
          if (score > highest) {
            localStorage.setItem("highest-score", score);
          }
      alert("You lose");
    });
    return;
  }
  setupInput();
}

// async function handleMobile(e) {
//   console.log(e.key);
//   switch (e.key) {
//     case "w":
//     case "ArrowUp": {
//       if (!canMoveUp()) {
//         setupInput();
//         return;
//       }
//       await moveUp();
//       break;
//     }
//     case "s":
//     case "ArrowDown": {
//       if (!canMoveDown()) {
//         setupInput();
//         return;
//       }
//       await moveDown();
//       break;
//     }
//     case "a":
//     case "ArrowLeft": {
//       if (!canMoveLeft()) {
//         setupInput();
//         return;
//       }
//       await moveLeft();
//       break;
//     }
//     case "d":
//     case "ArrowRight": {
//       if (!canMoveRight()) {
//         setupInput();
//         return;
//       }
//       await moveRight();
//       break;
//     }
//     default:
//       setupInput();
//       return;
//   }

//   //other code
//   grid.cells.forEach((cell) => cell.mergeTiles());

//   const newTile = new Tile(gameBoard);
//   grid.randomEmptyCell().tile = newTile;

//   //check for end state
//   if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
//     newTile.waitForTransition(true).then(() => {
//       alert("You lose");
//     });
//     return;
//   }
//   setupInput();
// }

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
