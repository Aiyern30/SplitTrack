"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { FaAddressCard, FaGift, FaParking, FaShoppingCart } from "react-icons/fa";
import { FaMaskFace, FaMoneyCheckDollar } from "react-icons/fa6";
import { GiBank } from "react-icons/gi";
import { IoFastFood, IoGameController } from "react-icons/io5";
import { MdBusinessCenter, MdFlight, MdHealthAndSafety } from "react-icons/md";
import { TbPerfume } from "react-icons/tb";
import { CiCircleQuestion } from "react-icons/ci";
import { AiFillInsurance } from "react-icons/ai";

const expensesCategories = [
	{ name: "Food", icon: <IoFastFood size={24} /> },
	{ name: "Shopping", icon: <FaShoppingCart size={24} /> },
	{ name: "Travel", icon: <MdFlight size={24} /> },
	{ name: "Entertainment", icon: <FaMaskFace size={24} /> },
	{ name: "Health", icon: <MdHealthAndSafety size={24} /> },
	{ name: "Parking", icon: <FaParking size={24} /> },
	{ name: "Bills", icon: <GiBank size={24} /> },
	{ name: "Toll", icon: <FaAddressCard size={24} /> },
	{ name: "Beauty", icon: <TbPerfume size={24} /> },
	{ name: "Game", icon: <IoGameController size={24} /> },
];

const incomeCategories = [
	{ name: "Salary", icon: <FaMoneyCheckDollar size={24} /> },
	{ name: "Business", icon: <MdBusinessCenter size={24} /> },
	{ name: "Gifts", icon: <FaGift size={24} /> },
	{ name: "Extra Income", icon: <GiBank size={24} /> },
	{ name: "Insurance", icon: <AiFillInsurance size={24} /> },
	{ name: "Other", icon: <CiCircleQuestion size={24} /> },
];

interface CategoryProps {
	onSelectCategory: (category: string, icon: JSX.Element, type: "expenses" | "income") => void;
}

const Category: React.FC<CategoryProps> = ({ onSelectCategory }) => {
	const [activeType, setActiveType] = useState<"expenses" | "income">("expenses");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const categories = activeType === "expenses" ? expensesCategories : incomeCategories;

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
					onClick={() => setActiveType("expenses")}
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
					onClick={() => setActiveType("income")}
					className={`h-10 rounded-md font-semibold transition-all ${
						activeType === "income"
							? "bg-green-500 text-white shadow-md hover:bg-green-600"
							: "bg-transparent text-gray-600 hover:bg-gray-200"
					}`}
				>
					Income
				</Button>
			</div>

			{/* Category Buttons */}
			<div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
				{categories.map((cat) => (
					<button
						key={cat.name}
						type="button"
						onClick={() => handleSelectCategory(cat.name, cat.icon)}
						className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border-2 ${
							selectedCategory === cat.name
								? "bg-indigo-100 border-indigo-500"
								: "bg-white border-gray-200 hover:border-indigo-500 hover:bg-indigo-50"
						} group`}
					>
						<div
							className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
								selectedCategory === cat.name
									? "bg-indigo-200"
									: "bg-gray-100 group-hover:bg-indigo-100"
							}`}
						>
							{cat.icon}
						</div>
						<span
							className={`font-medium text-left transition-colors ${
								selectedCategory === cat.name
									? "text-indigo-700"
									: "text-gray-800 group-hover:text-indigo-700"
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
