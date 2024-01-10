import UniversalRouter from 'universal-router';

import { authRoute } from 'auth/auth.route';
import { appContainer } from './constants/router.constant';
import { rootRoute } from '../root.route';
import { IRoute } from './interfaces/router.interface';
import { NavigationMode } from './enums/route.enum';

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
  mode: NavigationMode = NavigationMode.PUSH
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

  if (mode === NavigationMode.REPLACE) window.history.replaceState({}, '', url);
  else if (mode === NavigationMode.PUSH) window.history.pushState({}, '', url);
  // else if (mode === NavigationMode.POP) window.history.back();
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

    handleNavigation(href, NavigationMode.PUSH);
  });
}

export function interceptLinkClicks(dom: Document | Element) {
  const links = dom.querySelectorAll<HTMLAnchorElement>('a');
  links.forEach(interceptLinkClick);
}

export function initialize() {
  // Intercept all link clicks.
  // const links = document.querySelectorAll<HTMLAnchorElement>('a');
  // links.forEach(interceptLinkClick);
  interceptLinkClicks(document);

  window.addEventListener('popstate', () => {
    handleNavigation(window.location.pathname, NavigationMode.POP);
  });

  return handleNavigation(window.location.pathname);
}
