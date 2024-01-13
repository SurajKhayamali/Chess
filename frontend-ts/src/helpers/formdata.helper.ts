export function extractDataFromForm(generalInfoForm: HTMLFormElement) {
  const formData = new FormData(generalInfoForm);
  const payload: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (value) payload[key as string] = value as string;
  }

  return payload;
}
