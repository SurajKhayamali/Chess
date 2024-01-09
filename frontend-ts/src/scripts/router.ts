import UniversalRouter from 'universal-router';

import { authRoute } from 'auth/auth.route';
import { appContainer } from './constants/router.constant';
import { rootRoute } from '../root.route';
import { IRoute } from './interfaces/router.interface';

const routes: IRoute[] = [rootRoute, authRoute];

const router = new UniversalRouter(routes);

/**
 * Returns the content to rendered for the given URL.
 *
 * @param url The URL to render at.
 */
export function getRenderContent(url: string) {
  //   router.resolve(url).then((html) => {
  //     // app.innerHTML = html;
  //     // window.history.pushState({}, '', url);
  //   });

  return router.resolve(url);
}

/**
 * Intercepts link click and handle them manually.
 *
 * @param link The link to intercept.
 */
export function interceptLinkClick(link: HTMLAnchorElement) {
  link.addEventListener('click', async (event) => {
    event.preventDefault();
    const href = link.getAttribute('href');

    if (!href) return;
    if (href === window.location.pathname) return;

    const content = await getRenderContent(href);
    if (!content) return;

    const { component, loadScripts } = content;
    appContainer.innerHTML = component;
    loadScripts && appContainer.appendChild(loadScripts());
    window.history.pushState({}, '', href);
  });
}

getRenderContent(window.location.pathname).then((content) => {
  if (!content) return;

  const { component, loadScripts } = content;
  appContainer.innerHTML = component;
  loadScripts && appContainer.appendChild(loadScripts());
  // window.history.pushState({}, '', url);
});

// Intercept all link clicks.
const links = document.querySelectorAll<HTMLAnchorElement>('a');
links.forEach(interceptLinkClick);
