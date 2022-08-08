const state = {
  playerX: {},
  playerO: {},
  curPlayer: {},
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
    const checkCombination = marker =>
      allArrs.some(arr => arr.every(cell => cell[0] === marker));

    // prettier-ignore
    // Arrays for all possible winning combinations
    const arrV1 = [], arrV2 = [], arrV3 = [], arrH1 = [],
    arrH2 = [], arrH3 = [], arrD1 = [], arrD2 = [];

    const allArrs = [arrV1, arrV2, arrV3, arrH1, arrH2, arrH3, arrD1, arrD2];

    for (let i = 0; i <= 2; i++) {
      arrV1.push(gameboardArr[i][0]);
      arrV2.push(gameboardArr[i][1]);
      arrV3.push(gameboardArr[i][2]);
      arrH1.push(gameboardArr[0][i]);
      arrH2.push(gameboardArr[1][i]);
      arrH3.push(gameboardArr[2][i]);
      arrD1.push(gameboardArr[i][i]);
      arrD2.push(gameboardArr[i][2 - i]);
    }

    if (checkCombination('X'))
      return displayController.showWinnerMsg(state.playerX.name);
    else if (checkCombination('O'))
      return displayController.showWinnerMsg(state.playerO.name);

    // TIE
    if (gameboardArr.every(row => row.every(cell => cell.length > 0)))
      displayController.showWinnerMsg();
  }

  function controlPlayerMove(row, col) {
    // Don't allow to add a marker if the cell is occupied
    if (gameboardArr[row - 1][col - 1].length > 0) return;

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

      cell.dataset.marker = gameboard[cellRow - 1][cellCol - 1];

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

  function addHandlerAddMark(handler) {
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
    addHandlerAddMark,
  };
})();

const Player = function (name, marker) {
  function makeMove(row, col) {
    Gameboard.gameboardArr[row - 1][col - 1] = [marker];
  }

  return { name, marker, makeMove };
};

function init() {
  displayController.addHandlerStartBtn(startWindow.startGame);

  // Attach an event listener so that curPlayer can add his mark to a gamecell
  displayController.addHandlerAddMark(Gameboard.controlPlayerMove);
}

init();

// NOTES:
// - all events are attached at displayController
