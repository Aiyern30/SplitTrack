"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { fetchUserNames } from "@/lib/firestoreService"; // Import fetchUserNames

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
  const currentUserId = auth?.currentUser?.uid || "";

  const [ownData, setOwnData] = useState<DataItem[]>([]);
  const [friendData, setFriendData] = useState<DataItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("OWN");
  const [total, setTotal] = useState(0);
  const [friendTotal, setFriendTotal] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // State for selected user ID
  console.log("selectedUserId", selectedUserId);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({}); // State for user names
  const handleSelectChange = (value: string) => {
    setSelectedUserId(value);
  };
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

  // Memoize userIds to avoid unnecessary recalculation and re-rendering
  const userIds = useMemo(
    () =>
      friendData
        .map((item) => item.items[0]?.to)
        .filter((id, i, self) => id && self.indexOf(id) === i), // Ensure valid ids
    [friendData]
  );

  // Fetch user names based on userIds
  useEffect(() => {
    const loadUserNames = async () => {
      if (userIds.length > 0) {
        try {
          const names = await fetchUserNames(userIds);
          const sanitizedNames = Object.fromEntries(
            Object.entries(names).map(([id, name]) => [
              id,
              name || "Unknown User",
            ]) // Fallback if name is missing
          );
          setUserNames(sanitizedNames);
        } catch (error) {
          console.error("Error fetching user names: ", error);
        }
      }
    };

    loadUserNames();
  }, [userIds]); // Only run when userIds change

  if (loading || loadingData) return <div>Loading...</div>;
  if (!auth) return null;

  const groupedOwnData = groupByDate(ownData);
  const sortedOwnDates = sortDatesDescending(Object.keys(groupedOwnData));

  const groupedFriendData = groupByDate(friendData);
  const sortedFriendDates = sortDatesDescending(Object.keys(groupedFriendData));
  const currentTotal = activeTab === "OWN" ? total : friendTotal;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader total={currentTotal} />
      <LogoutButton />
      <div className="px-4 sm:px-8 lg:px-16 py-4 sm:py-8">
        <Card className="p-0 shadow-lg">
          <Tabs
            defaultValue="OWN"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="flex flex-col gap-4 p-4 border-b">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
                  <TabsTrigger value="OWN" className="text-xs sm:text-sm">
                    OWN
                  </TabsTrigger>
                  <TabsTrigger value="FRIENDS" className="text-xs sm:text-sm">
                    FRIENDS
                  </TabsTrigger>
                  <TabsTrigger value="GROUPS" className="text-xs sm:text-sm">
                    GROUPS
                  </TabsTrigger>
                  <TabsTrigger value="ACTIVITY" className="text-xs sm:text-sm">
                    ACTIVITY
                  </TabsTrigger>
                </TabsList>
                <div className="flex justify-center sm:justify-end">
                  <AddTransaction onSuccess={refreshData} />
                </div>
              </div>
              {activeTab === "FRIENDS" && (
                <div className="flex justify-center sm:justify-end">
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      {userIds.map((userId) => (
                        <SelectItem key={userId} value={userId}>
                          {userNames[userId] || "Unknown User"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <TabsContent value="OWN" className="p-4 mt-0">
              <OwnTabContent
                groupedData={groupedOwnData}
                sortedDates={sortedOwnDates}
                onTotalChange={(newTotal) => setTotal(newTotal)}
              />
            </TabsContent>

            <TabsContent value="FRIENDS" className="p-4 mt-0">
              <FriendTabContent
                groupedData={groupedFriendData}
                sortedDates={sortedFriendDates}
                onTotalChange={(newTotal) => setFriendTotal(newTotal)}
                currentUserId={currentUserId}
              />
            </TabsContent>

            <TabsContent value="GROUPS" className="p-4 mt-0">
              <div className="text-center text-gray-500 py-8">
                Content for GROUPS tab
              </div>
            </TabsContent>

            <TabsContent value="ACTIVITY" className="p-4 mt-0">
              <div className="text-center text-gray-500 py-8">
                Content for ACTIVITY tab
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
