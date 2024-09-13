"use client";

import React, { useEffect, useState } from "react";
import useAuth from "@/lib/useAuth";
import LogoutButton from "@/components/LogoutButton";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import AddTransaction from "@/components/pages/Dashboard/AddTransaction";
import { fetchExpensesFromFirestore } from "@/lib/firestoreService";
import RenderIcon from "@/components/RenderIcon";

const groupByDate = (data: DataItem[]): Record<string, Item[]> => {
  return data.reduce((acc: Record<string, Item[]>, curr: DataItem) => {
    if (!acc[curr.date]) {
      acc[curr.date] = [];
    }
    acc[curr.date].push(...curr.items);
    return acc;
  }, {});
};

const sortDatesDescending = (dates: string[]): string[] => {
  return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
};

const Dashboard = () => {
  const { auth, loading } = useAuth();
  const [data, setData] = useState<DataItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [drawerClose] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (auth) {
          const expenses = await fetchExpensesFromFirestore();
          setData(expenses);
        } else {
          console.error("User not authenticated");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [auth, drawerClose]);

  const refreshData = async () => {
    setLoadingData(true);
    try {
      if (auth) {
        const expenses = await fetchExpensesFromFirestore();
        setData(expenses);
      }
    } catch (error) {
      console.error("Error refreshing data: ", error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) return <div>Loading...</div>;

  if (!auth) return null;

  const groupedData = groupByDate(data);
  const sortedDates = sortDatesDescending(Object.keys(groupedData));

  const chunkItems = (items: Item[]): Item[][] => {
    const result: Item[][] = [];
    for (let i = 0; i < items.length; i += 2) {
      result.push(items.slice(i, i + 2));
    }
    return result;
  };

  const calculateTotal = (items: Item[]): number => {
    return items.reduce((total, item) => {
      return item.type === "income" ? total + item.price : total - item.price;
    }, 0);
  };

  return (
    <div>
      <DashboardHeader
        total={data.reduce((acc, { items }) => acc + calculateTotal(items), 0)}
      />
      <LogoutButton />
      <div className="px-16 py-8">
        <Card className="p-0">
          <Tabs defaultValue="OWN" className="w-full">
            <div className="flex flex-col sm:flex-row items-center p-4">
              <TabsList className="mx-auto">
                <TabsTrigger value="OWN">OWN</TabsTrigger>
                <TabsTrigger value="FRIENDS">FRIENDS</TabsTrigger>
                <TabsTrigger value="GROUPS">GROUPS</TabsTrigger>
                <TabsTrigger value="ACTIVITY">ACTIVITY</TabsTrigger>
              </TabsList>
              <div className="flex justify-end text-6xl cursor-pointer">
                <AddTransaction onSuccess={refreshData} />
              </div>
            </div>

            <TabsContent value="OWN" className="p-4">
              {sortedDates.map((date, index) => {
                const items = groupedData[date];
                return (
                  <div key={index} className="mb-8">
                    <Card className="mb-4">
                      <div className="flex justify-between mb-4 bg-[#D9D9D9] px-4 py-2 rounded-t-xl">
                        <div className="font-semibold text-lg">{date}</div>
                        <div
                          className={`font-bold ${
                            calculateTotal(items) >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          Total: {calculateTotal(items).toFixed(2)}
                        </div>
                      </div>
                      {chunkItems(items).map((itemPair, pairIndex) => (
                        <div key={pairIndex} className="px-4 py-2">
                          {itemPair.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center justify-between mb-4 last:mb-0"
                            >
                              <div className="flex items-center space-x-4">
                                <RenderIcon
                                  category={item.icon}
                                  type={item.type}
                                />
                                <div className="flex flex-col">
                                  <div className="font-semibold">
                                    {item.title}
                                  </div>
                                  {item.description && (
                                    <div className="text-gray-600">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                                {item.imageUrl && (
                                  <Avatar className="w-16 h-16 rounded-full overflow-hidden">
                                    <AvatarImage
                                      src={item.imageUrl}
                                      className="object-cover w-full h-full"
                                      alt="Transaction Image"
                                    />
                                    <AvatarFallback>Image</AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                              <div
                                className={`text-right font-bold ${
                                  item.type === "income"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {item.type === "income"
                                  ? `+${item.price}`
                                  : `-${item.price}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </Card>
                  </div>
                );
              })}
            </TabsContent>
            <TabsContent value="FRIENDS" className="p-4">
              <div>Content for FRIENDS tab</div>
            </TabsContent>
            <TabsContent value="GROUPS" className="p-4">
              <div>Content for GROUPS tab</div>
            </TabsContent>
            <TabsContent value="ACTIVITY" className="p-4">
              <div>Content for ACTIVITY tab</div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
