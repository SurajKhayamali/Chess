export enum SquareColor {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum PieceType {
  PAWN = 'Pawn',
  KNIGHT = 'Knight',
  BISHOP = 'Bishop',
  ROOK = 'Rook',
  QUEEN = 'Queen',
  KING = 'King',
}

export enum PieceColor {
  WHITE = 'white',
  BLACK = 'black',
}

export enum PlayerType {
  HUMAN = 'human',
  AI = 'ai',
}

export enum SquareHighlightModifiers {
  SELECTED = 'selected',
  VALID = 'valid',
  CAPTURABLE = 'capturable',
  LAST_MOVE = 'last-move',
  HOVER = 'hover',
}

export enum PieceHighlightModifiers {
  CHECKED = 'checked',
}

export enum GameMode {
  PLAYER_VS_PLAYER = 'PvP',
  PLAYER_VS_COMPUTER = 'PvC',
}
