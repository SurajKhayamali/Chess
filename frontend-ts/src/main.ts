import { interceptLinkClick, render } from './helpers/render.helper';

import './style.css';

// Render the initial URL.
render(window.location.pathname);

// Intercept all link clicks.
const links = document.querySelectorAll<HTMLAnchorElement>('a');
links.forEach(interceptLinkClick);
