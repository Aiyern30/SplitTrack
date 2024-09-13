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

// Create an array of icon objects
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

const IncomeIcons = [
  { category: "salary", icon: <FaMoneyCheckDollar size={30} /> },
  { category: "business", icon: <MdBusinessCenter size={30} /> },
  { category: "gifts", icon: <FaGift size={30} /> },
  { category: "extra income", icon: <GiBank size={30} /> },
  { category: "insurance", icon: <AiFillInsurance size={30} /> },
  { category: "other", icon: <CiCircleQuestion size={30} /> },
  { category: "game", icon: <IoGameController size={30} /> },
];

export default function Category() {
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
                  className="flex  items-center justify-center p-4 cursor-pointer rounded-xl"
                >
                  <div className="flex flex-col items-center">
                    {item.icon}
                    {item.category}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="Income">
            <div className="flex flex-wrap justify-center gap-4">
              {IncomeIcons.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center p-4 cursor-pointer rounded-xl"
                >
                  <div className="flex flex-col items-center">
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
