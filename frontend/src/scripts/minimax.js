const board = {
  pieces: [
    {
      type: "rook",
      color: "white",
      position: "a1",
      value: 5,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "rook",
      color: "black",
      position: "a8",
      value: 5,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "knight",
      color: "white",
      position: "b1",
      value: 3,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "knight",
      color: "black",
      position: "b8",
      value: 3,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "bishop",
      color: "white",
      position: "c1",
      value: 3,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "bishop",
      color: "black",
      position: "c8",
      value: 3,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "queen",
      color: "white",
      position: "d1",
      value: 9,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "queen",
      color: "black",
      position: "d8",
      value: 9,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "king",
      color: "white",
      position: "e1",
      value: 100,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "king",
      color: "black",
      position: "e8",
      value: 100,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "bishop",
      color: "white",
      position: "f1",
      value: 3,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "bishop",
      color: "black",
      position: "f8",
      value: 3,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "knight",
      color: "white",
      position: "g1",
      value: 3,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "knight",
      color: "black",
      position: "g8",
      value: 3,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "rook",
      color: "white",
      position: "h1",
      value: 5,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "rook",
      color: "black",
      position: "h8",
      value: 5,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "pawn",
      color: "white",
      position: "a2",
      value: 1,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "pawn",
      color: "white",
      position: "b2",
      value: 1,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "pawn",
      color: "white",
      position: "c2",
      value: 1,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "pawn",
      color: "white",
      position: "d2",
      value: 1,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "pawn",
      color: "white",
      position: "e2",
      value: 1,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "pawn",
      color: "white",
      position: "f2",
      value: 1,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "pawn",
      color: "white",
      position: "g2",
      value: 1,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "pawn",
      color: "white",
      position: "h2",
      value: 1,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
    {
      type: "pawn",
      color: "black",
      position: "a7",
      value: 1,
      getAvailableMoves: () => getAllPossibleMoves(board, this),
    },
  ],
  turn: "white",
  isGameOver: false,
  getPieceAt: function (position) {
    return this.pieces.find((piece) => piece.position === position);
  },
  movePieceTo: function (piece, position) {
    piece.position = position;
  },
  changeTurn: function () {
    this.turn = this.turn === "white" ? "black" : "white";
  },
};

function getPawnMoves(board, piece) {
  const moves = [];
  const directions =
    piece.color === "white" ? [{ row: -1, col: 0 }] : [{ row: 1, col: 0 }];
  const startingRow = piece.color === "white" ? 6 : 1;

  for (const direction of directions) {
    const row = piece.row + direction.row;
    const col = piece.col + direction.col;
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      const pieceAtDestination = board.getPieceAt(row, col);
      if (pieceAtDestination === null) {
        moves.push({ from: piece.position, to: `${row}${col}` });

        if (piece.row === startingRow) {
          const row = piece.row + direction.row * 2;
          const col = piece.col + direction.col * 2;
          const pieceAtDestination = board.getPieceAt(row, col);
          if (pieceAtDestination === null) {
            moves.push({ from: piece.position, to: `${row}${col}` });
          }
        }
      }
    }
  }
  return moves;
}

function getMovesByDirections(board, piece, directions) {
  const moves = [];
  for (const direction of directions) {
    const row = piece.row + direction.row;
    const col = piece.col + direction.col;
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      const pieceAtDestination = board.getPieceAt(row, col);
      if (
        pieceAtDestination === null ||
        pieceAtDestination.color !== piece.color
      ) {
        moves.push({ from: piece.position, to: `${row}${col}` });
      }
    }
  }
  return moves;
}

function getRookMoves(board, piece) {
  const directions = [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
  ];

  return getMovesByDirections(board, piece, directions);
}

function getKnightMoves(board, piece) {
  const directions = [
    { row: 2, col: 1 },
    { row: 2, col: -1 },
    { row: -2, col: 1 },
    { row: -2, col: -1 },
    { row: 1, col: 2 },
  ];

  return getMovesByDirections(board, piece, directions);
}

function getBishopMoves(board, piece) {
  const directions = [
    { row: 1, col: 1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
    { row: -1, col: -1 },
  ];

  return getMovesByDirections(board, piece, directions);
}

function getQueenMoves(board, piece) {
  const directions = [
    { row: 1, col: 1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
    { row: -1, col: -1 },
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
  ];

  return getMovesByDirections(board, piece, directions);
}

function getKingMoves(board, piece) {
  const directions = [
    { row: 1, col: 1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
    { row: -1, col: -1 },
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
  ];

  return getMovesByDirections(board, piece, directions);
}

function getAvailableMoves(board, piece) {
  const moves = [];
  switch (piece.type) {
    case "rook":
      moves.push(...getRookMoves(board, piece));
      break;
    case "knight":
      moves.push(...getKnightMoves(board, piece));
      break;
    case "bishop":
      moves.push(...getBishopMoves(board, piece));
      break;
    case "queen":
      moves.push(...getQueenMoves(board, piece));
      break;
    case "king":
      moves.push(...getKingMoves(board, piece));
      break;
    case "pawn":
      moves.push(...getPawnMoves(board, piece));
      break;
  }
  return moves;
}

function evaluateBoard(board, maximizingColor) {
  let score = 0;
  for (const piece of board.pieces) {
    if (piece.color === maximizingColor) {
      score += piece.value;
    } else {
      score -= piece.value;
    }
  }
  return score;
}

function getAllPossibleMoves(board) {
  const moves = [];
  for (const piece of board.pieces) {
    if (piece.color === board.turn) {
      const pieceMoves = piece.getAvailableMoves(board);
      for (const move of pieceMoves) {
        moves.push(move);
      }
    }
  }
  return moves;
}

function makeMove(board, move) {
  const piece = board.getPieceAt(move.from);
  board.movePieceTo(piece, move.to);
  board.changeTurn();
}

function undoMove(board, move) {
  const piece = board.getPieceAt(move.to);
  board.movePieceTo(piece, move.from);
  board.changeTurn();
}

function minimax(board, depth, alpha, beta, maximizingPlayer, maximizingColor) {
  if (depth === 0 || board.isGameOver) {
    return [null, evaluateBoard(board, maximizingColor)];
  }

  const moves = getAllPossibleMoves(board);
  const bestMove = moves[Math.floor(Math.random() * moves.length)];

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      makeMove(board, move);
      const currentEval = minimax(
        board,
        depth - 1,
        alpha,
        beta,
        false,
        maximizingColor
      )[1];
      undoMove(board, move);
      if (currentEval > maxEval) {
        maxEval = currentEval;
        bestMove = move;
      }
      alpha = Math.max(alpha, currentEval);
      if (beta <= alpha) {
        break;
      }
    }
    return [bestMove, maxEval];
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      makeMove(board, move);
      const currentEval = minimax(
        board,
        depth - 1,
        alpha,
        beta,
        true,
        maximizingColor
      )[1];
      undoMove(board, move);
      if (currentEval < minEval) {
        minEval = currentEval;
        bestMove = move;
      }
      beta = Math.min(beta, currentEval);
      if (beta <= alpha) {
        break;
      }
    }
    return [bestMove, minEval];
  }
}

function getBestMove(board, depth, maximizingColor) {
  return minimax(board, depth, -Infinity, Infinity, true, maximizingColor)[0];
}

console.log(getBestMove(board, 3, "white"));
