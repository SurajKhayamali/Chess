import { AUTH_MESSAGES } from 'constants/message.constant';
import { NavigationMode } from 'enums/route.enum';
import { createScriptTag } from 'helpers/createScriptTag.helper';
import { ToastType, displayToast } from 'helpers/toast.helper';
import { SignupDto } from 'interfaces/auth.interface';
import { signupSchema } from 'schemas/auth.schema';
import { handleNavigation } from 'scripts/router';
import { handleRegister } from 'services/auth.service';
import { AnyObjectSchema, ValidationError } from 'yup';

export const component = /* html */ `
    <div class="container w-full h-full flex justify-center items-center">
        <div class="p-12 rounded-lg">
            <h1 class="text-3xl font-bold mb-8">Register</h1>
            <form class="grid grid-cols-1 gap-6">
                <label class="block">
                    <span>First name*</span>
                    <input type="text" class="input input-bordered w-full max-w-xs" name="firstName"
                        placeholder="Enter your first name" />
                    <p class="text text-error max-w-xs"></p>
                </label>
                <label class="block">
                    <span>Middle name</span>
                    <input type="text" class="input input-bordered w-full max-w-xs" name="middleName"
                        placeholder="Enter your middle name" />
                    <p class="text text-error max-w-xs"></p>
                </label>
                <label class="block">
                    <span>Last name*</span>
                    <input type="text" class="input input-bordered w-full max-w-xs" name="lastName"
                        placeholder="Enter your last name" />
                    <p class="text text-error max-w-xs"></p>
                </label>
                <label class="block">
                    <span>Email address</span>
                    <input type="email" class="input input-bordered w-full max-w-xs" name="email"
                        placeholder="john@example.com" />
                    <p class="text text-error max-w-xs"></p>
                </label>
                <label class="block">
                    <span>Username*</span>
                    <input type="text" class="input input-bordered w-full max-w-xs" name="username"
                        placeholder="Enter your user name" />
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
                            <input type="checkbox" class="checkbox" name="agree" required />
                            <span class="ml-2 label cursor-pointer">I agree to the terms and privacy.</span>
                        </label>
                    </div>
                </div>

                <button class="btn btn-primary w-full">
                    Register
                </button>
            </form>
        </div>
    </div>
`;

export const loadScripts = () => {
  return createScriptTag('/auth/register/script.ts', 'module');
};

const validateForm = (form: HTMLFormElement, schema: AnyObjectSchema) => {
  const formData = new FormData(form);
  const body = Object.fromEntries(formData.entries());

  try {
    schema.validateSync(body, {
      abortEarly: false,
    });
    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.inner.reduce((acc, curr) => {
        acc[curr.path as string] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      console.log('errors: ', errors);

      for (const [key, value] of Object.entries(errors)) {
        if (!value) continue;
        const input = form.querySelector(`[name="${key}"]`)!;
        if (!input) continue;

        input.classList.add('input-error');

        const errorMessage = input.parentElement?.querySelector(
          '.text-error'
        ) as HTMLParagraphElement;
        if (errorMessage) errorMessage.innerText = value;
      }
    }
    return false;
  }
};

const clearErrorsOnChange = (form: HTMLFormElement) => {
  const inputs = form.querySelectorAll('input')!;
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('input-error');
      const errorMessage = input.parentElement?.querySelector(
        '.text-error'
      ) as HTMLParagraphElement;
      if (errorMessage) errorMessage.innerText = '';
    });
  });
};

export const afterInitialize = () => {
  const form = document.querySelector('form')!;
  clearErrorsOnChange(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const body = Object.fromEntries(formData.entries());
    // console.log('Body: ', body);
    const isValid = validateForm(form, signupSchema);
    // console.log('isValid: ', isValid);
    if (!isValid) return;

    if (!body.middleName) delete body.middleName;
    delete body.agree;

    try {
      await handleRegister(body as SignupDto);
      displayToast(AUTH_MESSAGES.REGISTER_SUCCESS, ToastType.SUCCESS);

      handleNavigation('/', NavigationMode.REPLACE);
    } catch (error) {
      if (error instanceof Error)
        displayToast(
          error.message || AUTH_MESSAGES.REGISTER_FAILURE,
          ToastType.ERROR
        );
    }
  });
};
