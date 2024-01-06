import UniversalRouter from 'universal-router';
import { routes } from '../routes';

const app = document.querySelector<HTMLDivElement>('#app')!;
const router = new UniversalRouter(routes);

/**
 * Renders the HTML for the given URL.
 *
 * @param url The URL to render.
 */
export function render(url: string) {
  router.resolve(url).then((html) => {
    app.innerHTML = html;
    window.history.pushState({}, '', url);
  });
}

/**
 * Intercepts link click and handle them manually.
 *
 * @param link The link to intercept.
 */
export function interceptLinkClick(link: HTMLAnchorElement) {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const href = link.getAttribute('href');

    if (!href) return;
    if (href === window.location.pathname) return;

    render(href);
  });
}
