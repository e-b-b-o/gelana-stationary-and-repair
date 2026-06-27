// features/auth/Login.jsx

import { EyeIcon } from "@heroicons/react/24/outline";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import Spinner from "../../ui/Spinner";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) return setError("First name is required");
    if (!lastName.trim()) return setError("Last name is required");
    if (!email.includes("@")) return setError("Valid email is required");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    try {
      setIsLoading(true);
      await register({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      });

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/products");
    } catch (err) {
      setError(err.message || "Failed to create an account");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <section className="h-screen flex items-center justify-center px-4 bg-gray-50 overflow-hidden">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="flex items-center justify-center px-6 py-8 md:px-12">
            <div className="w-full max-w-sm space-y-6">
              {/* TOP */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-primary">
                  Welcome
                </h1>

                <p className="text-sm md:text-base text-muted">
                  Sign up to start buying and using our services
                </p>
              </div>

              {/* FORM */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-100">
                    {error}
                  </div>
                )}
                {/* FULL NAME */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-primary">
                    Full Name
                  </label>

                  <div className="space-y-1.5">
                    <Input
                      placeholder="Gelana Techan"
                      variant="form"
                      size="md"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                      placeholder="Techan"
                      variant="form"
                      size="md"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-primary">
                    Email Address
                  </label>

                  <Input
                    placeholder="gelanatech@gmail.com"
                    variant="form"
                    size="md"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-primary">
                    Password
                  </label>

                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      variant="form"
                      size="md"
                      type="password"
                      className="pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <EyeIcon className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" />
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-primary">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Input
                      placeholder="Confirm your password"
                      variant="form"
                      size="md"
                      type="password"
                      className="pr-12"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* REMEMBER */}
                <div className="flex items-center justify-between gap-4 text-sm mt-1">
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
                    size="md"
                    className="w-full justify-center flex items-center gap-2"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading && <Spinner size="sm" />}
                    {isLoading ? "Signing up..." : "Sign up"}
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    className="w-full justify-center"
                    disabled={isLoading}
                  >
                    Continue with Google
                  </Button>
                </div>
              </form>

              {/* SIGNUP */}
              <p className="text-sm text-center text-muted">
                Already have an account?
                <NavLink
                  to="/login"
                  className="font-semibold text-primary hover:opacity-70 transition"
                >
                  Sign in
                </NavLink>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex bg-primary/5 items-center justify-center relative">
            <div className="absolute inset-0">
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

export default Signup;
