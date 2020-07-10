const prompt = require("prompt");

function startGame() {
  prompt.start();
  console.log("Please input your name: ");

  prompt.get(["PlayerX", "PlayerO"], function (err, result) {
    if (err) {
      return onErr(err);
    }
    var first = result.PlayerX;
    var second = result.PlayerO;
    console.log("  Player X: " + result.PlayerX);
    console.log("  Player O: " + result.PlayerO);
    if (result.PlayerX && result.PlayerO) {
      console.log(
        `Game started: ${result.PlayerX} has the first move \n` +

         "    1   2   3 \n"+
          "   ~~~~~~~~~~~\n"+
        "1 |   |   |   |\n"+
          "   ~~~~~~~~~~~\n"+
        "2 |   |   |   |\n"+
          "   ~~~~~~~~~~~\n"+
        "3 |   |   |   |\n"+
          "   ~~~~~~~~~~~\n"
      );

      var board = {
        1: " ",
        2: " ",
        3: " ",
        4: " ",
        5: " ",
        6: " ",
        7: " ",
        8: " ",
        9: " ",
      };

      function boardSchema(position, mark) {
        board[position] = mark.toUpperCase();
      }

      function returnBoard() {
        console.log(
          "\n" +
            "   1   2   3 \n " +
            " ~~~~~~~~~~~\n"+
            "1| "+board[1]+" | "+board[2]+" | "+board[3]+" |\n"+
            " ~~~~~~~~~~~~\n"+
            "2| "+board[4]+" | "+board[5]+" | "+board[6]+" |\n"+
            " ~~~~~~~~~~~~\n"+
            "3| "+board[7]+" | "+board[8]+" | "+board[9]+" |\n"+
            " ~~~~~~~~~~~~\n"
        );
      }

      function isInt(value) {
        var x;
        if (isNaN(value)) {
          return false;
        }
        x = parseFloat(value);
        return (x | 0) === x;
      }

      function validateMove(position, player) {
        if (position === "resign") {
          if (player === "X") {
            console.log(`Winner is ${second}`);
          } else {
            console.log(`Winner is ${first}`);
          }

          process.exit(1);
        }
        return isInt(position) && board[position] === " ";
      }

      var winCombinations = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7],
      ];

      function checkWin(player) {
        var i, j, markCount;
        for (i = 0; i < winCombinations.length; i++) {
          markCount = 0;
          for (j = 0; j < winCombinations[i].length; j++) {
            if (board[winCombinations[i][j]] === player) {
              markCount++;
            }
            if (markCount === 3) {
              return true;
            }
          }
        }
        return false;
      }

      function checkTie() {
        for (var i = 1; i <= Object.keys(board).length; i++) {
          if (board[i] === " ") {
            return false;
          }
        }
        return true;
      }

      function playTurn(player) {
        {
          player === "X"
            ? console.log(`Your turn ${result.PlayerX}... `)
            : console.log(`Your turn ${result.PlayerO}...`);
        }
        prompt.start();
        prompt.get(["position"], function (err, result) {
          if (validateMove(result.position, player) === true) {
            boardSchema(result.position, player);
            returnBoard();
            if (checkWin(player) === true) {
              if ((player = "X")) {
                console.log(`${first} wins!`);
                prompt.get(["Rematch"], function (err, res) {
                  var resp = res.Rematch;
                  var rez = resp.toUpperCase();
                  if (rez === "NO") {
                    return null;
                  }
                  if (rez === "N") {
                    return null;
                  } else {
                    startGame();
                  }
                });
              } else {
                console.log(`${second} wins`);
                prompt.get(["Rematch"], function (err, res) {
                  var resp = res.Rematch;
                  var rez = resp.toUpperCase();
                  if (rez === "NO") {
                    return null;
                  }
                  if (rez === "N") {
                    return null;
                  } else {
                    startGame();
                  }
                });
              }
              return;
            }
            if (checkTie() === true) {
              console.log("Tie Game");
              return;
            }
            if (player === "X") {
              playTurn("O");
            } else {
              playTurn("X");
            }
          } else {
            console.log("Invalid input please try again...");
            playTurn(player);
          }
        });
      }

      playTurn("X");
    } else {
      console.log("Error");
    }
  });

  function onErr(err) {
    console.log(err);
    return 1;
  }
}

startGame();
