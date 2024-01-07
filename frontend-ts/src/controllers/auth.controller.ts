export function renderRegister() {
  return '<h1>Register</h1>';
}

export function renderLogin() {
  const loginForm = document.createElement('form');
  loginForm.setAttribute('id', 'loginForm');
  loginForm.innerHTML = `
    <input name="email" type="email" placeholder="email" />
    <input name="password" type="current-password" placeholder="password" />
    <button type="submit">Login</button>
  `;
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log('loginForm', loginForm);
  });

  return loginForm;
}
