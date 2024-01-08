import { fetchHelper } from 'scripts/helpers/fetch.helper';

const loginForm = document.querySelector('#loginForm') as HTMLFormElement;

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

  // const result = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
  //   method: 'POST',
  //   body: JSON.stringify({ emailOrUsername, password, rememberMe }),
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });

  // const data = await result.json();
  // console.log('data', data);
});
