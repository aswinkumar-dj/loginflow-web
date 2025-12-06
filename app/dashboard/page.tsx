"use client";

import WithAuth from "@/components/WithAuth";
import { useUserStore } from "@/store/useStore";

function Dashboard() {
  const name = useUserStore((s) => s.name);

  return (
    <div className="h-screen text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome, {name}</h1>
    </div>
  );
}

export default WithAuth(Dashboard);
