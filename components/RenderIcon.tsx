interface IconProps {
  category: string;
  type: "expenses" | "income" | null;
}

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

const expensesIcons = [
  { category: "food", icon: <IoFastFood size={30} /> },
  { category: "shopping", icon: <FaShoppingCart size={30} /> },
  { category: "travel", icon: <MdFlight size={30} /> },
  { category: "entertainment", icon: <FaMaskFace size={30} /> },
  { category: "health", icon: <MdHealthAndSafety size={30} /> },
  { category: "parking", icon: <FaParking size={30} /> },
  { category: "bills", icon: <GiBank size={30} /> },
  { category: "tol", icon: <FaAddressCard size={30} /> },
  { category: "beauty", icon: <TbPerfume size={30} /> },
  { category: "game", icon: <IoGameController size={30} /> },
];

const incomeIcons = [
  { category: "salary", icon: <FaMoneyCheckDollar size={30} /> },
  { category: "business", icon: <MdBusinessCenter size={30} /> },
  { category: "gifts", icon: <FaGift size={30} /> },
  { category: "extra income", icon: <GiBank size={30} /> },
  { category: "insurance", icon: <AiFillInsurance size={30} /> },
  { category: "other", icon: <CiCircleQuestion size={30} /> },
  { category: "game", icon: <IoGameController size={30} /> },
];

export default function RenderIcon({ category, type }: IconProps) {
  const getIconForCategory = (category: string, type: IconProps["type"]) => {
    const iconsArray = type === "income" ? incomeIcons : expensesIcons;
    const iconObj = iconsArray.find(
      (icon) => icon.category.toLowerCase() === category.toLowerCase()
    );
    return iconObj ? iconObj.icon : <CiCircleQuestion size={30} />;
  };

  return <div>{getIconForCategory(category, type)}</div>;
}
