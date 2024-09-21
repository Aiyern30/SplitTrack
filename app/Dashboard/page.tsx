"use client";

import React, { useEffect, useState } from "react";
import useAuth from "@/lib/useAuth";
import LogoutButton from "@/components/LogoutButton";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import AddTransaction from "@/components/pages/Dashboard/AddTransaction";
import {
  fetchExpensesFromFirestore,
  fetchExpensesWithFriends,
} from "@/lib/firestoreService";
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
  const [ownData, setOwnData] = useState<DataItem[]>([]);
  const [friendData, setFriendData] = useState<DataItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("OWN");
  const [total, setTotal] = useState(0);
  const [friendTotal, setFriendTotal] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // State for selected user ID

  useEffect(() => {
    const loadData = async () => {
      try {
        if (auth) {
          const expenses = await fetchExpensesFromFirestore();
          setOwnData(expenses);

          const friendExpenses = await fetchExpensesWithFriends();
          setFriendData(friendExpenses);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [auth]);

  const refreshData = async () => {
    setLoadingData(true);
    try {
      if (auth) {
        const expenses = await fetchExpensesFromFirestore();
        setOwnData(expenses);
        const friendExpenses = await fetchExpensesWithFriends();
        setFriendData(friendExpenses);
      }
    } catch (error) {
      console.error("Error refreshing data: ", error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) return <div>Loading...</div>;
  if (!auth) return null;

  const groupedOwnData = groupByDate(ownData);
  const sortedOwnDates = sortDatesDescending(Object.keys(groupedOwnData));

  const groupedFriendData = groupByDate(friendData);
  const sortedFriendDates = sortDatesDescending(Object.keys(groupedFriendData));
  const currentTotal = activeTab === "OWN" ? total : friendTotal;

  // Extract unique user IDs from friend data
  const userIds = friendData
    .map((item) => item.items[0].to)
    .filter((id, i, self) => self.indexOf(id) === i);
  console.log("userIds", userIds);

  return (
    <div>
      <DashboardHeader total={currentTotal} />
      <LogoutButton />
      <div className="px-16 py-8">
        <Card className="p-0">
          <Tabs
            defaultValue="OWN"
            className="w-full"
            onValueChange={setActiveTab}
          >
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
            {activeTab === "FRIENDS" && (
              <div className="flex justify-end pr-12">
                <Select onValueChange={(value) => setSelectedUserId(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    {userIds.map((userId) => (
                      <SelectItem key={userId} value={userId}>
                        {userId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <TabsContent value="OWN" className="p-4">
              <OwnTabContent
                groupedData={groupedOwnData}
                sortedDates={sortedOwnDates}
                onTotalChange={(newTotal) => setTotal(newTotal)}
              />
            </TabsContent>

            <TabsContent value="FRIENDS" className="p-4">
              <FriendTabContent
                groupedData={groupedFriendData}
                sortedDates={sortedFriendDates}
                onTotalChange={(newTotal) => setFriendTotal(newTotal)}
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
