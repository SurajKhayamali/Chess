export const component = `
    <div class="container w-full h-full flex justify-center items-center">
        <div class="p-12 rounded-lg">
            <h1 class="text-3xl font-bold mb-8">Register</h1>
            <form class="grid grid-cols-1 gap-6">
                <label class="block">
                    <span>First name*</span>
                    <input type="text" class="input input-bordered w-full max-w-xs" name="firstName"
                        placeholder="Enter your first name" required />
                </label>
                <label class="block">
                    <span>Middle name</span>
                    <input type="text" class="input input-bordered w-full max-w-xs" name="middleName"
                        placeholder="Enter your middle name" />
                </label>
                <label class="block">
                    <span>Last name*</span>
                    <input type="text" class="input input-bordered w-full max-w-xs" name="lastName"
                        placeholder="Enter your last name" required />
                </label>
                <label class="block">
                    <span>Email address</span>
                    <input type="email" class="input input-bordered w-full max-w-xs" name="email"
                        placeholder="john@example.com" required />
                </label>
                <label class="block">
                    <span>Username*</span>
                    <input type="text" class="input input-bordered w-full max-w-xs" name="username"
                        placeholder="Enter your user name" required />
                </label>
                <label class="block">
                    <span>Password*</span>
                    <input type="current-password" class="input input-bordered w-full max-w-xs" name="password"
                        placeholder="Enter your password" required />
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
