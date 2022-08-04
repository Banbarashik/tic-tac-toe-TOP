const Gameboard = (function () {
  const gameboardArr = [
    [["X"], ["O"], ["X"]],
    [["O"], ["X"], ["O"]],
    [["X"], ["O"], ["X"]],
  ];

  function switchPlayer(players) {
    players.forEach((player) => (player.move = !player.move));
  }

  function makeGameboardActive(player, row, col) {
    gameboardArr[row - 1][col - 1] = [player.marker];
  }

  return { gameboardArr, switchPlayer, makeGameboardActive };
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
  const player1 = Player("Leha", "X");
  const player2 = Player("Gura", "O");

  const curPlayer = player1.move ? player1 : player2;

  // attach an event listener so that curPlayer can add his mark on a gamecell
  displayController.addHandlerAddMark(
    Gameboard.makeGameboardActive.bind(null, curPlayer)
  );

  // after each move:
  // 1) curPlayer is changed
  // 2) gameboard is rendered

  // allow the current player to make a move
  // curPlayer.makeMove(Gameboard.gameboardArr, 3, 2);

  // update gameboard UI
  displayController.renderGameboard(Gameboard.gameboardArr);
}

gameSession();

// Init a game session
// console.log(player1, player2);
// Gameboard.switchPlayer([player1, player2]);
// console.log(player1, player2);

// player1.makeMove(Gameboard.gameboardArr, 1, 2);
// player2.makeMove(Gameboard.gameboardArr, 1, 1);

/*
  TODO:
  1) Build the functions that allow players to add marks to a specific spot on the board - done
  2) Tie it to the DOM, letting players click on the gameboard to place their marker
  3) Don’t forget the logic that keeps players from playing in spots that are already taken
*/
