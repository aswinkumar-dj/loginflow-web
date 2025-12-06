"use client";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useStore";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { name, clearName } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    clearName();
    router.replace("/");
  };

  if (loading)
    return <p className="text-white text-center">Checking auth...</p>;

  return (
    <div className="text-white p-10">
      <h1 className="text-2xl">Welcome, {name}</h1>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-white text-black rounded-md"
      >
        Logout
      </button>
    </div>
  );
}
