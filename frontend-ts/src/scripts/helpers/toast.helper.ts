import { TOAST_DEFAULT_DURATION } from 'scripts/constants/toast.constant';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export function displayToast(
  message: string,
  type: ToastType = ToastType.SUCCESS,
  duration: number = TOAST_DEFAULT_DURATION
) {
  const toast = document.createElement('div');
  toast.classList.add('toast');

  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.classList.add(`alert-${type}`);

  const span = document.createElement('span');
  span.innerText = message;

  alert.appendChild(span);
  toast.appendChild(alert);
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, duration);
}
