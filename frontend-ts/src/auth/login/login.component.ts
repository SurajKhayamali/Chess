import { NavigationMode } from 'scripts/enums/route.enum';
import { setIsLoggedIn } from 'scripts/helpers/auth.helper';
import { createScriptTag } from 'scripts/helpers/createScriptTag.helper';
import { fetchHelper } from 'scripts/helpers/fetch.helper';
import { handleNavigation } from 'scripts/router';

export const component = `
    <div class="container w-screen h-screen flex justify-center items-center">
        <div class="p-12 rounded-lg">
            <h1 class="text-3xl font-bold mb-8">Log in</h1>
            <form class="grid grid-cols-1 gap-6">
                <label class="block">
                    <span>Email or username</span>
                    <input type="text" class="input input-bordered w-full max-w-xs" name="emailOrUsername"
                        placeholder="john@example.com" required />
                </label>
                <label class="block">
                    <span>Password*</span>
                    <input type="password" class="input input-bordered w-full max-w-xs" name="password"
                        placeholder="Enter your password" autocomplete="on" required />
                </label>

                <div class="mt-2">
                    <div>
                        <label class="inline-flex items-center">
                            <input type="checkbox" class="checkbox" name="agree" required />
                            <span class="ml-2 label cursor-pointer">Keep me logged in</span>
                        </label>
                    </div>
                </div>

                <button class="btn btn-primary w-full">
                    Log in
                </button>
            </form>

            <div class="flex justify-between">
                <a href="/auth/register/">Register</a>
                <!-- <a href="/password/reset">Password reset</a> -->
            </div>
        </div>
    </div>
`;

export const loadScripts = () => {
  return createScriptTag('/auth/login/script.ts', 'module');
};

export const afterInitialize = () => {
  const loginForm = document.querySelector('form')!;
  console.log('loginForm', loginForm);

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailOrUsername = loginForm.emailOrUsername.value;
    const password = loginForm.password.value;
    // const rememberMe = loginForm.rememberMe.checked;

    const result = await fetchHelper('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrUsername, password }),
    });
    console.log(result);
    setIsLoggedIn(true);

    handleNavigation('/', NavigationMode.REPLACE);
  });
};
