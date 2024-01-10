export class Timer {
  initialTime: number;
  time: number;
  timerInterval?: NodeJS.Timeout;
  timerHtml: HTMLElement;

  constructor(timerHtml: HTMLElement, timeInSeconds = 10 * 60) {
    this.initialTime = timeInSeconds;
    this.time = timeInSeconds;
    this.timerInterval = undefined;
    this.timerHtml = timerHtml;

    this.render();
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
    this.timerInterval = undefined;
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
   * Updates the initial time.
   * Based on the user's input.
   *
   * @param timeInSeconds - The time in seconds.
   */
  updateInitialTime(timeInSeconds: number) {
    this.initialTime = timeInSeconds;
    this.time = timeInSeconds;

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
      .padStart(2, '0')}`;
  }
}
