# Chess Game

This is a Chess game implemented in JavaScript.

## Project Structure

The project has the following structure:

    .
    ├── public/ 
    │   ├── audios/                                     # Audio files
    │   └── images/                                     # Image files
    ├── src/ 
    │   ├── sass/ 
    │   │   ├── abstracts/ 
    │   │   │   ├── _mixins.scss 
    │   │   │   └── _variables.scss 
    │   │   ├── base/ 
    │   │   │   ├── _base.scss 
    │   │   │   └── _reset.scss 
    │   │   ├── components/ 
    │   │   │   ├── _chessBoard.scss 
    │   │   │   └── _main.scss 
    │   │   ├── layout/ 
    │   │   │    └──_container.scss 
    │   │   └── app.scss 
    │   ├── scripts/ 
    │   │   ├── constants/ 
    │   │   │   ├── constants.js 
    │   │   │   └── gameState.constant.js 
    │   │   ├── entities/ 
    │   │   │   ├── components/ 
    │   │   │   │   ├── pieces/
    │   │   │   │   │   ├── helpers/
    │   │   │   │   │   │   ├── specialMoves/
    │   │   │   │   │   │   │   ├── castling.helper.js
    │   │   │   │   │   │   │   ├── enPassant.helper.js
    │   │   │   │   │   │   │   └── pawnPromotion.helper.js
    │   │   │   │   │   │   ├── common.helper.js
    │   │   │   │   │   │   └── kingInCheck.helper.js
    │   │   │   │   │   ├── Bishop.js
    │   │   │   │   │   ├── King.js
    │   │   │   │   │   ├── Knight.js
    │   │   │   │   │   ├── Pawn.js
    │   │   │   │   │   ├── Queen.js
    │   │   │   │   │   └── Rook.js
    │   │   │   │   ├── Board.js
    │   │   │   │   └── Square.js
    │   │   │   ├── AudioPlayer.js 
    │   │   │   ├── GameControl.js 
    │   │   │   ├── GameState.js 
    │   │   │   ├── Player.js 
    │   │   │   ├── Store.js 
    │   │   │   ├── Timer.js 
    │   │   │   └── UIControl.js 
    │   │   ├── ai.js                                               # AI related logics
    │   │   ├── app.js                                              # Entry point
    │   │   ├── message.js 
    │   │   ├── parseFEN.js 
    ├── └── └── utils.js
    ├── index.html 
    ├── package.json 
    └── REFERENCES.md 


## Installation

To install the dependencies, run:

```sh
npm install
```

## Running the Game

To start the game, you need to run the following command in your terminal:

```sh
npm run dev
```

This command starts the development server. Once the server is running, you can open your browser and navigate to the URL that the server is running on (usually http://localhost:5173 or similar). The game should load in your browser.

## Game Controls
The game can be controlled by either clicking on the piece you want to move, and then clicking on the square you want to move it to or dragging the piece to the square you want to move it to.

## AI
The game includes an AI opponent implemented in ai.js.

## Styles
The styles for the game are written in SCSS and located in the sass directory
