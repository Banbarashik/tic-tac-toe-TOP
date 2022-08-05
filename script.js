const state = {
  playerX: {},
  playerO: {},
  curPlayer: {},
};

const startWindow = (function () {
  const _startWindow = document.querySelector('.players__cards');
  const startBtn = document.querySelector('.btn--start');

  function startGame() {
    displayController.toggleHidden(_startWindow, Gameboard.gameboardEl);
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

  function _checkMarksPositions() {
    // HORIZONTAL DIRECTION
    gameboardArr.forEach(row => {
      if (row.every(cell => cell[0] === 'X')) console.log('PlayerX won!');
      if (row.every(cell => cell[0] === 'O')) console.log('PlayerO won!');
    });

    // VERTICAL DIRECTION
    for (let i = 0; i < 3; i++) {
      const colsArr = gameboardArr.reduce((arr, row) => {
        arr.push(row[i]);
        return arr;
      }, []);

      if (colsArr.every(col => col[0] === 'X')) console.log('PlayerX won!');
      if (colsArr.every(col => col[0] === 'O')) console.log('PlayerO won!');
    }

    // DIAOGONAL DIRECTION
    for (let i = 0, arr = []; i < 3; i++) {
      arr.push(gameboardArr[i][i]);

      if (arr.length === 3 && arr.every(cell => cell[0] === 'X'))
        console.log('PlayerX won!');

      if (arr.length === 3 && arr.every(cell => cell[0] === 'O'))
        console.log('PlayerO won!');
    }

    for (let i = 0, arr = []; i < 3; i++) {
      arr.push(gameboardArr[i][2 - i]);

      if (arr.length === 3 && arr.every(cell => cell[0] === 'X'))
        console.log('PlayerX won!');

      if (arr.length === 3 && arr.every(cell => cell[0] === 'O'))
        console.log('PlayerO won!');
    }
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

    _checkMarksPositions();
  }

  return { gameboardEl, gameboardCellEls, gameboardArr, controlGameboard };
})();

const displayController = (function () {
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
    addHandlerStartBtn,
    addHandlerAddMark,
  };
})();

const Player = function (name, marker) {
  const move = marker === 'X' ? true : false;

  function makeMove(gameboard, row, col) {
    gameboard[row - 1][col - 1] = [marker];
  }

  return { name, marker, move, makeMove };
};

function gameSession() {
  // create players
  state.playerX = Player('Leha', 'X');
  state.playerO = Player('Gura', 'O');

  state.curPlayer = state.playerX;

  // attach an event listener so that curPlayer can add his mark to a gamecell
  displayController.addHandlerAddMark(Gameboard.controlGameboard);
}

gameSession();

displayController.addHandlerStartBtn(startWindow.startGame);

// TODO:
// Build the logic that checks for when the game is over! Should check for 3-in-a-row and a tie.
