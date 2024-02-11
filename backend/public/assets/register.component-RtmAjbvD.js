import{j as p,A as t,T as l,d as r,N as i,h as c}from"./index-iXdiA8If.js";import{c as m,v as d,s as x}from"./auth.schema-d68LrvZQ.js";const w=`
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
                            <input type="checkbox" class="checkbox" name="agree" />
                            <span class="ml-2 label cursor-pointer">I agree to the terms and privacy.</span>
                        </label>
                        <p class="text text-error max-w-xs"></p>
                    </div>
                </div>

                <button class="btn btn-primary w-full">
                    Register
                </button>
            </form>
        </div>
    </div>
`,E=()=>{const e=document.querySelector("form");m(e),e.addEventListener("submit",async n=>{n.preventDefault();const o=new FormData(e),a=Object.fromEntries(o.entries());if(d(e,x)){a.middleName||delete a.middleName,delete a.agree;try{await p(a),r(t.REGISTER_SUCCESS,l.SUCCESS),c("/",i.REPLACE)}catch(s){s instanceof Error&&r(s.message||t.REGISTER_FAILURE,l.ERROR)}}})};export{E as afterInitialize,w as component};
