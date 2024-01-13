import { HttpStatusCode } from 'enums/http.enum';

export const component = `
<main class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
  <div class="text-center">
    <p class="text-base font-semibold">${HttpStatusCode.NOT_FOUND}</p>
    <h1 class="mt-4 text-3xl font-bold tracking-tightsm:text-5xl">Page not found</h1>
    <p class="mt-6 text-base leading-7">Sorry, we couldn’t find the page you’re looking for.</p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a id="goBackBtn" href="#" class="btn btn-primary">Go back home</a>
    </div>
  </div>
</main>
`;

export const afterInitialize = () => {
  const goBackBtn = document.getElementById('goBackBtn');
  if (!goBackBtn) return;

  goBackBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.history.back();
  });
};
