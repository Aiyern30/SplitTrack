"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";
import { UserPlus, Users, Mail, X, Check, Search, Trash2 } from "lucide-react";
import {
  sendFriendRequest,
  getPendingFriendRequests,
  getSentFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  removeFriend,
  searchFriends,
  cancelFriendRequest,
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
  const [friendToRemove, setFriendToRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    const result = await sendFriendRequest(email);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setEmail("");
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleAccept = async (requestId: string) => {
    const result = await acceptFriendRequest(requestId);

    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleDecline = async (requestId: string) => {
    const result = await declineFriendRequest(requestId);

    if (result.success) {
      toast.info(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleRemove = async (friendId: string) => {
    const result = await removeFriend(friendId);

    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }

    setFriendToRemove(null);
  };

  // ADD: Cancel sent friend request
  const handleCancelSentRequest = async (requestId: string) => {
    setLoading(true);
    const result = await cancelFriendRequest(requestId);
    setLoading(false);

    if (result.success) {
      toast.info(result.message || "Friend request canceled.");
      loadData();
    } else {
      toast.error(result.message || "Failed to cancel request.");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
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
            <DialogTitle className="text-2xl font-bold">
              Manage Friends
            </DialogTitle>
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
                  {searchTerm
                    ? "No friends found"
                    : "No friends yet. Start by adding some!"}
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
                          <div className="font-semibold text-black">
                            {friend.friendName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {friend.friendEmail}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setFriendToRemove({
                            id: friend.friendId,
                            name: friend.friendName,
                          })
                        }
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove</span>
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
                        <div className="font-semibold">
                          {request.fromUserName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {request.fromUserEmail}
                        </div>
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
                  <h3 className="font-semibold text-gray-700 mt-6">
                    Sent Requests
                  </h3>
                  <div className="space-y-2">
                    {sentRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-semibold text-black">
                            {request.toUserEmail}
                          </div>
                          <div className="text-sm text-gray-600">
                            Pending...
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Badge>Sent</Badge>
                          {/* ADD: Cancel button */}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loading}
                            onClick={() => handleCancelSentRequest(request.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
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
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendRequest()
                      }
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
                    <strong>Tip:</strong> Enter your friend's email address to
                    send them a friend request. They'll need to accept it before
                    you can split expenses together.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Remove Friend Confirmation Dialog */}
      <AlertDialog
        open={!!friendToRemove}
        onOpenChange={(open) => !open && setFriendToRemove(null)}
      >
        <AlertDialogContent className="sm:max-w-[500px] bg-white">
          <AlertDialogHeader className="space-y-4 pb-2">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center ring-8 ring-red-50">
              <Trash2 className="w-10 h-10 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-2xl font-bold text-gray-900 pt-2">
              Remove Friend?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogDescription className="text-center space-y-5 py-4">
            <p className="text-base text-gray-700 font-medium">
              Are you sure you want to remove
            </p>

            <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">
                    {friendToRemove?.name[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-xl">
                    {friendToRemove?.name}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Friend
                  </div>
                </div>
              </div>
            </div>

            <p className="text-base text-gray-700 font-medium">
              from your friends list?
            </p>

            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                  <span className="text-xl">⚠️</span>
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold text-amber-900 mb-1">
                    This action cannot be undone
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    You'll need to send a new friend request to add them back.
                    All shared transaction history will remain intact.
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>

          <AlertDialogFooter className="gap-3 sm:gap-2 mt-4 pt-4 border-t border-gray-200">
            <AlertDialogCancel className="w-full sm:w-auto h-12 hover:bg-gray-100 border-2 border-gray-300 font-semibold text-gray-700 rounded-lg transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => friendToRemove && handleRemove(friendToRemove.id)}
              className="w-full sm:w-auto h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Friend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
