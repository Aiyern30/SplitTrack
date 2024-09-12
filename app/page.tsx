"use client";

import Header from "@/components/Header";
import Login from "@/components/pages/Login";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex justify-center items-center bg-gray-100">
        <Login />
      </main>
    </div>
  );
}
