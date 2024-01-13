import { AnyObjectSchema, ValidationError } from 'yup';

export function extractDataFromForm(generalInfoForm: HTMLFormElement) {
  const formData = new FormData(generalInfoForm);
  const payload: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (value) payload[key as string] = value as string;
  }

  return payload;
}

export function validateForm(form: HTMLFormElement, schema: AnyObjectSchema) {
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

      for (const [key, value] of Object.entries(errors)) {
        if (!value) continue;
        const input = form.querySelector(`[name="${key}"]`)!;
        if (!input) continue;

        input.classList.add('input-error');

        let errorMessage = input.parentElement?.querySelector(
          '.text-error'
        ) as HTMLParagraphElement;

        // Search up to 2 levels up, covering the case of using join in profile as well
        if (!errorMessage)
          errorMessage = input.parentElement?.parentElement?.querySelector(
            '.text-error'
          ) as HTMLParagraphElement;

        if (errorMessage) errorMessage.innerText = value;
      }
    }
    return false;
  }
}

export function clearErrorsOnChange(form: HTMLFormElement) {
  const inputs = form.querySelectorAll('input')!;
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('input-error');

      let errorMessage = input.parentElement?.querySelector(
        '.text-error'
      ) as HTMLParagraphElement;

      // Search up to 2 levels up, covering the case of using join in profile as well
      if (!errorMessage)
        errorMessage = input.parentElement?.parentElement?.querySelector(
          '.text-error'
        ) as HTMLParagraphElement;

      if (errorMessage) errorMessage.innerText = '';
    });
  });
}

export function clearErrorsOnAllInputs(form: HTMLFormElement) {
  const inputs = form.querySelectorAll('input')!;
  inputs.forEach((input) => {
    input.classList.remove('input-error');

    let errorMessage = input.parentElement?.querySelector(
      '.text-error'
    ) as HTMLParagraphElement;

    // Search up to 2 levels up, covering the case of using join in profile as well
    if (!errorMessage)
      errorMessage = input.parentElement?.parentElement?.querySelector(
        '.text-error'
      ) as HTMLParagraphElement;

    if (errorMessage) errorMessage.innerText = '';
  });
}
