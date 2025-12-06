"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";

export default function redirectIfLoggedIn(Component: any) {
  return function PublicPage(props: any) {
    const router = useRouter();

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          router.replace("/dashboard");
        }
      });

      return () => unsub();
    }, []);

    return <Component {...props} />;
  };
}
