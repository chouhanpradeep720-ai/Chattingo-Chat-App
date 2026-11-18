import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BsChatDotsFill,
  BsEnvelope,
  BsLock,
  BsPerson,
  BsArrowRight,
} from "react-icons/bs";

import { register } from "../../Redux/Auth/Action";

const Signup = () => {
  const [inputData, setInputData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !inputData.firstName.trim() ||
      !inputData.lastName.trim() ||
      !inputData.email.trim() ||
      !inputData.password.trim()
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (inputData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (inputData.password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await dispatch(register(inputData));

      if (response?.jwt) {
        setOpenSnackbar(true);

        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/signin");
        }, 1500);
      } else {
        setErrorMessage(
          response?.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#e8f5e9] via-white to-[#e0f2f1] px-4 py-10">

      {/* Background Decorations */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-green-900/10 md:grid-cols-2">

        {/* Branding Section */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#075e54] to-[#128c7e] p-12 text-white md:flex">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border-[35px] border-white/10" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl text-[#128c7e] shadow-lg">
              <BsChatDotsFill />
            </div>

            <span className="text-2xl font-bold tracking-wide">
              Chattingo
            </span>
          </div>

          <div className="relative z-10 my-12">
            <h1 className="text-4xl font-bold leading-tight">
              Your conversations.
              <span className="mt-2 block text-green-200">
                Your community.
              </span>
            </h1>

            <p className="mt-6 max-w-sm text-base leading-7 text-green-50/90">
              Create your account and start connecting with people.
              Share moments, exchange messages and stay close.
            </p>

            <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-lg font-semibold">
                Simple. Fast. Connected.
              </p>
              <p className="mt-2 text-sm text-green-50/80">
                Everything you need to keep your conversations going.
              </p>
            </div>
          </div>

          <p className="relative z-10 text-sm text-green-100/80">
            © {new Date().getFullYear()} Chattingo. All rights reserved.
          </p>
        </div>

        {/* Signup Form */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14">

          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center gap-3 md:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#128c7e] text-2xl text-white shadow-lg">
              <BsChatDotsFill />
            </div>

            <span className="text-3xl font-bold text-[#075e54]">
              Chattingo
            </span>
          </div>

          <div className="mb-7">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#128c7e]">
              Get Started
            </p>

            <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">
              Create Account
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Join Chattingo and start your conversations today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* First and Last Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  First Name
                </label>

                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 transition-all focus-within:border-[#128c7e] focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100">
                  <BsPerson className="shrink-0 text-gray-400" />

                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={inputData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                    className="w-full bg-transparent px-2 py-3.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Last Name
                </label>

                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 transition-all focus-within:border-[#128c7e] focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100">
                  <BsPerson className="shrink-0 text-gray-400" />

                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={inputData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                    className="w-full bg-transparent px-2 py-3.5 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-[#128c7e] focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100">
                <BsEnvelope className="shrink-0 text-gray-400" />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={inputData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-[#128c7e] focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100">
                <BsLock className="shrink-0 text-gray-400" />

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={inputData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </label>

              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-[#128c7e] focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100">
                <BsLock className="shrink-0 text-gray-400" />

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  autoComplete="new-password"
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#128c7e] py-4 font-semibold text-white shadow-lg shadow-green-800/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#075e54] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}

              {!isSubmitting && <BsArrowRight className="text-lg" />}
            </button>
          </form>

          {/* Login Navigation */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="ml-2 font-bold text-[#128c7e] transition-colors hover:text-[#075e54]"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Account registration submitted!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
