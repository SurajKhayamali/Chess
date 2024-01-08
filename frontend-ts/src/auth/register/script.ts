import { fetchHelper } from 'scripts/helpers/fetch.helper';
import '/styles/css/app.css';

const form = document.querySelector('form')!;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const body = Object.fromEntries(formData.entries());
  // console.log('Body: ', body);

  if (!body.middleName) delete body.middleName;
  delete body.agree;

  const response = await fetchHelper('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  console.log('Response: ', response);
});
