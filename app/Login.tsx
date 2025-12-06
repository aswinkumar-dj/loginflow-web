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
import { useUserStore } from "@/store/useStore";

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);

  const setNameStore = useUserStore((s) => s.setName);

  const router = useRouter();

  const formatFirebaseError = (error: string) => {
    if (error.includes("auth/invalid-email")) return "Invalid email format";
    if (error.includes("auth/missing-email")) return "Email is required";
    if (error.includes("auth/weak-password"))
      return "Password must be at least 6 characters";
    if (error.includes("auth/email-already-in-use"))
      return "Email already registered";
    if (error.includes("auth/invalid-credential"))
      return "Incorrect email or password";

    return "Authentication failed";
  };

  const handleButtonClick = async () => {
    setEmailError("");
    setPasswordError("");

    const emailValue = email.current?.value;
    const passwordValue = password.current?.value;
    const confirmValue = confirmPassword.current?.value;

    if (!emailValue) return setEmailError("Email is required");
    if (!passwordValue) return setPasswordError("Password is required");

    if (isSignup && passwordValue !== confirmValue) {
      return setPasswordError("Passwords do not match");
    }

    try {
      setLoading(true);

      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          emailValue,
          passwordValue
        );

        if (name.current?.value) {
          await updateProfile(userCredential.user, {
            displayName: name.current.value,
          });
          setNameStore(name.current.value);
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          emailValue,
          passwordValue
        );
        setNameStore(userCredential.user.displayName || "User");
      }

      router.push("/dashboard");
    } catch (error: any) {
      const readable = formatFirebaseError(error.message);

      if (
        error.message.includes("email") ||
        error.message.includes("credential")
      ) {
        setEmailError(readable);
      }

      if (
        error.message.includes("password") ||
        error.message.includes("weak")
      ) {
        setPasswordError(readable);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setNameStore(res.user.displayName || "User");
      router.push("/dashboard");
    } catch {
      alert("Google login failed");
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
              className="w-full p-3 border-b border-white/20 text-white text-sm placeholder-gray-300/30 focus:border-amber-100 transition"
            />
          )}

          <input
            ref={email}
            type="email"
            placeholder="Email"
            className="w-full p-3 border-b border-white/20 text-white text-sm placeholder-gray-300/30 focus:border-amber-100 transition"
          />
          {emailError && (
            <p className="text-red-400 text-xs animate-fade">{emailError}</p>
          )}

          <div className="relative">
            <input
              ref={password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border-b border-white/20 text-white text-sm placeholder-gray-300/30 focus:border-amber-100 transition"
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

          {passwordError && (
            <p className="text-red-400 text-xs animate-fade">{passwordError}</p>
          )}

          {isSignup && (
            <div className="relative">
              <input
                ref={confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-3 border-b border-white/20 text-white text-sm placeholder-gray-300/30 focus:border-amber-100 transition"
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
            disabled={loading}
            className={`w-full py-3 bg-white text-black font-medium rounded-md transition ${
              loading ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-300"
            }`}
            onClick={handleButtonClick}
          >
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
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
          className="w-full py-3 text-white border border-white/20 font-medium rounded-md hover:bg-black/50 transition flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
