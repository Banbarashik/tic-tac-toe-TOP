const Gameboard = (function () {
  const gameboardArr = [
    [["X"], ["O"], ["X"]],
    [["O"], ["X"], ["O"]],
    [["X"], ["O"], ["X"]],
  ];

  function switchPlayer(players) {
    players.forEach((player) => (player.move = !player.move));
  }

  return { gameboardArr, switchPlayer };
})();

const displayController = (function () {
  const gameboardEl = document.querySelector(".gameboard");
  const gameboardCellEls = document.querySelectorAll(".gameboard__cell");

  // render gameboard in the DOM
  function renderGameboard(gameboard) {
    gameboardCellEls.forEach((cell) => {
      const cellRow = cell.dataset.row;
      const cellCol = cell.dataset.col;

      cell.dataset.marker = gameboard[cellRow - 1][cellCol - 1];

      cell.textContent = cell.dataset.marker;
    });
  }

  return { renderGameboard };
})();

const Player = function (name, marker) {
  const move = marker === "X" ? true : false;

  function makeMove(gameboard, row, col) {
    gameboard[row - 1][col - 1] = [marker];
  }

  return { name, marker, move, makeMove };
};

// Init a game session
const player1 = Player("Leha", "X");
const player2 = Player("Gura", "O");
console.log(player1, player2);
Gameboard.switchPlayer([player1, player2]);
console.log(player1, player2);

player1.makeMove(Gameboard.gameboardArr, 1, 2);
player2.makeMove(Gameboard.gameboardArr, 1, 1);

displayController.renderGameboard(Gameboard.gameboardArr);

/*
  TODO:
  1) Build the functions that allow players to add marks to a specific spot on the board - done
  2) Tie it to the DOM, letting players click on the gameboard to place their marker
  3) Don’t forget the logic that keeps players from playing in spots that are already taken
*/
