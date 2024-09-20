"use client";

import React, { useEffect, useState } from "react";
import useAuth from "@/lib/useAuth";
import LogoutButton from "@/components/LogoutButton";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import AddTransaction from "@/components/pages/Dashboard/AddTransaction";
import { fetchExpensesFromFirestore } from "@/lib/firestoreService";
import OwnTabContent from "@/components/pages/Dashboard/ownTabContent";
import FriendTabContent from "@/components/pages/Dashboard/friendTabContent";

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
  const [total, setTotal] = useState(0);

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

  return (
    <div>
      <DashboardHeader total={total} />
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
              <OwnTabContent
                groupedData={groupedData}
                sortedDates={sortedDates}
                onTotalChange={(newTotal) => setTotal(newTotal)}
              />
            </TabsContent>
            <TabsContent value="FRIENDS" className="p-4">
              <FriendTabContent
                groupedData={groupedData}
                sortedDates={sortedDates}
                onTotalChange={(newTotal) => setTotal(newTotal)}
              />
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
