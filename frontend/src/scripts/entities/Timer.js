export class Timer {
  constructor(timerHtml, timeInSeconds = 10 * 60) {
    this.initialTime = timeInSeconds;
    this.time = timeInSeconds;
    this.timerInterval = null;
    this.timerHtml = timerHtml;
  }

  /**
   * Starts the timer.
   */
  start() {
    if (this.timerInterval) return;

    this.timerInterval = setInterval(() => {
      this.time--;
      this.render();
    }, 1000);
  }

  /**
   * Stops the timer.
   */
  stop() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  /**
   * Resets the timer.
   */
  reset() {
    this.time = this.initialTime;
    this.stop();

    this.render();
  }

  /**
   * Renders the timer.
   */
  render() {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;

    this.timerHtml.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}
