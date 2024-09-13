// "use client";
// import React from "react";
// import useAuth from "@/lib/useAuth";
// import LogoutButton from "@/components/LogoutButton";
// import DashboardHeader from "@/components/DashboardHeader";
// import {
//   Card,
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui";
// import AddTransaction from "@/components/pages/Dashboard/AddTransaction";
// interface Item {
//   icon: string;
//   title: string;
//   description: string | null;
//   price: number;
// }

// interface DataItem {
//   date: string;
//   item: Item[];
// }

// const data: DataItem[] = [
//   {
//     date: "2022-01-03",
//     item: [
//       {
//         icon: "Food",
//         title: "Dinner at Canto",
//         description: null,
//         price: -2000,
//       },
//       {
//         icon: "Food",
//         title: "Dinner at Sunway Plaza",
//         description: "Chicken Rice",
//         price: -20,
//       },
//     ],
//   },
//   {
//     date: "2022-01-02",
//     item: [
//       {
//         icon: "Food",
//         title: "Dinner at Canto",
//         description: null,
//         price: -2000,
//       },
//       {
//         icon: "Food",
//         title: "Dinner at Sunway Plaza",
//         description: "Chicken Rice",
//         price: -20,
//       },
//       {
//         icon: "Food",
//         title: "Dinner at Canto",
//         description: null,
//         price: -2000,
//       },
//       {
//         icon: "Food",
//         title: "Dinner at Sunway Plaza",
//         description: "Chicken Rice",
//         price: -20,
//       },
//     ],
//   },
//   {
//     date: "2022-01-01",
//     item: [
//       {
//         icon: "Food",
//         title: "Dinner at Canto",
//         description: null,
//         price: -2000,
//       },
//       {
//         icon: "Food",
//         title: "Dinner at Sunway Plaza",
//         description: "Chicken Rice",
//         price: -20,
//       },
//     ],
//   },
// ];

// const Dashboard = () => {
//   const { auth, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;

//   if (!auth) return null;

//   const chunkItems = (items: Item[]): Item[][] => {
//     const result: Item[][] = [];
//     for (let i = 0; i < items.length; i += 2) {
//       result.push(items.slice(i, i + 2));
//     }
//     return result;
//   };

//   const calculateTotal = (items: Item[]): number => {
//     return items.reduce((total, item) => total + item.price, 0);
//   };
//   const total = data.reduce(
//     (acc, dataItem) => acc + calculateTotal(dataItem.item),
//     0
//   );

//   return (
//     <div>
//       <DashboardHeader total={total} />
//       <LogoutButton />
//       <div className="px-16 py-8">
//         <Card className="p-0">
//           <Tabs defaultValue="OWN" className="w-full">
//             <div className="flex flex-col sm:flex-row items-center p-4">
//               <TabsList className="mx-auto">
//                 <TabsTrigger value="OWN">OWN</TabsTrigger>
//                 <TabsTrigger value="FRIENDS">FRIENDS</TabsTrigger>
//                 <TabsTrigger value="GROUPS">GROUPS</TabsTrigger>
//                 <TabsTrigger value="ACTIVITY">ACTIVITY</TabsTrigger>
//               </TabsList>
//               <div className="flex justify-end text-6xl cursor-pointer">
//                 <AddTransaction />
//               </div>
//             </div>

//             <TabsContent value="OWN" className="p-4">
//               {data.map((dataItem, index) => (
//                 <div key={index} className="mb-8">
//                   <Card className="mb-4">
//                     <div className="flex justify-between mb-4 bg-[#D9D9D9] px-4 py-2 rounded-t-xl">
//                       <div className="font-semibold text-lg">
//                         {dataItem.date}
//                       </div>
//                       <div className="font-bold text-red-500">
//                         Total: {calculateTotal(dataItem.item)}
//                       </div>
//                     </div>
//                     {chunkItems(dataItem.item).map((itemPair, pairIndex) => (
//                       <div key={pairIndex} className="px-4 py-2">
//                         {itemPair.map((item, itemIndex) => (
//                           <div
//                             key={itemIndex}
//                             className="flex items-center justify-between mb-4 last:mb-0"
//                           >
//                             <div className="flex items-center">
//                               {/* Display icon if needed */}
//                               {/* <img src={/icons/${item.icon}.png} alt={item.icon} className="w-8 h-8 mr-4"/> */}
//                               {item.icon}
//                               <div className="pl-7">
//                                 <div className="font-semibold">
//                                   {item.title}
//                                 </div>
//                                 {item.description && (
//                                   <div className="text-gray-600">
//                                     {item.description}
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                             <div className="text-right font-bold text-red-500">
//                               {item.price} {/* You might want to format this */}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ))}
//                   </Card>
//                 </div>
//               ))}
//             </TabsContent>
//             <TabsContent value="FRIENDS" className="p-4">
//               {/* Add content for FRIENDS tab here */}
//               <div>Content for FRIENDS tab</div>
//             </TabsContent>
//             <TabsContent value="GROUPS" className="p-4">
//               {/* Add content for GROUPS tab here */}
//               <div>Content for GROUPS tab</div>
//             </TabsContent>
//             <TabsContent value="ACTIVITY" className="p-4">
//               {/* Add content for ACTIVITY tab here */}
//               <div>Content for ACTIVITY tab</div>
//             </TabsContent>
//           </Tabs>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
