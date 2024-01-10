/**
 * Debounce function
 * @description used to delay the execution of a function until after a certain amount of time has passed since the last time it was invoked.
 *
 * @param func - Function to be debounced
 * @param delay - Delay in milliseconds
 */
export function debounce(func: () => void, delay: number) {
  let timeoutId: NodeJS.Timeout;

  return function (...args: []) {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
