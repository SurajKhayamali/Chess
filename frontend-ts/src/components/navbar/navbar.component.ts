import { navbarContainer } from 'constants/router.constant';
import { NavbarContext } from './navbar.interface';
import { interceptLinkClicks } from 'scripts/router';
import { handleLogout } from 'services/auth.service';
import { ToastType, displayToast } from 'helpers/toast.helper';
import { AUTH_MESSAGES } from 'constants/message.constant';

export function renderNavComponent(context: NavbarContext) {
  const { isLoggedIn, userInfo } = context;
  navbarContainer.innerHTML = `
<nav class="navbar">
<div class="flex-1">
    <a href="/" class="btn btn-ghost text-xl">Chess</a>
</div>
${
  isLoggedIn
    ? `
    <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li>
        <details>
          <summary>
            ${userInfo?.username}
          </summary>
          <ul class="p-2 bg-base-100 rounded-t-none">
            <li><a href="/profile">Profile</a></li>
            <li><a id="logoutBtn">Logout</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
`
    : `
<div class="navbar-end">
    <a href="/auth/login/" class="btn btn-ghost">Login</a>
    <a href="/auth/register/" class="btn btn-ghost">Register</a>
</div>
`
}
<a href="/offline" class="btn btn-ghost">Play offline</a>
</nav>
`;

  interceptLinkClicks(navbarContainer);

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await handleLogout();
      displayToast(AUTH_MESSAGES.LOG_OUT_SUCCESS, ToastType.SUCCESS);

      renderNavComponent({
        isLoggedIn: false,
      });
    });
  }
}
