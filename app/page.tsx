"use client";

import Header from "@/components/Header";
import FeaturesDetails from "@/components/pages/Dashboard/FeaturesDetails";
import { ArrowRight, CheckCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push("/Dashboard");
    } catch (error: any) {
      // Check if user cancelled the popup
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        // User closed the popup - don't show error
        console.log("Sign-in popup was closed by user");
        return;
      }

      // Show error only for actual failures
      console.error("Error signing in with Google: ", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-purple-100/30 to-pink-100/50 -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                  Track, Split, and Manage
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your Money,
                  <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Simplified
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  Track personal expenses, split bills with friends, and manage
                  group trips all in one place. Say goodbye to financial
                  confusion.
                </p>

                {/* Benefits List */}
                <div className="space-y-3">
                  {(
                    [
                      "Track expenses in real-time",
                      "Split bills effortlessly with friends",
                      "Manage group trip expenses",
                      "Get insights with beautiful analytics",
                    ] as unknown as string[]
                  ).map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={handleGoogleLogin}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300"
                  >
                    Learn More
                  </a>
                </div>
              </div>

              {/* Right Content - Illustration/Image */}
              <div className="relative lg:h-[600px] h-[400px] hidden sm:block">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-3xl transform rotate-3" />
                <div className="absolute inset-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-8xl mb-4">💰</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Financial Freedom
                    </h3>
                    <p className="text-gray-600">
                      Track every dollar with confidence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturesDetails />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {(
                [
                  { value: "10K+", label: "Active Users" },
                  { value: "50K+", label: "Transactions" },
                  { value: "5K+", label: "Groups Created" },
                  { value: "99%", label: "Satisfaction" },
                ] as unknown as { value: string; label: string }[]
              ).map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-indigo-100 text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ready to take control of your finances?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of users who are already managing their money
              smarter.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Tracking Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">SplitTrack</h3>
              <p className="text-sm">
                Your personal finance companion for tracking and splitting
                expenses.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#login"
                    className="hover:text-white transition-colors"
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@splittrack.com</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 SplitTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
