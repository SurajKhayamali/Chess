import { fetchHelper } from 'scripts/helpers/fetch.helper';
import '/styles/css/app.css';

const loginForm = document.querySelector('form')!;

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailOrUsername = loginForm.emailOrUsername.value;
  const password = loginForm.password.value;
  // const rememberMe = loginForm.rememberMe.checked;

  const result = await fetchHelper('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ emailOrUsername, password }),
  });
  console.log(result);
});
