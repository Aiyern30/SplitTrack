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
import FriendsManager from "@/components/pages/Dashboard/FriendsManager";
import { getFriends } from "@/lib/friendService";

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
  const [loadingData, setLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState("OWN");
  const [total, setTotal] = useState(0);
  const [friendTotal, setFriendTotal] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // State for selected user ID
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({}); // State for user names
  const [friends, setFriends] = useState<any[]>([]); // Add friends state
  const [filteredFriendData, setFilteredFriendData] = useState<DataItem[]>([]);

  // Track which tabs have been loaded
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());

  const handleSelectChange = (value: string) => {
    setSelectedUserId(value);
  };

  // Load OWN data on initial mount
  useEffect(() => {
    if (auth && !loadedTabs.has("OWN")) {
      loadOwnData();
    }
  }, [auth]);

  // Load data when switching tabs
  useEffect(() => {
    if (auth && activeTab === "FRIENDS" && !loadedTabs.has("FRIENDS")) {
      loadFriendData();
    }
  }, [activeTab, auth]);

  const loadOwnData = async () => {
    if (loadingData) return; // Prevent multiple simultaneous loads

    setLoadingData(true);
    try {
      const expenses = await fetchExpensesFromFirestore();
      setOwnData(expenses);
      setLoadedTabs((prev) => new Set(prev).add("OWN"));
    } catch (error) {
      console.error("Error fetching own data: ", error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadFriendData = async () => {
    if (loadingData) return; // Prevent multiple simultaneous loads

    setLoadingData(true);
    try {
      const friendExpenses = await fetchExpensesWithFriends();
      setFriendData(friendExpenses);
      setLoadedTabs((prev) => new Set(prev).add("FRIENDS"));
    } catch (error) {
      console.error("Error fetching friend data: ", error);
    } finally {
      setLoadingData(false);
    }
  };

  const refreshData = async () => {
    if (activeTab === "OWN") {
      await loadOwnData();
    } else if (activeTab === "FRIENDS") {
      await loadFriendData();
    }
  };

  const userIds = useMemo(
    () =>
      friendData
        .map((item) => item.items[0]?.to)
        .filter((id, i, self) => id && self.indexOf(id) === i),
    [friendData]
  );

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

  // Load friends list when FRIENDS tab is accessed
  useEffect(() => {
    const loadFriendsList = async () => {
      if (auth && activeTab === "FRIENDS") {
        const friendsList = await getFriends();
        setFriends(friendsList);
      }
    };

    loadFriendsList();
  }, [auth, activeTab]);

  // Filter friend data when selectedUserId changes
  useEffect(() => {
    if (selectedUserId && selectedUserId !== "all") {
      const filtered = friendData
        .map((dataItem) => ({
          ...dataItem,
          items: dataItem.items.filter((item) => item.to === selectedUserId),
        }))
        .filter((dataItem) => dataItem.items.length > 0);

      setFilteredFriendData(filtered);
    } else {
      setFilteredFriendData(friendData);
    }
  }, [selectedUserId, friendData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!auth) return null;

  const groupedOwnData = groupByDate(ownData);
  const sortedOwnDates = sortDatesDescending(Object.keys(groupedOwnData));

  const groupedFriendData = groupByDate(filteredFriendData);
  const sortedFriendDates = sortDatesDescending(Object.keys(groupedFriendData));
  const currentTotal = activeTab === "OWN" ? total : friendTotal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="pt-4 sm:pt-6">
        <DashboardHeader total={currentTotal} />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Add Friends Manager Button */}
          <div className="mb-4 flex justify-end">
            <FriendsManager />
          </div>

          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur overflow-hidden">
            <Tabs
              defaultValue="OWN"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 sm:px-6 py-4">
                <div className="flex flex-col gap-4">
                  <TabsList className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border border-white/30 p-1 rounded-xl grid grid-cols-4 gap-1 mx-auto">
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

                  {activeTab === "FRIENDS" && friends.length > 0 && (
                    <div className="flex justify-center sm:justify-end">
                      <Select onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-full sm:w-[220px] bg-white/95 backdrop-blur border-white/50 focus:ring-2 focus:ring-white/50">
                          <SelectValue placeholder="Filter by friend" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Friends</SelectItem>
                          {friends.map((friend) => (
                            <SelectItem key={friend.friendId} value={friend.friendId}>
                              {friend.friendName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <TabsContent value="OWN" className="p-4 sm:p-6 mt-0">
                {loadingData && !loadedTabs.has("OWN") ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading transactions...</p>
                  </div>
                ) : sortedOwnDates.length === 0 ? (
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
                {loadingData && !loadedTabs.has("FRIENDS") ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Loading friend transactions...
                    </p>
                  </div>
                ) : sortedFriendDates.length === 0 ? (
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

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
        <div className="relative group">
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs sm:text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              {activeTab === "OWN" && "Add Personal Transaction"}
              {activeTab === "FRIENDS" && "Split with Friends"}
              {activeTab === "GROUPS" && "Add Group Expense"}
              {activeTab === "ACTIVITY" && "Add Transaction"}
            </div>
          </div>

          {/* FAB Button */}
          <div className="relative">
            <AddTransaction onSuccess={refreshData} />
            {/* Active Tab Indicator */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-xs font-bold text-indigo-600">
                {activeTab === "OWN" && "O"}
                {activeTab === "FRIENDS" && "F"}
                {activeTab === "GROUPS" && "G"}
                {activeTab === "ACTIVITY" && "A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
