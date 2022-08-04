const state = {
  playerX: {},
  playerO: {},
  curPlayer: {},
};

const Gameboard = (function () {
  const gameboardArr = [
    [["X"], ["O"], ["X"]],
    [["O"], ["X"], ["O"]],
    [["X"], ["O"], ["X"]],
  ];

  function controlGameboard(row, col) {
    // code fully describing player's move
    console.log(state);
    state.curPlayer.makeMove(gameboardArr, row, col);

    // switch player
    state.curPlayer === state.playerX ? state.playerO : state.playerX;

    // render gameboard
    displayController.renderGameboard(gameboardArr);
  }

  return { gameboardArr, controlGameboard };
})();

const displayController = (function () {
  const gameboardEl = document.querySelector(".gameboard");
  const gameboardCellEls = document.querySelectorAll(".gameboard__cell");

  // render gameboard in the DOM
  function renderGameboard(gameboard) {
    gameboardCellEls.forEach((cell) => {
      const cellRow = +cell.dataset.row;
      const cellCol = +cell.dataset.col;

      cell.dataset.marker = gameboard[cellRow - 1][cellCol - 1];

      cell.textContent = cell.dataset.marker;
    });
  }

  function addHandlerAddMark(handler) {
    gameboardEl.addEventListener("click", function (e) {
      const cell = e.target.closest(".gameboard__cell");
      if (!cell) return;

      const row = +cell.dataset.row;
      const col = +cell.dataset.col;

      handler(row, col);
    });
  }

  return { renderGameboard, addHandlerAddMark };
})();

const Player = function (name, marker) {
  const move = marker === "X" ? true : false;

  function makeMove(gameboard, row, col) {
    gameboard[row - 1][col - 1] = [marker];
  }

  return { name, marker, move, makeMove };
};

function gameSession() {
  // create players
  state.playerX = Player("Leha", "X");
  state.playerO = Player("Gura", "O");

  state.curPlayer = state.playerX;

  // attach an event listener so that curPlayer can add his mark on a gamecell
  displayController.addHandlerAddMark(Gameboard.controlGameboard);
}

gameSession();

// Init a game session
// console.log(playerX, playerO);
// Gameboard.switchPlayer([playerX, playerO]);
// console.log(playerX, playerO);

// playerX.makeMove(Gameboard.gameboardArr, 1, 2);
// playerO.makeMove(Gameboard.gameboardArr, 1, 1);

/*
  TODO:
  1) Build the functions that allow players to add marks to a specific spot on the board - done
  2) Tie it to the DOM, letting players click on the gameboard to place their marker
  3) Don’t forget the logic that keeps players from playing in spots that are already taken
*/
