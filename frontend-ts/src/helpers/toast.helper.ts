import { TOAST_DEFAULT_DURATION } from 'constants/toast.constant';
import { debounce } from './debounce.helper';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

let toastContainer: HTMLDivElement | null = null;

const debouncedRemoveToastContainer = debounce(() => {
  toastContainer?.remove();
  toastContainer = null;
}, TOAST_DEFAULT_DURATION);

export function displayToast(
  message: string,
  type: ToastType = ToastType.SUCCESS,
  duration: number = TOAST_DEFAULT_DURATION
) {
  if (!toastContainer) toastContainer = document.createElement('div');

  toastContainer.classList.add('toast');

  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.classList.add(`alert-${type}`);

  const span = document.createElement('span');
  span.innerText = message;

  alert.appendChild(span);
  toastContainer.appendChild(alert);
  document.body.appendChild(toastContainer);

  setTimeout(() => {
    alert.remove();
  }, duration);

  debouncedRemoveToastContainer();
}
