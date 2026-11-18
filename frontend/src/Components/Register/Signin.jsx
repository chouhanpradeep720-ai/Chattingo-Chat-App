import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BsChatDotsFill,
  BsEnvelope,
  BsLock,
  BsArrowRight,
} from "react-icons/bs";

import { currentUser, login } from "../../Redux/Auth/Action";

const Signin = () => {
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const { auth } = useSelector((store) => store);

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

    if (!inputData.email.trim() || !inputData.password.trim()) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const res = await dispatch(login(inputData));

      if (res && res.jwt) {
        await dispatch(currentUser(res.jwt));
        setOpenSnackbar(true);
        navigate("/");
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(currentUser(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (auth.reqUser?.name) {
      navigate("/");
    }
  }, [auth.reqUser, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#e8f5e9] via-white to-[#e0f2f1] px-4 py-10">

      {/* Background Decorations */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-green-900/10 md:grid-cols-2">

        {/* Left Branding Section */}
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
              Connect with your people.
              <span className="mt-2 block text-green-200">
                Anytime, anywhere.
              </span>
            </h1>

            <p className="mt-6 max-w-sm text-base leading-7 text-green-50/90">
              Stay connected with friends and family through simple,
              fast and meaningful conversations.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#128c7e] bg-green-200 text-sm font-bold text-green-900">
                  C
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#128c7e] bg-yellow-200 text-sm font-bold text-yellow-900">
                  H
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#128c7e] bg-blue-200 text-sm font-bold text-blue-900">
                  A
                </div>
              </div>

              <span className="text-sm text-green-50">
                Your conversations, all in one place.
              </span>
            </div>
          </div>

          <p className="relative z-10 text-sm text-green-100/80">
            © {new Date().getFullYear()} Chattingo. All rights reserved.
          </p>
        </div>

        {/* Login Form Section */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-14">

          {/* Mobile Logo */}
          <div className="mb-10 flex items-center justify-center gap-3 md:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#128c7e] text-2xl text-white shadow-lg">
              <BsChatDotsFill />
            </div>

            <span className="text-3xl font-bold text-[#075e54]">
              Chattingo
            </span>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#128c7e]">
              Welcome Back
            </p>

            <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">
              Sign in to Chattingo
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Enter your details below to continue your conversations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-[#128c7e] focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100">
                <BsEnvelope className="shrink-0 text-lg text-gray-400" />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={inputData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="w-full bg-transparent px-3 py-4 text-sm text-gray-800 outline-none placeholder:text-gray-400"
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
                <BsLock className="shrink-0 text-lg text-gray-400" />

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={inputData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent px-3 py-4 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#128c7e] py-4 font-semibold text-white shadow-lg shadow-green-800/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#075e54] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}

              {!isSubmitting && <BsArrowRight className="text-lg" />}
            </button>
          </form>

          {/* Signup Navigation */}
          <div className="mt-8 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="ml-2 font-bold text-[#128c7e] transition-colors hover:text-[#075e54]"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <BsLock />
            Your account is protected and secure.
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
          Login Successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signin;
