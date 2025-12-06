"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useStore";

export default function WithAuth(Component: any) {
  return function ProtectedPage(props: any) {
    const router = useRouter();
    const setName = useUserStore((s) => s.setName);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.replace("/");
        } else {
          setName(user.displayName || "User");
        }
      });

      return () => unsubscribe();
    }, []);

    return <Component {...props} />;
  };
}
