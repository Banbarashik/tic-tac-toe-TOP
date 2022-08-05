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
    displayController.toggleHidden(_startWindow, Gameboard.gameboardEl);

    const playerXname = _playerXInput.value ? _playerXInput.value : 'playerX';
    const playerOname = _playerOInput.value ? _playerOInput.value : 'playerO';

    gameSession(playerXname, playerOname);
  }

  return { startBtn, startGame };
})();

const Gameboard = (function () {
  const gameboardEl = document.querySelector('.gameboard');
  const gameboardCellEls = document.querySelectorAll('.gameboard__cell');

  const gameboardArr = [
    [[], [], []],
    [[], [], []],
    [[], [], []],
  ];

  function _checkIsGameOver() {
    // HORIZONTAL DIRECTION
    gameboardArr.forEach(row => {
      if (row.every(cell => cell[0] === 'X'))
        return displayController.showWinnerMsg(state.playerX.name);
      if (row.every(cell => cell[0] === 'O'))
        return displayController.showWinnerMsg(state.playerO.name);
    });

    // VERTICAL DIRECTION
    for (let i = 0; i < 3; i++) {
      const colsArr = gameboardArr.reduce((arr, row) => {
        arr.push(row[i]);
        return arr;
      }, []);

      if (colsArr.every(col => col[0] === 'X'))
        return displayController.showWinnerMsg(state.playerX.name);
      if (colsArr.every(col => col[0] === 'O'))
        return displayController.showWinnerMsg(state.playerO.name);
    }

    // DIAOGONAL DIRECTION
    for (let i = 0, arr = []; i < 3; i++) {
      arr.push(gameboardArr[i][i]);

      if (arr.length === 3 && arr.every(cell => cell[0] === 'X'))
        return displayController.showWinnerMsg(state.playerX.name);

      if (arr.length === 3 && arr.every(cell => cell[0] === 'O'))
        return displayController.showWinnerMsg(state.playerO.name);
    }

    for (let i = 0, arr = []; i < 3; i++) {
      arr.push(gameboardArr[i][2 - i]);

      if (arr.length === 3 && arr.every(cell => cell[0] === 'X'))
        return displayController.showWinnerMsg(state.playerX.name);

      if (arr.length === 3 && arr.every(cell => cell[0] === 'O'))
        return displayController.showWinnerMsg(state.playerO.name);
    }

    // TIE
    if (gameboardArr.every(row => row.every(cell => cell.length > 0)))
      displayController.showWinnerMsg();
  }

  function controlGameboard(row, col) {
    // Don't allow to add mark to a cell that already is occupied
    if (gameboardArr[row - 1][col - 1].length > 0) return;

    state.curPlayer.makeMove(gameboardArr, row, col);

    // switch player
    state.curPlayer =
      state.curPlayer === state.playerX ? state.playerO : state.playerX;

    // render gameboard
    displayController.renderGameboard(gameboardArr);

    _checkIsGameOver();
  }

  return { gameboardEl, gameboardCellEls, gameboardArr, controlGameboard };
})();

const displayController = (function () {
  const _overlay = document.querySelector('.overlay');

  const toggleHidden = (...els) =>
    els.forEach(el => el.classList.toggle('hidden'));

  // render gameboard in the DOM
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
        <span>${playerName ? playerName + 'won!' : "It's a tie!"}</span>
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
  function makeMove(gameboard, row, col) {
    gameboard[row - 1][col - 1] = [marker];
  }

  return { name, marker, makeMove };
};

function gameSession(playerXname, playerOname) {
  // create players
  state.playerX = Player(playerXname, 'X');
  state.playerO = Player(playerOname, 'O');

  // playerX is the first player to make a move
  state.curPlayer = state.playerX;
}

gameSession();

function init() {
  displayController.addHandlerStartBtn(startWindow.startGame);
  // attach an event listener so that curPlayer can add his mark to a gamecell
  displayController.addHandlerAddMark(Gameboard.controlGameboard);
}

init();

// TODO:
// Build the logic that checks for when the game is over! Should check for 3-in-a-row and a tie.
