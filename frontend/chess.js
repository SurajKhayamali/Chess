// function getChessMoves(fen) {
//   function fenToBoard(fen) {
//     const board = [];
//     const rows = fen.split(" ")[0].split("/");

//     rows.forEach((row) => {
//       const currentRow = [];
//       for (let i = 0; i < row.length; i++) {
//         if (!isNaN(row[i])) {
//           for (let j = 0; j < parseInt(row[i]); j++) {
//             currentRow.push(null);
//           }
//         } else {
//           currentRow.push(row[i]);
//         }
//       }
//       board.push(currentRow);
//     });

//     return board;
//   }

//   function isWithinBounds(row, col) {
//     return row >= 0 && row < 8 && col >= 0 && col < 8;
//   }

//   function isKingInCheck(board, kingColor) {
//     // Find the king's position
//     let kingRow, kingCol;

//     for (let i = 0; i < 8; i++) {
//       for (let j = 0; j < 8; j++) {
//         if (
//           board[i][j] !== null &&
//           board[i][j].toLowerCase() === `k${kingColor[0]}`
//         ) {
//           kingRow = i;
//           kingCol = j;
//           break;
//         }
//       }
//     }

//     // Check if the king is under attack by any opposing piece
//     for (let i = 0; i < 8; i++) {
//       for (let j = 0; j < 8; j++) {
//         if (
//           board[i][j] !== null &&
//           board[i][j].toLowerCase() !== `k${kingColor[0]}`
//         ) {
//           const opponentColor =
//             board[i][j] === board[i][j].toUpperCase() ? "white" : "black";
//           const opponentMoves = getPossibleMoves(board, board[i][j], i, j);

//           for (const move of opponentMoves) {
//             if (move.row === kingRow && move.col === kingCol) {
//               return true; // King is in check
//             }
//           }
//         }
//       }
//     }

//     return false; // King is not in check
//   }

//   const board = fenToBoard(fen);
//   const moves = {};

//   for (let i = 0; i < 8; i++) {
//     for (let j = 0; j < 8; j++) {
//       const piece = board[i][j];

//       if (piece !== null) {
//         const key = `${piece}${i}${j}`;
//         moves[key] = getPossibleMoves(board, piece, i, j);
//       }
//     }
//   }

//   const turn = fen.split(" ")[1];
//   const kingColor = turn === "w" ? "white" : "black";
//   const isInCheck = isKingInCheck(board, kingColor);

//   return { moves, isInCheck };
// }

// // Example usage:
// const fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
// const result = getChessMoves(fenString);
// console.log(result);
function getChessMoves(fen) {
  function fenToBoard(fen) {
    const board = [];
    const rows = fen.split(" ")[0].split("/");

    rows.forEach((row) => {
      const currentRow = [];
      for (let i = 0; i < row.length; i++) {
        if (!isNaN(row[i])) {
          for (let j = 0; j < parseInt(row[i]); j++) {
            currentRow.push(null);
          }
        } else {
          currentRow.push(row[i]);
        }
      }
      board.push(currentRow);
    });

    return board;
  }

  function isWithinBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  function getPossibleMoves(board, piece, row, col, turn) {
    const isWhite = turn === "w";
    const direction = isWhite ? -1 : 1;

    function addMoveIfValid(moveRow, moveCol) {
      if (isWithinBounds(moveRow, moveCol)) {
        const targetPiece = board[moveRow][moveCol];
        if (
          targetPiece === null ||
          (isWhite ? targetPiece.toLowerCase() : targetPiece.toUpperCase())
        ) {
          if (resolvesCheck(board, piece, row, col, moveRow, moveCol, turn))
            possibleMoves.push({ row: moveRow, col: moveCol });
        }
      }
    }

    let possibleMoves = [];

    switch (piece.toLowerCase()) {
      case "p": // Pawn
        const startRow = isWhite ? 6 : 1;
        const forwardOne = row + direction;
        const forwardTwo = row + 2 * direction;

        addMoveIfValid(forwardOne, col);
        if (row === startRow && board[forwardTwo][col] === null) {
          addMoveIfValid(forwardTwo, col);
        }

        // Capture moves
        addMoveIfValid(forwardOne, col + 1);
        addMoveIfValid(forwardOne, col - 1);
        break;

      case "r": // Rook
        for (let i = row - 1; i >= 0; i--) {
          addMoveIfValid(i, col);
          if (board[i][col] !== null) break;
        }
        for (let i = row + 1; i < 8; i++) {
          addMoveIfValid(i, col);
          if (board[i][col] !== null) break;
        }
        for (let j = col - 1; j >= 0; j--) {
          addMoveIfValid(row, j);
          if (board[row][j] !== null) break;
        }
        for (let j = col + 1; j < 8; j++) {
          addMoveIfValid(row, j);
          if (board[row][j] !== null) break;
        }
        break;

      case "n": // Knight
        const knightMoves = [
          { row: row - 2, col: col - 1 },
          { row: row - 2, col: col + 1 },
          { row: row - 1, col: col - 2 },
          { row: row - 1, col: col + 2 },
          { row: row + 1, col: col - 2 },
          { row: row + 1, col: col + 2 },
          { row: row + 2, col: col - 1 },
          { row: row + 2, col: col + 1 },
        ];

        knightMoves.forEach((move) => {
          addMoveIfValid(move.row, move.col);
        });
        break;

      case "b": // Bishop
        for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
          addMoveIfValid(row - i, col - i);
          if (board[row - i][col - i] !== null) break;
        }
        for (let i = 1; row - i >= 0 && col + i < 8; i++) {
          addMoveIfValid(row - i, col + i);
          if (board[row - i][col + i] !== null) break;
        }
        for (let i = 1; row + i < 8 && col - i >= 0; i++) {
          addMoveIfValid(row + i, col - i);
          if (board[row + i][col - i] !== null) break;
        }
        for (let i = 1; row + i < 8 && col + i < 8; i++) {
          addMoveIfValid(row + i, col + i);
          if (board[row + i][col + i] !== null) break;
        }
        break;

      case "q": // Queen
        // Combining rook and bishop moves
        getPossibleMoves(board, "r", row, col, turn).forEach((move) => {
          possibleMoves.push(move);
        });
        getPossibleMoves(board, "b", row, col, turn).forEach((move) => {
          possibleMoves.push(move);
        });
        break;

      case "k": // King
        const kingMoves = [
          { row: row - 1, col },
          { row: row + 1, col },
          { row, col: col - 1 },
          { row, col: col + 1 },
          { row: row - 1, col: col - 1 },
          { row: row - 1, col: col + 1 },
          { row: row + 1, col: col - 1 },
          { row: row + 1, col: col + 1 },
        ];

        kingMoves.forEach((move) => {
          addMoveIfValid(move.row, move.col);
        });
        break;
    }

    return possibleMoves;
  }

  function isKingInCheck(board, turn) {
    const kingColor = turn === "w" ? "white" : "black";

    // Find the king's position
    let kingRow, kingCol;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (
          board[i][j] !== null &&
          board[i][j].toLowerCase() === `k${kingColor[0]}`
        ) {
          kingRow = i;
          kingCol = j;
          break;
        }
      }
    }

    // Check if the king is under attack by any opposing piece
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (
          board[i][j] !== null &&
          board[i][j].toLowerCase() !== `k${kingColor[0]}`
        ) {
          const opponentColor =
            board[i][j] === board[i][j].toUpperCase() ? "white" : "black";
          const opponentMoves = getPossibleMoves(
            board,
            board[i][j],
            i,
            j,
            opponentColor
          );

          for (const move of opponentMoves) {
            if (move.row === kingRow && move.col === kingCol) {
              return true; // King is in check
            }
          }
        }
      }
    }

    return false; // King is not in check
  }

  function resolvesCheck(board, piece, fromRow, fromCol, toRow, toCol, turn) {
    // Simulate the move and check if the king is still in check after the move
    const tempBoard = board.map((row) => [...row]);
    tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
    tempBoard[fromRow][fromCol] = null;

    return !isKingInCheck(tempBoard, turn);
  }

  const board = fenToBoard(fen);
  const moves = {};

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];

      if (piece !== null) {
        const key = `${piece}${i}${j}`;
        moves[key] = getPossibleMoves(board, piece, i, j, fen.split(" ")[1]);
      }
    }
  }

  return moves;
}

// Example usage:
// const fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const fenString = "1k2q3/8/8/8/8/8/3R4/4K3 w - - 0 1";
const result = getChessMoves(fenString);
console.log(result);
