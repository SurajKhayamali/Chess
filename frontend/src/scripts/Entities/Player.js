export class Player {
  constructor(isWhite) {
    this.isWhite = isWhite;
    this.pieces = [];
    this.initializePieces();
  }

  initializePieces() {
    let rankIndex = this.isWhite ? 0 : 7;
    let pawnRankIndex = this.isWhite ? 1 : 6;
    this.pieces.push(new Rook(this.isWhite, 0, rankIndex));
    this.pieces.push(new Knight(this.isWhite, 1, rankIndex));
    this.pieces.push(new Bishop(this.isWhite, 2, rankIndex));
    this.pieces.push(new Queen(this.isWhite, 3, rankIndex));
    this.pieces.push(new King(this.isWhite, 4, rankIndex));
    this.pieces.push(new Bishop(this.isWhite, 5, rankIndex));
    this.pieces.push(new Knight(this.isWhite, 6, rankIndex));
    this.pieces.push(new Rook(this.isWhite, 7, rankIndex));
    for (let i = 0; i < 8; i++) {
      this.pieces.push(new Pawn(this.isWhite, i, pawnRankIndex));
    }
  }
}
