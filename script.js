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

const Gameboard = (function () {
  const gameboardEl = document.querySelector('.gameboard');
  const gameboardCellEls = document.querySelectorAll('.gameboard__cell');

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
      return displayController.showWinnerMsg(state.playerX.name);
    else if (checkCombinations('O', arrV, arrH, arrD))
      return displayController.showWinnerMsg(state.playerO.name);

    // TIE
    if (gameboardArr.every(row => row.every(cell => cell.length > 0)))
      displayController.showWinnerMsg();
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

  return { gameboardEl, gameboardCellEls, gameboardArr, controlPlayerMove };
})();

const displayController = (function () {
  const _overlay = document.querySelector('.overlay');

  const toggleHidden = (...els) =>
    els.forEach(el => el.classList.toggle('hidden'));

  // Render the gameboard
  function renderGameboard(gameboard) {
    Gameboard.gameboardCellEls.forEach(cell => {
      const cellRow = +cell.dataset.row;
      const cellCol = +cell.dataset.col;

      cell.dataset.marker = gameboard[cellRow][cellCol];

      cell.textContent = cell.dataset.marker;
    });
  }

  function showWinnerMsg(playerName) {
    toggleHidden(_overlay);

    const markup = `
      <div class="msg--winner">  
        <span>${playerName ? playerName + ' won!' : "It's a tie!"}</span>
        <div>
          <button class="btn--start-menu">Start menu</button>
          <button class="btn--play-again">Play again</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
  }

  function addHandlerStartBtn(handler) {
    startWindow.startBtn.addEventListener('click', handler);
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
    toggleHidden,
    renderGameboard,
    showWinnerMsg,
    addHandlerStartBtn,
    addHandlerPlayerMove,
  };
})();

function init() {
  displayController.addHandlerStartBtn(startWindow.startGame);

  // Attach an event listener so that curPlayer can add his mark to a gamecell
  displayController.addHandlerPlayerMove(Gameboard.controlPlayerMove);
}

init();

// NOTES:
// - all events are attached at displayController
