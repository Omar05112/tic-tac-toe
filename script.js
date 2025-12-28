/*
 ** The Gameboard represents the state of the board
 ** Each square holds a Cell (defined later)
 ** and we expose a placeToken method to be able to add Cells to squares
 */

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  const winningCombos = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const resetBoard = () => {
    const emptyCell = Cell();
    emptyCell.addToken(0);
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i][j] = emptyCell;
      }
    }
  };
  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => board;

  // In order to drop a token, we need to find what the lowest point of the
  // selected column is, *then* change that cell's value to the player number
  const placeToken = (row, column, player) => {
    if (
      board[row][column].getValue() == "X" ||
      board[row][column].getValue() == "O"
    ) {
      console.log("Invalid move");
      return true;
    }
    board[row][column].addToken(player);
    return false;
  };

  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play,
  // but we won't need it after we build our UI
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return { getBoard, placeToken, printBoard, resetBoard, winningCombos };
}

/*
 ** A Cell represents one "square" on the board and can have one of
 ** 0: no token is in the square,
 ** 1: Player One's token,
 ** 2: Player 2's token
 */

function Cell() {
  let value = 0;

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

/*
 ** The GameController will be responsible for controlling the
 ** flow and state of the game's turns, as well as whether
 ** anybody has won the game
 */
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    // Drop a token for the current player
    console.log(
      `${getActivePlayer().name} placed their token ${
        getActivePlayer().token
      } into row ${row} column ${column}...`
    );

    let invalid = true;

    invalid = board.placeToken(row, column, getActivePlayer().token);

    if (invalid) return;

    const checkForWin = () => {
      const array = board.getBoard();
      for (let i = 0; i < board.winningCombos.length; i++) {
        const firstElement = board.winningCombos[i][0];
        const secondElement = board.winningCombos[i][1];
        const thirdElement = board.winningCombos[i][2];
        console.log(
          `FIRST ELEMENT: ${firstElement}, SECOND ELEMENT: ${secondElement}, THIRD ELEMENT: ${thirdElement} `
        );
        if (
          array[firstElement[0]][firstElement[1]].getValue() ==
            array[secondElement[0]][secondElement[1]].getValue() &&
          array[thirdElement[0]][thirdElement[1]].getValue() ==
            array[firstElement[0]][firstElement[1]].getValue() &&
          array[firstElement[0]][firstElement[1]].getValue() !== 0
        ) {
          console.log(`${getActivePlayer().name} wins`);
          return true;
        }
      }
      return false;
    };

    const hasWon = checkForWin();
    // Switch player turn

    if (hasWon) {
      console.log("lah yn3l jd chi coding");
      board.resetBoard();
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
