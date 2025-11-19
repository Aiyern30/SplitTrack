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

  if (loading || loadingData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  if (!auth) return null;

  const groupedOwnData = groupByDate(ownData);
  const sortedOwnDates = sortDatesDescending(Object.keys(groupedOwnData));

  const groupedFriendData = groupByDate(friendData);
  const sortedFriendDates = sortDatesDescending(Object.keys(groupedFriendData));
  const currentTotal = activeTab === "OWN" ? total : friendTotal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="pt-4 sm:pt-6">
        <DashboardHeader total={currentTotal} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Track your expenses and split bills with friends
            </p>
          </div>
          <LogoutButton />
        </div>

        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur overflow-hidden">
          <Tabs
            defaultValue="OWN"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <TabsList className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border border-white/30 p-1 rounded-xl grid grid-cols-4 gap-1">
                  <TabsTrigger
                    value="OWN"
                    className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md text-white rounded-lg transition-all"
                  >
                    Own
                  </TabsTrigger>
                  <TabsTrigger
                    value="FRIENDS"
                    className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md text-white rounded-lg transition-all"
                  >
                    Friends
                  </TabsTrigger>
                  <TabsTrigger
                    value="GROUPS"
                    className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md text-white rounded-lg transition-all"
                  >
                    Groups
                  </TabsTrigger>
                  <TabsTrigger
                    value="ACTIVITY"
                    className="text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md text-white rounded-lg transition-all"
                  >
                    Activity
                  </TabsTrigger>
                </TabsList>
                <div className="flex justify-center sm:justify-end">
                  <AddTransaction onSuccess={refreshData} />
                </div>
              </div>
              {activeTab === "FRIENDS" && (
                <div className="mt-4 flex justify-center sm:justify-end">
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-full sm:w-[220px] bg-white/95 backdrop-blur border-white/50 focus:ring-2 focus:ring-white/50">
                      <SelectValue placeholder="Filter by friend" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Friends</SelectItem>
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

            <TabsContent value="OWN" className="p-4 sm:p-6 mt-0">
              {sortedOwnDates.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-5xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Start by adding your first transaction
                  </p>
                </div>
              ) : (
                <OwnTabContent
                  groupedData={groupedOwnData}
                  sortedDates={sortedOwnDates}
                  onTotalChange={(newTotal) => setTotal(newTotal)}
                />
              )}
            </TabsContent>

            <TabsContent value="FRIENDS" className="p-4 sm:p-6 mt-0">
              {sortedFriendDates.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-5xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No friend transactions
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Split bills with friends to see them here
                  </p>
                </div>
              ) : (
                <FriendTabContent
                  groupedData={groupedFriendData}
                  sortedDates={sortedFriendDates}
                  onTotalChange={(newTotal) => setFriendTotal(newTotal)}
                  currentUserId={currentUserId}
                />
              )}
            </TabsContent>

            <TabsContent value="GROUPS" className="p-4 sm:p-6 mt-0">
              <div className="text-center py-16">
                <div className="text-gray-400 text-5xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Groups coming soon
                </h3>
                <p className="text-gray-500 text-sm">
                  Split expenses with multiple people at once
                </p>
              </div>
            </TabsContent>

            <TabsContent value="ACTIVITY" className="p-4 sm:p-6 mt-0">
              <div className="text-center py-16">
                <div className="text-gray-400 text-5xl mb-4">📈</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Activity feed coming soon
                </h3>
                <p className="text-gray-500 text-sm">
                  Track all your transaction history here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
