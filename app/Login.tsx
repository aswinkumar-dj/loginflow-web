"use client";
import { useState, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const router = useRouter();

  // ⬇️ Auth Logic
  const handleButtonClick = async () => {
    const emailValue = email.current?.value;
    const passwordValue = password.current?.value;

    if (!emailValue || !passwordValue) {
      alert("Email and password are required");
      return;
    }

    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          emailValue,
          passwordValue
        );

        // store name in Firebase profile
        if (name.current?.value) {
          await updateProfile(userCredential.user, {
            displayName: name.current.value,
          });
        }

        alert("Signup successful");
      } else {
        await signInWithEmailAndPassword(auth, emailValue, passwordValue);
        alert("Login successful");
      }

      router.push("/dashboard"); // redirect page
    } catch (error: any) {
      console.error(error.message);
      alert(error.message);
    }
  };

  // ⬇️ Google login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="min-w-115 max-w-md bg-black/50 backdrop-blur-md rounded-xl shadow-lg py-6 px-12">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <h1 className="text-2xl font-extrabold text-white text-center">
            {isSignup ? "Create Account" : "Login"}
          </h1>

          {isSignup && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border-b border-white/20 text-white text-sm placeholder-gray-300/30 focus:border-amber-100 focus:outline-none transition"
            />
          )}

          <input
            ref={email}
            type="email"
            placeholder="Email"
            className="w-full p-3 border-b border-white/20 text-white text-sm placeholder-gray-300/30 focus:border-amber-100 focus:outline-none transition"
          />

          <div className="relative">
            <input
              ref={password}
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

          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-medium rounded-md hover:bg-gray-300 transition"
            onClick={handleButtonClick}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>

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
          className="w-full py-3 text-white border border-white/20 font-medium rounded-md hover:bg-black/50 transition flex items-center justify-center mb-2 gap-2"
          onClick={handleGoogleLogin}
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
