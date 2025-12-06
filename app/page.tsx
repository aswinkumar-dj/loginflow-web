"use client";
import Aurora from "@/components/Background";
import Login from "./Login";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div>
        <Login />
      </div>
    </main>
  );
}
