import {
  clearErrorsOnAllInputs,
  clearErrorsOnChange,
  extractDataFromForm,
  validateForm,
} from 'helpers/form.helper';
import { ToastType, displayToast } from 'helpers/toast.helper';
import { User } from 'interfaces/user.interface';
import { changePasswordSchema } from 'schemas/auth.schema';
import { changePassword } from 'services/auth.service';
import { getUserInfo, updateUserInfo } from 'services/user.service';

export const component = /* html */ `
<div class="container mx-auto flex flex-col gap-8">
  <h1 class="text-3xl font-bold">User settings</h1>

  <form id="generalInfoForm" class="bg-neutral p-8 rounded-lg">
    <fieldset disabled id="generalInfoFieldset" class="p-0">
      <h2 class="text-xl font-bold mb-4">General Information</h2>

      <div class="form-control">
        <label for="firstName" class="label">First Name</label>
        <input type="text" name="firstName" id="firstName" placeholder="First Name" class="input input-bordered" />
      </div>

      <div class="form-control">
        <label for="middleName" class="label">Middle Name</label>
        <input type="text" name="middleName" id="middleName" placeholder="Middle Name" class="input input-bordered" />
      </div>

      <div class="form-control">
        <label for="lastName" class="label">Last Name</label>
        <input type="text" name="lastName" id="lastName" placeholder="Last Name" class="input input-bordered" />
      </div>

      <div class="form-control">
        <label for="email" class="label">Email</label>
        <input type="email" name="email" id="email" placeholder="Email" class="input input-bordered" />
      </div>

      <div class="form-control">
        <label for="username" class="label">Username</label>
        <input type="text" name="username" id="username" placeholder="Username" class="input input-bordered" />
      </div>
    </fieldset>

    <button id="editInfoBtn" class="btn btn-primary btn-sm mt-4">Edit</button>
    <button type="submit" id="updateInfoBtn" class="btn btn-primary btn-sm mt-4 hidden">Update</button>
    <button id="cancelEditInfoBtn" class="btn btn-secondary btn-sm mt-4 hidden">Cancel</button>
  </form>

  <form id="passwordForm" class="bg-neutral p-8 rounded-lg">
    <fieldset disabled id="passwordFieldset" class="p-0">
      <h2 class="text-xl font-bold mb-4">Change Password</h2>

      <div class="form-control hidden">
        <label for="username" class="label">Username</label>
        <input type="text" placeholder="Username" class="input input-bordered" autocomplete="username" />
      </div>

      <div class="form-control">
        <label for="oldPassword" class="label">Old Password</label>
        <div class="join">
          <input type="password" name="oldPassword" id="oldPassword" placeholder="Old Password" class="input input-bordered join-item w-full" autocomplete="current-password" />
          <button id="oldPasswordVissiblityToogleBtn" class="btn join-item rounded-r-full"><i class="fa-solid fa-eye"></i></button>
        </div>
        <p id="oldPasswordErrMsg" class="text text-error"></p>
      </div>

      <div class="form-control">
        <label for="newPassword" class="label">New Password</label>
        <div class="join">
          <input type="password" name="newPassword" id="newPassword" placeholder="New Password" class="input input-bordered join-item w-full" autocomplete="new-password" />
          <button id="newPasswordVissiblityToogleBtn" class="btn join-item rounded-r-full"><i class="fa-solid fa-eye"></i></button>
        </div>
        <p id="newPasswordErrMsg" class="text text-error"></p>
      </div>

      <div class="form-control">
        <label for="confirmPassword" class="label">Confirm Password</label>
        <div class="join">
          <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" class="input input-bordered join-item w-full" autocomplete="new-password" />
          <button id="confirmPasswordVissiblityToogleBtn" class="btn join-item rounded-r-full"><i class="fa-solid fa-eye"></i></button>
        </div>
        <p id="confirmPasswordErrMsg" class="text text-error"></p>
      </div>
    </fieldset>
    
    <button id="editPasswordBtn" class="btn btn-primary btn-sm mt-4">Edit</button>
    <button type="submit" id="updatePasswordBtn" class="btn btn-primary btn-sm mt-4 hidden">Update</button>
    <button id="cancelEditPasswordBtn" class="btn btn-secondary btn-sm mt-4 hidden">Cancel</button>
  </form>
</div>
`;

const tooglePassordVisibility = (
  input: HTMLInputElement,
  btn: HTMLButtonElement
) => {
  if (input.getAttribute('type') === 'password') {
    input.setAttribute('type', 'text');
    btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  } else {
    input.setAttribute('type', 'password');
    btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
  }
};

const tooglePasswordVisibilityByIds = (inputId: string, btnId: string) => {
  const input = document.getElementById(inputId) as HTMLInputElement;
  const btn = document.getElementById(btnId) as HTMLButtonElement;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    tooglePassordVisibility(input, btn);
  });
};

const resetGneralInfoFormWithInitialValues = async (
  generalInfoForm: HTMLFormElement,
  userInfo?: User
) => {
  generalInfoForm.reset();

  if (!userInfo) userInfo = await getUserInfo();

  for (const key in userInfo) {
    const input = document.getElementById(key) as HTMLInputElement;
    if (input) {
      input.value = userInfo[key as keyof User] as string;
    }
  }
};

const initializeGeneralInfoForm = async () => {
  // General info form
  const generalInfoForm = document.getElementById(
    'generalInfoForm'
  ) as HTMLFormElement;
  const generalInfoFieldset = document.getElementById(
    'generalInfoFieldset'
  ) as HTMLFieldSetElement;
  const editInfoBtn = document.getElementById(
    'editInfoBtn'
  ) as HTMLButtonElement;
  const updateInfoBtn = document.getElementById(
    'updateInfoBtn'
  ) as HTMLButtonElement;
  const cancelEditInfoBtn = document.getElementById(
    'cancelEditInfoBtn'
  ) as HTMLButtonElement;

  // Add event listeners
  editInfoBtn.addEventListener('click', (e) => {
    e.preventDefault();

    generalInfoFieldset.removeAttribute('disabled');
    editInfoBtn.classList.add('hidden');
    updateInfoBtn.classList.remove('hidden');
    cancelEditInfoBtn.classList.remove('hidden');
  });
  cancelEditInfoBtn.addEventListener('click', (e) => {
    e.preventDefault();

    resetGneralInfoFormWithInitialValues(generalInfoForm);

    generalInfoFieldset.setAttribute('disabled', '');
    editInfoBtn.classList.remove('hidden');
    updateInfoBtn.classList.add('hidden');
    cancelEditInfoBtn.classList.add('hidden');
  });
  updateInfoBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const payload = extractDataFromForm(generalInfoForm);

    const result = await updateUserInfo(payload);

    displayToast('User info updated successfully', ToastType.SUCCESS);

    resetGneralInfoFormWithInitialValues(generalInfoForm, result);

    generalInfoFieldset.setAttribute('disabled', '');
    editInfoBtn.classList.remove('hidden');
    updateInfoBtn.classList.add('hidden');
    cancelEditInfoBtn.classList.add('hidden');
  });

  resetGneralInfoFormWithInitialValues(generalInfoForm);
};

const initializePasswordForm = () => {
  // Password form
  const passwordForm = document.getElementById(
    'passwordForm'
  ) as HTMLFormElement;
  const passwordFieldset = document.getElementById(
    'passwordFieldset'
  ) as HTMLFieldSetElement;
  const editPasswordBtn = document.getElementById(
    'editPasswordBtn'
  ) as HTMLButtonElement;
  const updatePasswordBtn = document.getElementById(
    'updatePasswordBtn'
  ) as HTMLButtonElement;
  const cancelEditPasswordBtn = document.getElementById(
    'cancelEditPasswordBtn'
  ) as HTMLButtonElement;

  const oldPassword = document.getElementById(
    'oldPassword'
  ) as HTMLInputElement;
  const newPassword = document.getElementById(
    'newPassword'
  ) as HTMLInputElement;

  // Add event listeners
  clearErrorsOnChange(passwordForm);

  editPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();

    passwordFieldset.removeAttribute('disabled');
    editPasswordBtn.classList.add('hidden');
    updatePasswordBtn.classList.remove('hidden');
    cancelEditPasswordBtn.classList.remove('hidden');
  });

  cancelEditPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();

    passwordForm.reset();

    clearErrorsOnAllInputs(passwordForm);

    passwordFieldset.setAttribute('disabled', '');
    editPasswordBtn.classList.remove('hidden');
    updatePasswordBtn.classList.add('hidden');
    cancelEditPasswordBtn.classList.add('hidden');
  });

  updatePasswordBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const isValid = validateForm(passwordForm, changePasswordSchema);
    if (!isValid) return;

    await changePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });

    displayToast('Password updated successfully', ToastType.SUCCESS);

    passwordForm.reset();

    passwordFieldset.setAttribute('disabled', '');
    editPasswordBtn.classList.remove('hidden');
    updatePasswordBtn.classList.add('hidden');
    cancelEditPasswordBtn.classList.add('hidden');
  });
};

export const afterInitialize = () => {
  tooglePasswordVisibilityByIds(
    'oldPassword',
    'oldPasswordVissiblityToogleBtn'
  );
  tooglePasswordVisibilityByIds(
    'newPassword',
    'newPasswordVissiblityToogleBtn'
  );
  tooglePasswordVisibilityByIds(
    'confirmPassword',
    'confirmPasswordVissiblityToogleBtn'
  );

  initializeGeneralInfoForm();
  initializePasswordForm();
};
