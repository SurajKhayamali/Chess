import{i,A as s,T as t,d as r,N as c,h as p}from"./index-iXdiA8If.js";import{c as d,v as m,l as u}from"./auth.schema-d68LrvZQ.js";const v=`
    <div class="container w-full h-full flex justify-center items-center">
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
`,g=()=>{const e=document.querySelector("form");d(e),e.addEventListener("submit",async l=>{l.preventDefault();const n=e.emailOrUsername.value,o=e.password.value;if(m(e,u))try{await i({emailOrUsername:n,password:o}),r(s.LOG_IN_SUCCESS,t.SUCCESS),p("/",c.REPLACE)}catch(a){a instanceof Error&&r(a.message||s.LOG_IN_FAILURE,t.ERROR)}})};export{g as afterInitialize,v as component};
