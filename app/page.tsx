"use client";

import Header from "@/components/Header";
import FeaturesDetails from "@/components/pages/Dashboard/FeaturesDetails";
import Login from "@/components/pages/Login";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex flex-col items-center bg-gray-100">
        <Login />

        <FeaturesDetails />
      </main>
    </div>
  );
}
