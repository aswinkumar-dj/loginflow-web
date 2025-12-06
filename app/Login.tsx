"use client";
import { useState, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useUserStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { registerUser, loginUser, googleLogin } from "@/services/authService";
import { sendSignupWebhook } from "@/services/webhookService";
import { parseAuthError } from "@/utils/errorFormatter";

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);

  const setNameStore = useUserStore((s) => s.setName);
  const router = useRouter();

  const handleSubmit = async () => {
    setEmailError("");
    setPasswordError("");

    const emailValue = email.current?.value;
    const passwordValue = password.current?.value;
    const confirmValue = confirmPassword.current?.value;

    if (!emailValue) return setEmailError("Email is required");
    if (!passwordValue) return setPasswordError("Password is required");

    if (isSignup && passwordValue !== confirmValue) {
      return setPasswordError("Password mismatch");
    }

    try {
      setLoading(true);
      let user;

      if (isSignup) {
        user = await registerUser(
          name.current?.value || "",
          emailValue,
          passwordValue
        );

        await sendSignupWebhook({
          name: name.current?.value,
          email: user.email,
          uid: user.uid,
          signedUpAt: new Date().toISOString(),
        });
      } else {
        user = await loginUser(emailValue, passwordValue);
      }

      setNameStore(user.displayName || "User");
      router.push("/dashboard");
    } catch (error: any) {
      const readable = parseAuthError(error.message);
      error.message.includes("password")
        ? setPasswordError(readable)
        : setEmailError(readable);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const user = await googleLogin();

      setNameStore(user.displayName || "User");

      await sendSignupWebhook({
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        provider: "google",
      });

      router.push("/dashboard");
    } catch {
      alert("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="min-w-115 max-w-md bg-black/50 backdrop-blur-md rounded-xl shadow-lg py-6 px-12">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <h1 className="text-2xl font-extrabold text-white text-center">
            {isSignup ? "Create Account" : "Login"}
          </h1>

          {isSignup && <input ref={name} type="text" placeholder="Full Name" />}

          <input ref={email} type="email" placeholder="Email" />
          {emailError && <p className="input-error">{emailError}</p>}

          <div className="relative">
            <input
              ref={password}
              type={showPwd ? "text" : "password"}
              placeholder="Password"
            />
            <span
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-3 text-white/20 cursor-pointer"
            >
              {showPwd ? (
                <AiOutlineEye size={18} />
              ) : (
                <AiOutlineEyeInvisible size={18} />
              )}
            </span>
          </div>

          {passwordError && <p className="input-error">{passwordError}</p>}

          {isSignup && (
            <div className="relative">
              <input
                ref={confirmPassword}
                type={showConfirmPwd ? "text" : "password"}
                placeholder="Confirm Password"
              />
              <span
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                className="absolute right-3 top-3 text-white/20 cursor-pointer"
              >
                {showConfirmPwd ? (
                  <AiOutlineEye size={18} />
                ) : (
                  <AiOutlineEyeInvisible size={18} />
                )}
              </span>
            </div>
          )}

          <button
            disabled={loading}
            className={`w-full py-3 bg-white text-black font-medium rounded-md ${
              loading ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-300"
            }`}
            onClick={handleSubmit}
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
          disabled={loading}
          className="w-full py-3 text-white border border-white/20 rounded-md flex items-center justify-center gap-2"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
