"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Menu, X, User, Settings, LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  total: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ total }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isPositive = total >= 0;
  const router = useRouter();

  // Calculate financial health percentage
  const calculateFinancialHealth = () => {
    if (total >= 0) return 100;
    // If negative, health decreases based on debt amount
    // For every $100 in debt, health decreases by 10%
    const healthPercentage = Math.max(0, 100 - Math.abs(total) / 10);
    return Math.round(healthPercentage);
  };

  const financialHealth = calculateFinancialHealth();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-2">
      <div className="max-w-7xl mx-auto">
        <div
          className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? "shadow-2xl" : "shadow-md hover:shadow-lg"
          }`}
        >
          {/* Compact View */}
          <div
            className="px-4 sm:px-6 py-3 sm:py-4 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between gap-3">
              {/* Left: Menu Button */}
              <button
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </button>

              {/* Center: Balance */}
              <div className="flex items-center gap-3 flex-1 justify-center min-w-0">
                <div
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                    isPositive ? "bg-green-400 animate-pulse" : "bg-red-400 animate-pulse"
                  }`}
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                  <p className="text-indigo-100 text-xs sm:text-sm font-medium">
                    Balance
                  </p>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold tracking-tight truncate ${
                      isPositive ? "text-white" : "text-red-200"
                    }`}
                  >
                    {isPositive ? "+" : "-"}${Math.abs(total).toFixed(2)}
                  </h2>
                </div>
              </div>

              {/* Right: Expand/Collapse */}
              <button
                className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Menu Dropdown */}
          <div
            className={`transition-all duration-300 ease-in-out border-t border-white/20 ${
              isMenuOpen
                ? "max-h-48 opacity-100"
                : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="px-4 sm:px-6 py-3 space-y-2">
              <button
                className="w-full flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add profile navigation
                }}
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Profile</span>
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add settings navigation
                }}
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm">Settings</span>
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-2 text-red-200 hover:bg-red-500/20 rounded-lg transition-colors text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>

          {/* Expanded View */}
          <div
            className={`transition-all duration-500 ease-in-out border-t border-white/20 ${
              isExpanded
                ? "max-h-64 opacity-100"
                : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-4">
              {/* Status Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-lg w-fit ${
                      isPositive
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {isPositive ? (
                      <>
                        <span className="text-lg">✓</span>
                        <span>In the Green</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">⚠</span>
                        <span>Watch Your Spending</span>
                      </>
                    )}
                  </div>
                  <p className="text-indigo-100 text-xs sm:text-sm ml-1">
                    {isPositive
                      ? "Great job managing your finances!"
                      : "Time to review your expenses"}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                    <p className="text-indigo-100 text-xs">This Month</p>
                    <p className="text-white font-bold text-sm">
                      ${Math.abs(total).toFixed(0)}
                    </p>
                  </div>
                  <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                    <p className="text-indigo-100 text-xs">Status</p>
                    <p
                      className={`font-bold text-sm ${
                        isPositive ? "text-green-300" : "text-red-300"
                      }`}
                    >
                      {isPositive ? "Positive" : "Negative"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar - Financial Health */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-indigo-100">
                  <span>Financial Health</span>
                  <span>{financialHealth}%</span>
                </div>
                <div className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${
                      financialHealth >= 70
                        ? "bg-green-400"
                        : financialHealth >= 40
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                    style={{ width: `${financialHealth}%` }}
                  />
                </div>
                <p className="text-indigo-100 text-xs text-center">
                  {financialHealth >= 70 && "Excellent financial health!"}
                  {financialHealth >= 40 &&
                    financialHealth < 70 &&
                    "Good, but watch your spending"}
                  {financialHealth < 40 && "Consider reducing expenses"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
