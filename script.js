const state = {
  playerX: {},
  playerO: {},
  curPlayer: {},
};

const Player = function (name, marker) {
  function makeMove(row, col) {
    Gameboard.gameboardArr[row][col] = [marker];
  }

  return { name, marker, makeMove };
};

const startWindow = (function () {
  const _startWindow = document.querySelector('.players__cards');
  const startBtn = document.querySelector('.btn--start');
  const _playerXInput = document.querySelector('.playerX input');
  const _playerOInput = document.querySelector('.playerO input');

  function startGame() {
    // Hide the start window, show the gameboard
    displayController.toggleHidden(_startWindow, Gameboard.gameboardEl);

    // Fetch players names from the DOM
    const playerXname = _playerXInput.value ? _playerXInput.value : 'playerX';
    const playerOname = _playerOInput.value ? _playerOInput.value : 'playerO';

    // Create players
    state.playerX = Player(playerXname, 'X');
    state.playerO = Player(playerOname, 'O');

    // Set PlayerX to be the first player to make a move
    state.curPlayer = state.playerX;
  }

  return { startBtn, startGame };
})();

const endWindow = (function () {
  const endWindowEl = document.querySelector('.msg--winner');
  const winnerMsgEl = document.querySelector('.msg--winner-text');
  const playAgainBtn = document.querySelector('.btn--play-again');
  const startMenuBtn = document.querySelector('.btn--start-menu');

  function resetGame() {
    // 1) Return gameboardArr to the initial state
    Gameboard.gameboardArr.forEach(row =>
      row.forEach(cell => (cell.length = 0))
    );

    // 2) Clear cell's 'marker' property and text content
    Gameboard.gameboardCellsEls.forEach(cell => {
      cell.dataset.marker = '';
      cell.textContent = '';
    });

    // 3) Hide an overlay and the winner message
    displayController.toggleHidden(
      displayController.overlay,
      endWindow.endWindowEl
    );

    // 4) Reset curPlayer to be playerX
    state.curPlayer = state.playerX;
  }

  return { endWindowEl, winnerMsgEl, playAgainBtn, startMenuBtn, resetGame };
})();

const Gameboard = (function () {
  const gameboardEl = document.querySelector('.gameboard');
  const gameboardCellsEls = document.querySelectorAll('.gameboard__cell');

  // State of the gameboard
  const gameboardArr = [
    [[], [], []],
    [[], [], []],
    [[], [], []],
  ];

  function _checkIsGameOver() {
    const checkCombinations = (marker, ...directions) =>
      directions.some(arrDir =>
        arrDir.some(subArrDir => subArrDir.every(cell => cell[0] === marker))
      );

    // prettier-ignore
    // Arrays with winning combinations for each direction
    // arrV - vertical, arrH - horizontal, arrD - diagonal
    const arrV = [], arrH = [], arrD = [];

    for (let i = 0, subArrD1 = [], subArrD2 = []; i <= 2; i++) {
      subArrD1.push(gameboardArr[i][i]);
      subArrD2.push(gameboardArr[i][2 - i]);
      if (i === 2) arrD.push(subArrD1, subArrD2);

      for (let j = 0, subArrV = [], subArrH = []; j <= 2; j++) {
        subArrV.push(gameboardArr[j][i]);
        subArrH.push(gameboardArr[i][j]);

        if (j === 2) {
          arrV.push(subArrV);
          arrH.push(subArrH);
        }
      }
    }

    if (checkCombinations('X', arrV, arrH, arrD))
      return displayController.showWinnerMsg(
        endWindow.winnerMsgEl,
        state.playerX.name
      );

    if (checkCombinations('O', arrV, arrH, arrD))
      return displayController.showWinnerMsg(
        endWindow.winnerMsgEl,
        state.playerO.name
      );

    // TIE
    if (gameboardArr.every(row => row.every(cell => cell.length > 0)))
      displayController.showWinnerMsg(endWindow.winnerMsgEl);
  }

  function controlPlayerMove(row, col) {
    // Don't allow to add a marker if the cell is occupied
    if (gameboardArr[row][col].length > 0) return;

    state.curPlayer.makeMove(row, col);

    // Switch player
    state.curPlayer =
      state.curPlayer === state.playerX ? state.playerO : state.playerX;

    // Render gameboard
    displayController.renderGameboard(gameboardArr);

    _checkIsGameOver();
  }

  return { gameboardEl, gameboardCellsEls, gameboardArr, controlPlayerMove };
})();

const displayController = (function () {
  const overlay = document.querySelector('.overlay');

  const toggleHidden = (...els) =>
    els.forEach(el => el.classList.toggle('hidden'));

  // Render the gameboard
  function renderGameboard(gameboard) {
    Gameboard.gameboardCellsEls.forEach(cell => {
      const cellRow = +cell.dataset.row;
      const cellCol = +cell.dataset.col;

      cell.dataset.marker = gameboard[cellRow][cellCol];

      cell.textContent = cell.dataset.marker;
    });
  }

  function showWinnerMsg(winnerMsgEl, playerName) {
    toggleHidden(overlay, endWindow.endWindowEl);

    winnerMsgEl.textContent = playerName ? playerName + ' won!' : "It's a tie!";
  }

  function addHandlerStartBtn(handler) {
    startWindow.startBtn.addEventListener('click', handler);
  }

  function addHandlerPlayAgainBtn(handler) {
    endWindow.playAgainBtn.addEventListener('click', handler);
  }

  function addHandlerPlayerMove(handler) {
    Gameboard.gameboardEl.addEventListener('click', function (e) {
      const cell = e.target.closest('.gameboard__cell');
      if (!cell) return;

      const row = +cell.dataset.row;
      const col = +cell.dataset.col;

      handler(row, col);
    });
  }

  return {
    overlay,
    toggleHidden,
    renderGameboard,
    showWinnerMsg,
    addHandlerStartBtn,
    addHandlerPlayerMove,
    addHandlerPlayAgainBtn,
  };
})();

function init() {
  displayController.addHandlerStartBtn(startWindow.startGame);

  // Attach an event listener so that curPlayer can add his mark to a gamecell
  displayController.addHandlerPlayerMove(Gameboard.controlPlayerMove);

  displayController.addHandlerPlayAgainBtn(endWindow.resetGame);
}

init();

// NOTES:
// - all events are attached at displayController
