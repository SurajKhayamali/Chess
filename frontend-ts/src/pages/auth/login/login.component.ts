import { AUTH_MESSAGES } from 'constants/message.constant';
import { NavigationMode } from 'enums/route.enum';
import { clearErrorsOnChange, validateForm } from 'helpers/form.helper';
import { ToastType, displayToast } from 'helpers/toast.helper';
import { loginSchema } from 'schemas/auth.schema';
import { handleNavigation } from 'scripts/router';
import { handleLogin } from 'services/auth.service';

export const component = /*html*/ `
    <div class="container w-screen h-screen flex justify-center items-center">
        <div class="p-12 rounded-lg">
            <h1 class="text-3xl font-bold mb-8">Log in</h1>
            <form class="grid grid-cols-1 gap-6">
                <label class="block">
                    <span>Email or username</span>
                    <input type="text" class="input input-bordered w-full max-w-xs" name="emailOrUsername"
                        placeholder="john@example.com" />
                    <p class="text text-error max-w-xs"></p>
                </label>
                <label class="block">
                    <span>Password*</span>
                    <input type="password" class="input input-bordered w-full max-w-xs" name="password"
                        placeholder="Enter your password" autocomplete="on" />
                    <p class="text text-error max-w-xs"></p>
                </label>

                <div class="mt-2">
                    <div>
                        <label class="inline-flex items-center">
                            <input type="checkbox" class="checkbox" name="agree" />
                            <span class="ml-2 label cursor-pointer">Keep me logged in</span>
                        </label>
                    </div>
                </div>

                <button class="btn btn-primary w-full">
                    Log in
                </button>
            </form>

            <div class="flex justify-between mt-4">
                <a href="/auth/register/">
                    Don't have an account? <span class="text-primary underline">Register</span>
                </a>
                <!-- <a href="/password/reset">Password reset</a> -->
            </div>
        </div>
    </div>
`;

export const afterInitialize = () => {
  const loginForm = document.querySelector('form')!;
  clearErrorsOnChange(loginForm);

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailOrUsername = loginForm.emailOrUsername.value;
    const password = loginForm.password.value;
    // const rememberMe = loginForm.rememberMe.checked;

    const isValid = validateForm(loginForm, loginSchema);
    if (!isValid) return;

    try {
      await handleLogin({ emailOrUsername, password });
      displayToast(AUTH_MESSAGES.LOG_IN_SUCCESS, ToastType.SUCCESS);

      handleNavigation('/', NavigationMode.REPLACE);
    } catch (error) {
      if (error instanceof Error)
        displayToast(
          error.message || AUTH_MESSAGES.LOG_IN_FAILURE,
          ToastType.ERROR
        );
    }
  });
};
