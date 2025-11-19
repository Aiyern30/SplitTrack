"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DashboardHeaderProps {
  total: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ total }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPositive = total >= 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-b-2xl shadow-lg cursor-pointer transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? "shadow-2xl" : "shadow-md hover:shadow-lg"
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Compact View */}
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                      isPositive
                        ? "bg-green-400 animate-pulse"
                        : "bg-red-400 animate-pulse"
                    }`}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 flex-1 min-w-0">
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

              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`hidden sm:flex px-3 py-1 rounded-full text-xs font-semibold ${
                    isPositive
                      ? "bg-green-500/80 text-white"
                      : "bg-red-500/80 text-white"
                  }`}
                >
                  {isPositive ? "✓" : "⚠"}
                </div>
                <button
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Expanded View */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
              {/* Status Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
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
                <div className="flex gap-3 sm:gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                    <p className="text-indigo-100 text-xs">This Month</p>
                    <p className="text-white font-bold text-sm">
                      ${Math.abs(total).toFixed(0)}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
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

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-indigo-100">
                  <span>Financial Health</span>
                  <span>
                    {isPositive
                      ? "100%"
                      : `${Math.max(20, 100 - Math.abs(total) / 100).toFixed(0)}%`}
                  </span>
                </div>
                <div className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${
                      isPositive ? "bg-green-400" : "bg-red-400"
                    }`}
                    style={{
                      width: isPositive
                        ? "100%"
                        : `${Math.max(20, 100 - Math.abs(total) / 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
