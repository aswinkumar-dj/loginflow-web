"use client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="min-w-115 max-w-md bg-black/50 backdrop-blur-md rounded-xl shadow-lg py-6 px-12">
        <form className="space-y-6">
          {/* Heading */}
          <h1 className="text-2xl font-extrabold text-white text-center">
            {isSignup ? "Create Account" : "Login"}
          </h1>

          {/* Signup name field */}
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border-b border-white/20 text-white text-sm placeholder-gray-300/30 focus:border-amber-100 focus:outline-none transition"
            />
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border-b border-white/20 text-white text-sm placeholder-gray-300/30 focus:border-amber-100 focus:outline-none transition"
          />

          {/* Password */}
          <div className="relative ">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border-b border-white/20 text-white text-sm placeholder-gray-300/30 focus:border-amber-100 focus:outline-none transition"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-white/20 cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEye size={18} />
              ) : (
                <AiOutlineEyeInvisible size={18} />
              )}
            </span>
          </div>

          {/* Confirm Password only on signup */}
          {isSignup && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-3 border-b border-white/20 text-white text-sm placeholder-gray-300/30 focus:border-amber-100 focus:outline-none transition"
              />

              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-white/20 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEye size={18} />
                ) : (
                  <AiOutlineEyeInvisible size={18} />
                )}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-medium rounded-md hover:bg-gray-300 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>

          {/* Toggle */}
          <p className="text-center text-sm text-gray-300">
            {isSignup ? "Already have an account?" : "Don't have an account?"}

            <span
              className="text-blue-400 cursor-pointer ml-1 hover:underline"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </form>

        <div className="border-b border-white/10 my-10 mx-6" />

        <button
          className="w-full py-3 text-white border border-white/20 font-medium rounded-md
             hover:bg-black/50 transition flex items-center justify-center mb-2 gap-2"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
