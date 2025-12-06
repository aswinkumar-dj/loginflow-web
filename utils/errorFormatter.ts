export function parseAuthError(message: string) {
  if (message.includes("auth/invalid-email")) return "Invalid email format";
  if (message.includes("auth/missing-email")) return "Email is required";
  if (message.includes("auth/weak-password")) return "Password too weak";
  if (message.includes("auth/email-already-in-use"))
    return "Email already exists";
  if (message.includes("auth/invalid-credential"))
    return "Wrong email or password";

  return "Authentication failed";
}
