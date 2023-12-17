const MOVE_AUDIOS = [
  "/audios/Move_Piece_1.WAV",
  "/audios/Move_Piece_2.WAV",
  "/audios/Move_Piece_3.WAV",
  "/audios/Move_Piece_4.WAV",
  "/audios/Move_Piece_5.WAV",
  "/audios/Move_Piece_6.WAV",
];

const AUDIOS = {
  CAPTURE: "/audios/Capture.mp3",
  CHECK: "/audios/Check.WAV",
  CHECKMATE: "/audios/Checkmate_Win.WAV",
  CHECKMATE_LOSE: "/audios/Checkmate_Lose.WAV",
  DRAW: "/audios/GenericNotify.mp3",
  ILLEGAL_MOVE: "/audios/Illegal_Move.WAV",
};

export class AudioPlayer {
  constructor() {
    this._audio = new Audio();
    // this._audio.volume = 0.5;
    this._isCurrentlyPlaying = false;
  }

  _play(src) {
    if (this._isCurrentlyPlaying) {
      this._audio.pause();
    }

    this._audio.src = src;
    this._audio.play();
    this._isCurrentlyPlaying = true;

    this._audio.addEventListener("ended", () => {
      this._isCurrentlyPlaying = false;
    });
  }

  playMove() {
    this._play(MOVE_AUDIOS[Math.floor(Math.random() * MOVE_AUDIOS.length)]);
  }

  playCapture() {
    this._play(AUDIOS.CAPTURE);
  }

  playCheck() {
    this._play(AUDIOS.CHECK);
  }

  playCheckmate() {
    this._play(AUDIOS.CHECKMATE);
  }

  playCheckmateLose() {
    this._play(AUDIOS.CHECKMATE_LOSE);
  }

  playDraw() {
    this._play(AUDIOS.DRAW);
  }

  playIllegalMove() {
    this._play(AUDIOS.ILLEGAL_MOVE);
  }
}
