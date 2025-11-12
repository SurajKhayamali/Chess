import{e as b,c as f,a as w,v as y,b as v}from"./auth.schema-Bdf96PwZ.js";import{f as c,a as P,U as m,d as u,T as p,c as h}from"./index-Ckin8rOF.js";async function g(){return await c(m.GET_USER_INFO)}async function E(e){return await c(m.UPDATE_USER_INFO,{method:P.PATCH,body:JSON.stringify(e)})}const U=`
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
`,B=(e,s)=>{e.getAttribute("type")==="password"?(e.setAttribute("type","text"),s.innerHTML='<i class="fa-solid fa-eye-slash"></i>'):(e.setAttribute("type","password"),s.innerHTML='<i class="fa-solid fa-eye"></i>')},i=(e,s)=>{const a=document.getElementById(e),t=document.getElementById(s);t.addEventListener("click",d=>{d.preventDefault(),B(a,t)})},r=async(e,s)=>{e.reset(),s||(s=await g());for(const a in s){const t=document.getElementById(a);t&&(t.value=s[a])}},I=async()=>{const e=document.getElementById("generalInfoForm"),s=document.getElementById("generalInfoFieldset"),a=document.getElementById("editInfoBtn"),t=document.getElementById("updateInfoBtn"),d=document.getElementById("cancelEditInfoBtn");a.addEventListener("click",n=>{n.preventDefault(),s.removeAttribute("disabled"),a.classList.add("hidden"),t.classList.remove("hidden"),d.classList.remove("hidden")}),d.addEventListener("click",n=>{n.preventDefault(),r(e),s.setAttribute("disabled",""),a.classList.remove("hidden"),t.classList.add("hidden"),d.classList.add("hidden")}),t.addEventListener("click",async n=>{n.preventDefault();const l=b(e),o=await E(l);u("User info updated successfully",p.SUCCESS),r(e,o),s.setAttribute("disabled",""),a.classList.remove("hidden"),t.classList.add("hidden"),d.classList.add("hidden")}),r(e)},L=()=>{const e=document.getElementById("passwordForm"),s=document.getElementById("passwordFieldset"),a=document.getElementById("editPasswordBtn"),t=document.getElementById("updatePasswordBtn"),d=document.getElementById("cancelEditPasswordBtn"),n=document.getElementById("oldPassword"),l=document.getElementById("newPassword");f(e),a.addEventListener("click",o=>{o.preventDefault(),s.removeAttribute("disabled"),a.classList.add("hidden"),t.classList.remove("hidden"),d.classList.remove("hidden")}),d.addEventListener("click",o=>{o.preventDefault(),e.reset(),w(e),s.setAttribute("disabled",""),a.classList.remove("hidden"),t.classList.add("hidden"),d.classList.add("hidden")}),t.addEventListener("click",async o=>{o.preventDefault(),y(e,v)&&(await h({oldPassword:n.value,newPassword:l.value}),u("Password updated successfully",p.SUCCESS),e.reset(),s.setAttribute("disabled",""),a.classList.remove("hidden"),t.classList.add("hidden"),d.classList.add("hidden"))})},T=()=>{i("oldPassword","oldPasswordVissiblityToogleBtn"),i("newPassword","newPasswordVissiblityToogleBtn"),i("confirmPassword","confirmPasswordVissiblityToogleBtn"),I(),L()};export{T as afterInitialize,U as component};
