import UniversalRouter from 'universal-router';

import { authRoute } from 'auth/auth.route';
import { appContainer } from './constants/router.constant';
import { rootRoute } from '../root.route';
import { IRoute } from './interfaces/router.interface';

const routes: IRoute[] = [rootRoute, authRoute];

const router = new UniversalRouter(routes);

/**
 * Handles navigation to a URL.
 *
 * @param url The URL to navigate to.
 * @param mode The navigation mode.
 */
export async function handleNavigation(
  url: string,
  mode: 'push' | 'replace' | 'pop' = 'push'
) {
  // if (url === window.location.pathname) return;

  const content = await router.resolve(url);
  if (!content) return;
  // console.log(url, content);

  const { component, loadScripts, afterInitialize } = content;
  appContainer.innerHTML = component;
  loadScripts && appContainer.appendChild(loadScripts());
  afterInitialize && afterInitialize();

  if (url === window.location.pathname) return;

  if (mode === 'replace') window.history.replaceState({}, '', url);
  else if (mode === 'push') window.history.pushState({}, '', url);
  // else if (mode === 'pop') window.history.back();
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

    handleNavigation(href, 'push');
  });
}

export function initialize() {
  // Intercept all link clicks.
  const links = document.querySelectorAll<HTMLAnchorElement>('a');
  links.forEach(interceptLinkClick);

  window.addEventListener('popstate', () => {
    handleNavigation(window.location.pathname, 'pop');
  });

  return handleNavigation(window.location.pathname);
}
