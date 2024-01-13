import { UpdateUserDto, User } from 'interfaces/user.interface';
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
      <h2 class="text-xl font-bold mt-4">Password Information</h2>

      <div class="form-control">
        <label for="oldPassword" class="label">Old Password</label>
        <div class="join">
          <input type="password" name="oldPassword" id="oldPassword" placeholder="Old Password" class="input input-bordered join-item w-full" />
          <button id="oldPasswordVissiblityToogleBtn" class="btn join-item rounded-r-full"><i class="fa-solid fa-eye"></i></button>
        </div>
      </div>

      <div class="form-control">
        <label for="newPassword" class="label">New Password</label>
        <div class="join">
          <input type="password" name="newPassword" id="newPassword" placeholder="New Password" class="input input-bordered join-item w-full" />
          <button id="newPasswordVissiblityToogleBtn" class="btn join-item rounded-r-full"><i class="fa-solid fa-eye"></i></button>
        </div>
      </div>

      <div class="form-control">
        <label for="confirmPassword" class="label">Confirm Password</label>
        <div class="join">
          <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" class="input input-bordered join-item w-full" />
          <button id="confirmPasswordVissiblityToogleBtn" class="btn join-item rounded-r-full"><i class="fa-solid fa-eye"></i></button>
        </div>
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

    const formData = new FormData(generalInfoForm);
    const payload: UpdateUserDto = {};

    for (const [key, value] of formData.entries()) {
      if (value) payload[key as keyof UpdateUserDto] = value as string;
    }

    const result = await updateUserInfo(payload);

    resetGneralInfoFormWithInitialValues(generalInfoForm, result);

    generalInfoFieldset.setAttribute('disabled', '');
    editInfoBtn.classList.remove('hidden');
    updateInfoBtn.classList.add('hidden');
    cancelEditInfoBtn.classList.add('hidden');
  });

  // Load user info
  // const userInfo = await getUserInfo();
  // console.log('userInfo', userInfo);

  // Populate user info
  // for (const key in userInfo) {
  //   const input = document.getElementById(key) as HTMLInputElement;
  //   if (input) {
  //     input.value = userInfo[key as keyof User] as string;
  //   }
  // }
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

    passwordFieldset.setAttribute('disabled', '');
    editPasswordBtn.classList.remove('hidden');
    updatePasswordBtn.classList.add('hidden');
    cancelEditPasswordBtn.classList.add('hidden');
  });
};

export const afterInitialize = () => {
  // const oldPasswordInput = document.getElementById(
  //   'oldPassword'
  // ) as HTMLInputElement;
  // const oldPasswordVissiblityToogleBtn = document.getElementById(
  //   'oldPasswordVissiblityToogleBtn'
  // ) as HTMLButtonElement;
  // oldPasswordVissiblityToogleBtn.addEventListener('click', (e) => {
  //   e.preventDefault();

  //   tooglePassordVisibility(oldPasswordInput, oldPasswordVissiblityToogleBtn);
  // });

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
