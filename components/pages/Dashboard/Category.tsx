import { useState } from "react";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
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
import { IoIosSettings } from "react-icons/io";
import { cn } from "@/lib/utils";

const expensesIcons = [
  { category: "food", icon: <IoFastFood size={30} type="expenses" /> },
  { category: "shopping", icon: <FaShoppingCart size={30} type="expenses" /> },
  { category: "travel", icon: <MdFlight size={30} type="expenses" /> },
  { category: "entertainment", icon: <FaMaskFace size={30} type="expenses" /> },
  { category: "health", icon: <MdHealthAndSafety size={30} type="expenses" /> },
  { category: "parking", icon: <FaParking size={30} type="expenses" /> },
  { category: "bills", icon: <GiBank size={30} type="expenses" /> },
  { category: "tol", icon: <FaAddressCard size={30} type="expenses" /> },
  { category: "beauty", icon: <TbPerfume size={30} type="expenses" /> },
  { category: "game", icon: <IoGameController size={30} type="expenses" /> },
];

const incomeIcons = [
  { category: "salary", icon: <FaMoneyCheckDollar size={30} type="income" /> },
  { category: "business", icon: <MdBusinessCenter size={30} type="income" /> },
  { category: "gifts", icon: <FaGift size={30} type="income" /> },
  { category: "extra income", icon: <GiBank size={30} type="income" /> },
  { category: "insurance", icon: <AiFillInsurance size={30} type="income" /> },
  { category: "other", icon: <CiCircleQuestion size={30} type="income" /> },
  { category: "game", icon: <IoGameController size={30} type="income" /> },
];

interface CategoryProps {
  onSelectCategory: (
    category: string,
    icon: JSX.Element,
    type: "expenses" | "income"
  ) => void;
}

export default function Category({ onSelectCategory }: CategoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelectIcon = (
    category: string,
    icon: JSX.Element,
    type: "expenses" | "income"
  ) => {
    setSelectedCategory(category);
    if (onSelectCategory) {
      onSelectCategory(category, icon, type);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <Button className="bg-primary-background rounded-xl text-xl">
          Select a Category
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-primary-background p-6">
        <DrawerHeader>
          <DrawerTitle className="flex items-center">
            <div>Transaction Category</div>
            <div className="ml-auto">
              <IoIosSettings size={45} className="cursor-pointer" />
            </div>
          </DrawerTitle>
        </DrawerHeader>
        <Tabs defaultValue="Expenses" className="px-6">
          <TabsList>
            <TabsTrigger value="Expenses">Expenses</TabsTrigger>
            <TabsTrigger value="Income">Income</TabsTrigger>
          </TabsList>
          <TabsContent value="Expenses">
            <div className="flex flex-wrap justify-center gap-4">
              {expensesIcons.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center p-4 cursor-pointer rounded-xl"
                  onClick={() =>
                    handleSelectIcon(item.category, item.icon, "expenses")
                  }
                >
                  <div
                    className={cn(
                      "flex flex-col items-center",
                      "rounded-xl hover:bg-slate-400 p-4",
                      selectedCategory === item.category && "bg-slate-400"
                    )}
                  >
                    {item.icon}
                    {item.category}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="Income">
            <div className="flex flex-wrap justify-center gap-4">
              {incomeIcons.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center p-4 cursor-pointer rounded-xl"
                  onClick={() =>
                    handleSelectIcon(item.category, item.icon, "income")
                  }
                >
                  <div
                    className={cn(
                      "flex flex-col items-center",
                      "rounded-xl hover:bg-slate-400 p-4",
                      selectedCategory === item.category && "bg-slate-400"
                    )}
                  >
                    {item.icon}
                    {item.category}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}
