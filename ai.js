const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class TicTacToe {
  constructor() {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    this.activePlayer = 'X';
    this.playerTurn();
  }

  playerTurn() {
    this.printBoard();
    this.getMove((rowIdx, colIdx) => {
      this.board[rowIdx][colIdx] = this.activePlayer;
      if (this.checkForWin(this.board)) {
        this.printBoard();
        this.endGame(this.activePlayer);
      }
      else if (this.checkForGameOver(this.board)) {
        this.printBoard();
        this.endGame(null);
      }
      else {
        this.activePlayer = this.activePlayer === 'X' ? 'O' : 'X';
        this.computerTurn();
      }
    });
  }

  computerTurn() {
    const move = this.pickOptimalMove([...this.board.map(row => row.slice())], this.activePlayer);
    this.board[move.x][move.y] = this.activePlayer;
    if (this.checkForWin(this.board)) {
      this.printBoard();
      this.endGame(this.activePlayer);
    }
    else if (this.checkForGameOver(this.board)) {
      this.printBoard();
      this.endGame(null);
    }
    else {
      this.activePlayer = this.activePlayer === 'X' ? 'O' : 'X';
      this.playerTurn();
    }
  }
  
  pickOptimalMove(board, player) {
    const bestMove = {
      x: null,
      y: null,
    };
    let bestValue;
    let moveValue;

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (!board[i][j]) {
          board[i][j] = player;
          moveValue = -this.miniMax(board, player === 'X' ? 'O' : 'X');
          if (typeof bestValue !== 'number' || bestValue < moveValue) {
            bestMove.x = i;
            bestMove.y = j;
            bestValue = moveValue;
          }
          board[i][j] = null;
        }
      }
    }

    return bestMove;
  }

  miniMax(board, player) {
    if (this.checkForWin(board)) {
      return -1;
    }
    
    if (this.checkForGameOver(board)) {
      return 0;
    }

    let bestValue = null;
    let valueOfMove;

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (!board[i][j]) {
          board[i][j] = player;
          valueOfMove = -this.miniMax(board, player === 'X' ? 'O' : 'X');
          board[i][j] = null;
          if (typeof bestValue !== 'number' || bestValue < valueOfMove)
            bestValue = valueOfMove;
        }
      }
    }

    return bestValue;
  }

  endGame(winner) {
    if (winner)
      console.log(winner + ' wins!');
    else
      console.log('It\'s a draw!');
    rl.close();
  }

  getMove(cb) {
    let rowIdx;
    let colIdx;
    
    this.getIndex('row', (row) => {
      rowIdx = parseInt(row) - 1;
      this.getIndex('col', (col) => {
        colIdx = parseInt(col) - 1;
        if (this.board[rowIdx][colIdx]) {
          console.log('space is taken');
          this.getMove(cb);
        }
        else {
          cb(rowIdx, colIdx);
        }
      });
    });
  }

  checkForWin(board) {
    return this.checkMainDiagonalForWin(board) ||
    this.checkAntiDiagonalForWin(board) ||
    this.checkRowsForWin(board) ||
    this.checkColsForWin(board);
  }

  checkMainDiagonalForWin(board) {
    return board[0][0] &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2];
  }

  checkAntiDiagonalForWin(board) {
    return board[0][2] &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0];
  }

  checkColsForWin(board) {
    return board.some((row, colStartIdx) => this.checkColForWin(board, colStartIdx));
  }

  checkColForWin(board, i) {
    return board.every(row => row[i] && row[i] === board[0][i]);
  }

  checkRowsForWin(board) {
    return board.some((row, rowStartIdx) => this.checkRowForWin(board, rowStartIdx));
  }

  checkRowForWin(board, i) {
    return board[i].every(val => val && val === board[i][0]);
  }

  checkForGameOver(board) {
    return board.every(row => row.every(space => space));
  }

  getIndex(rowOrCol, cb) {
    rl.question('Would you like to place your ' + this.activePlayer +
    ' in ' + rowOrCol + ' 1, 2, or 3?', (answer) => {
      if (answer !== '1' && answer !== '2' && answer !== '3') {
        if(answer === 'resign'){
          process.exit(1)
        }
        console.log('invalid input');
        this.getIndex(rowOrCol, cb);
      }
      else {
        cb(answer);
      }
    });
  }

  printBoard() {

    console.log('~~~~~~~~~~~~~~');

    this.printRow(this.board[0]);
    console.log('~~~~~~~~~~~~~~');

    this.printRow(this.board[1]);
    console.log('~~~~~~~~~~~~~~');

    this.printRow(this.board[2]);
    console.log('~~~~~~~~~~~~~~');

  }

  getSquareString(val) {
    return val ? val : ' ';
  }

  printRow(row) {
    console.log(this.getSquareString(row[0]) + `  |  `
    + this.getSquareString(row[1]) + '  |  '
    + this.getSquareString(row[2]));
  }
}

new TicTacToe;