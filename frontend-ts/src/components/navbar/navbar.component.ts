import { navbarContainer } from 'scripts/constants/router.constant';
import { NavbarContext } from './navbar.interface';
import { interceptLinkClicks } from 'scripts/router';

export const renderNavComponent = (context: NavbarContext) => {
  const { isLoggedIn, userInfo } = context;
  navbarContainer.innerHTML = `
<nav class="navbar">
<div class="flex-1">
    <a href="/" class="btn btn-ghost text-xl">Chess</a>
</div>
${
  isLoggedIn
    ? `
<div class="flex-none gap-2">
    <div class="form-control">
        <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
    </div>
    <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component"
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
        </div>
        <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content rounded-box w-52">
            <li>
                <a class="justify-between">
                Profile ${userInfo?.username}
                <span class="badge">New</span>
                </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
        </ul>
    </div>
</div>
`
    : `
<div class="navbar-end">
    <a href="/auth/login/" class="btn btn-ghost">Login</a>
    <a href="/auth/register/" class="btn btn-ghost">Register</a>
</div>
`
}
</nav>
`;

  interceptLinkClicks(navbarContainer);
};
