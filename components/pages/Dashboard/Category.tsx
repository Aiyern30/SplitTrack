"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import {
  FaAddressCard,
  FaGift,
  FaParking,
  FaShoppingCart,
} from "react-icons/fa";
import { FaMaskFace, FaMoneyCheckDollar } from "react-icons/fa6";
import { GiBank } from "react-icons/gi";
import { IoFastFood, IoGameController } from "react-icons/io5";
import { MdBusinessCenter, MdFlight, MdHealthAndSafety } from "react-icons/md";
import { TbPerfume } from "react-icons/tb";
import { CiCircleQuestion } from "react-icons/ci";
import { AiFillInsurance } from "react-icons/ai";

const expensesCategories = [
  { name: "Food", icon: <IoFastFood size={28} /> },
  { name: "Shopping", icon: <FaShoppingCart size={28} /> },
  { name: "Travel", icon: <MdFlight size={28} /> },
  { name: "Entertainment", icon: <FaMaskFace size={28} /> },
  { name: "Health", icon: <MdHealthAndSafety size={28} /> },
  { name: "Parking", icon: <FaParking size={28} /> },
  { name: "Bills", icon: <GiBank size={28} /> },
  { name: "Toll", icon: <FaAddressCard size={28} /> },
  { name: "Beauty", icon: <TbPerfume size={28} /> },
  { name: "Game", icon: <IoGameController size={28} /> },
];

const incomeCategories = [
  { name: "Salary", icon: <FaMoneyCheckDollar size={28} /> },
  { name: "Business", icon: <MdBusinessCenter size={28} /> },
  { name: "Gifts", icon: <FaGift size={28} /> },
  { name: "Extra Income", icon: <GiBank size={28} /> },
  { name: "Insurance", icon: <AiFillInsurance size={28} /> },
  { name: "Other", icon: <CiCircleQuestion size={28} /> },
];

interface CategoryProps {
  onSelectCategory: (
    category: string,
    icon: JSX.Element,
    type: "expenses" | "income"
  ) => void;
}

const Category: React.FC<CategoryProps> = ({ onSelectCategory }) => {
  const [activeType, setActiveType] = useState<"expenses" | "income">(
    "expenses"
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories =
    activeType === "expenses" ? expensesCategories : incomeCategories;

  const handleSelectCategory = (name: string, icon: JSX.Element) => {
    setSelectedCategory(name);
    onSelectCategory(name, icon, activeType);
  };

  return (
    <div className="w-full space-y-4">
      {/* Type Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
        <Button
          type="button"
          onClick={() => {
            setActiveType("expenses");
            setSelectedCategory(null);
          }}
          className={`h-10 rounded-md font-semibold transition-all ${
            activeType === "expenses"
              ? "bg-red-500 text-white shadow-md hover:bg-red-600"
              : "bg-transparent text-gray-600 hover:bg-gray-200"
          }`}
        >
          Expenses
        </Button>
        <Button
          type="button"
          onClick={() => {
            setActiveType("income");
            setSelectedCategory(null);
          }}
          className={`h-10 rounded-md font-semibold transition-all ${
            activeType === "income"
              ? "bg-green-500 text-white shadow-md hover:bg-green-600"
              : "bg-transparent text-gray-600 hover:bg-gray-200"
          }`}
        >
          Income
        </Button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-80 overflow-y-auto p-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => handleSelectCategory(cat.name, cat.icon)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all border-2 ${
              selectedCategory === cat.name
                ? activeType === "expenses"
                  ? "bg-red-50 border-red-400 shadow-md"
                  : "bg-green-50 border-green-400 shadow-md"
                : "bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 shadow-sm"
            } group`}
          >
            <div
              className={`mb-2 transition-transform group-hover:scale-110 ${
                selectedCategory === cat.name
                  ? activeType === "expenses"
                    ? "text-red-600"
                    : "text-green-600"
                  : "text-gray-700 group-hover:text-indigo-600"
              }`}
            >
              {cat.icon}
            </div>
            <span
              className={`text-xs font-medium text-center leading-tight transition-colors ${
                selectedCategory === cat.name
                  ? activeType === "expenses"
                    ? "text-red-700"
                    : "text-green-700"
                  : "text-gray-700 group-hover:text-indigo-700"
              }`}
            >
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Category;
