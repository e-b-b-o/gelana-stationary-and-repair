// features/auth/Login.jsx

import { EyeIcon } from "@heroicons/react/24/outline";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { NavLink } from "react-router-dom";

function Login() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 md:py-16">
      <div className="w-full max-w-6xl bg-white border border-primary/10 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-175">
          {/* LEFT SIDE */}
          <div className="flex items-center justify-center px-6 py-12 md:px-14">
            <div className="w-full max-w-md space-y-8">
              {/* TOP */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-primary">
                  Welcome Back
                </h1>

                <p className="text-sm md:text-base text-muted">
                  Sign in to continue accessing your account and services.
                </p>
              </div>

              {/* FORM */}
              <form className="space-y-5">
                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    Email Address
                  </label>

                  <Input
                    placeholder="gelanatech@gmail.com"
                    variant="form"
                    size="lg"
                    type="email"
                  />
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    Password
                  </label>

                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      variant="form"
                      size="lg"
                      type="password"
                      className="pr-12"
                    />

                    <EyeIcon className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" />
                  </div>
                </div>

                {/* REMEMBER */}
                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-muted cursor-pointer">
                    <input type="checkbox" />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="font-semibold text-primary hover:opacity-70 transition"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* BUTTONS */}
                <div className="space-y-3 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center"
                  >
                    Sign In
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center"
                  >
                    Continue with Google
                  </Button>
                </div>
              </form>

              {/* SIGNUP */}
              <p className="text-sm text-center text-muted">
                Don&apos;t have an account?{" "}
                <NavLink
                  to="/signup"
                  className="font-semibold text-primary hover:opacity-70 transition"
                >
                  Sign Up
                </NavLink>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex bg-primary/5 items-center justify-center  border-l border-primary/10">
            <div className="h-full w-full overflow-hidden border border-primary/10">
              <img
                src="/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png"
                alt="Login"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
