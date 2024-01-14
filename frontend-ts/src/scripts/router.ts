import UniversalRouter from 'universal-router';

import { authRoute } from 'pages/auth/auth.route';
import { appContainer } from 'constants/router.constant';
import { homeRoute } from '../pages/home/home.route';
import { IRoute } from 'interfaces/router.interface';
import { NavigationMode } from 'enums/route.enum';
import { renderNavComponent } from 'components/navbar/navbar.component';
import {
  checkIfAuthenticated,
  getIsLoggedIn,
  redirectToLogin,
} from 'helpers/auth.helper';
import { notFoundRoute } from 'pages/notfound/notfound.route';
import { offlineRoute } from 'pages/offline/offline.route';
import { profileRoute } from 'pages/profile/profile.route';
import { messagesRoute } from 'pages/messages/messages.route';
import { gameQueueRoute } from 'pages/gameQueue/gameQueue.route';
import { gamesRoute } from 'pages/games/games.route';

const routes: IRoute[] = [
  homeRoute,
  authRoute,
  profileRoute,
  messagesRoute,
  gameQueueRoute,
  gamesRoute,
  offlineRoute,
  notFoundRoute,
];

const router = new UniversalRouter([
  {
    path: '/',
    async action({ authContext }) {
      renderNavComponent(authContext);
    },
    children: routes,
  },
]);

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

  const authContext = await checkIfAuthenticated();
  const content = await router.resolve({ pathname: url, authContext });
  if (!content) return;

  const { component, loadScripts, afterInitialize, authRequired } = content;

  const isLoggedIn = getIsLoggedIn();
  // console.log(
  //   'Auth required',
  //   authRequired,
  //   isLoggedIn,
  //   authRequired && !isLoggedIn,
  //   authRequired ?? (!authRequired && isLoggedIn),
  //   !authRequired && isLoggedIn
  // );
  if (authRequired && !isLoggedIn) return redirectToLogin();
  // if (authRequired ?? (!authRequired && isLoggedIn))
  //   return handleNavigation('/', NavigationMode.REPLACE);
  if (authRequired === false && isLoggedIn)
    return handleNavigation('/', NavigationMode.REPLACE);

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
  interceptLinkClicks(document);

  window.addEventListener('popstate', () => {
    handleNavigation(window.location.pathname, NavigationMode.POP);
  });

  return handleNavigation(window.location.pathname);
}
