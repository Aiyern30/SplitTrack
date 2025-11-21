"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { UserPlus, Users, Mail, X, Check, Search } from "lucide-react";
import {
  sendFriendRequest,
  getPendingFriendRequests,
  getSentFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  removeFriend,
  searchFriends,
} from "@/lib/friendService";

export default function FriendsManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    filterFriends();
  }, [searchTerm, friends]);

  const loadData = async () => {
    const [pending, sent, friendsList] = await Promise.all([
      getPendingFriendRequests(),
      getSentFriendRequests(),
      getFriends(),
    ]);
    setPendingRequests(pending);
    setSentRequests(sent);
    setFriends(friendsList);
    setFilteredFriends(friendsList);
  };

  const filterFriends = async () => {
    if (searchTerm) {
      const results = await searchFriends(searchTerm);
      setFilteredFriends(results);
    } else {
      setFilteredFriends(friends);
    }
  };

  const handleSendRequest = async () => {
    if (!email) return;
    
    setLoading(true);
    const result = await sendFriendRequest(email);
    setLoading(false);

    alert(result.message);
    if (result.success) {
      setEmail("");
      loadData();
    }
  };

  const handleAccept = async (requestId: string) => {
    const result = await acceptFriendRequest(requestId);
    alert(result.message);
    if (result.success) {
      loadData();
    }
  };

  const handleDecline = async (requestId: string) => {
    const result = await declineFriendRequest(requestId);
    alert(result.message);
    if (result.success) {
      loadData();
    }
  };

  const handleRemove = async (friendId: string) => {
    if (confirm("Are you sure you want to remove this friend?")) {
      const result = await removeFriend(friendId);
      alert(result.message);
      if (result.success) {
        loadData();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white hover:bg-indigo-50 border-2 border-indigo-200"
        >
          <Users className="w-4 h-4" />
          <span>Friends</span>
          {pendingRequests.length > 0 && (
            <Badge className="bg-red-500 text-white">
              {pendingRequests.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Manage Friends</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">
              My Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Requests ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="add">Add Friend</TabsTrigger>
          </TabsList>

          {/* My Friends Tab */}
          <TabsContent value="friends" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search friends by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredFriends.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No friends found" : "No friends yet. Start by adding some!"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {friend.friendName[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{friend.friendName}</div>
                        <div className="text-sm text-gray-600">{friend.friendEmail}</div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(friend.friendId)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Requests Tab */}
          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending requests
              </div>
            ) : (
              <div className="space-y-2">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">{request.fromUserName}</div>
                      <div className="text-sm text-gray-600">{request.fromUserEmail}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleAccept(request.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDecline(request.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sentRequests.length > 0 && (
              <>
                <h3 className="font-semibold text-gray-700 mt-6">Sent Requests</h3>
                <div className="space-y-2">
                  {sentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold">{request.toUserEmail}</div>
                        <div className="text-sm text-gray-600">Pending...</div>
                      </div>
                      <Badge>Sent</Badge>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Add Friend Tab */}
          <TabsContent value="add" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Friend's Email Address
                </label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendRequest()}
                  />
                  <Button
                    onClick={handleSendRequest}
                    disabled={loading || !email}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Send Request
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Enter your friend's email address to send them a friend request. 
                  They'll need to accept it before you can split expenses together.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
