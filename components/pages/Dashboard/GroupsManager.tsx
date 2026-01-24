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
import {
  Users,
  X,
  Check,
  Search,
  Trash2,
  UserPlus,
  Plus,
  Crown,
  LogOut,
} from "lucide-react";
import {
  getUserGroups,
  getPendingGroupInvitations,
  acceptGroupInvitation,
  declineGroupInvitation,
  createGroup,
  sendGroupInvitation,
  leaveGroup,
  Group,
  GroupInvitation,
} from "@/lib/groupService";
import { getFriends } from "@/lib/friendService";

export default function GroupsManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<GroupInvitation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  
  // Create group state
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  
  // Invite member state
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  
  // Confirmation dialogs
  const [groupToLeave, setGroupToLeave] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    filterGroups();
  }, [searchTerm, groups]);

  const loadData = async () => {
    const [groupsList, pending, friendsList] = await Promise.all([
      getUserGroups(),
      getPendingGroupInvitations(),
      getFriends(),
    ]);
    setGroups(groupsList);
    setFilteredGroups(groupsList);
    setPendingInvitations(pending);
    setFriends(friendsList);
  };

  const filterGroups = () => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredGroups(
        groups.filter(
          (group) =>
            group.name.toLowerCase().includes(term) ||
            group.description?.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredGroups(groups);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    setLoading(true);
    const result = await createGroup(newGroupName, newGroupDescription);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setNewGroupName("");
      setNewGroupDescription("");
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !selectedGroup) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    const result = await sendGroupInvitation(selectedGroup.id!, inviteEmail);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setInviteEmail("");
      setShowInviteDialog(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    const result = await acceptGroupInvitation(invitationId);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    const result = await declineGroupInvitation(invitationId);
    if (result.success) {
      toast.info(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    const result = await leaveGroup(groupId);
    if (result.success) {
      toast.success(result.message);
      setGroupToLeave(null);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const getCurrentUserId = () => {
    return groups[0]?.members[0]?.userId || "";
  };

  const isUserAdmin = (group: Group) => {
    const currentUserId = getCurrentUserId();
    return group.members.some(
      (m) => m.userId === currentUserId && m.role === "admin"
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            <Users className="w-4 h-4" />
            <span>Groups</span>
            {pendingInvitations.length > 0 && (
              <Badge className="bg-red-500 text-white">
                {pendingInvitations.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Manage Groups</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="myGroups" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="myGroups">
                My Groups ({groups.length})
              </TabsTrigger>
              <TabsTrigger value="invitations">
                Invitations ({pendingInvitations.length})
              </TabsTrigger>
              <TabsTrigger value="create">Create Group</TabsTrigger>
            </TabsList>

            {/* My Groups Tab */}
            <TabsContent value="myGroups" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {filteredGroups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm
                    ? "No groups found"
                    : "No groups yet. Create your first group!"}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredGroups.map((group) => {
                    const isAdmin = isUserAdmin(group);
                    return (
                      <div
                        key={group.id}
                        className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg text-gray-900">
                                {group.name}
                              </h3>
                              {isAdmin && (
                                <Crown className="w-4 h-4 text-yellow-600" />
                              )}
                            </div>
                            {group.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {group.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              {group.members.length} member
                              {group.members.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {isAdmin && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedGroup(group);
                                  setShowInviteDialog(true);
                                }}
                                className="text-purple-600 border-purple-300"
                              >
                                <UserPlus className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setGroupToLeave({ id: group.id!, name: group.name })
                              }
                              className="text-red-600 border-red-300"
                            >
                              <LogOut className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Members List */}
                        <div className="space-y-2 mt-3 pt-3 border-t border-purple-200">
                          <p className="text-xs font-semibold text-gray-700 uppercase">
                            Members
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {group.members.map((member) => (
                              <div
                                key={member.userId}
                                className="flex items-center gap-2 p-2 bg-white rounded"
                              >
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                  <span className="text-purple-600 font-semibold text-sm">
                                    {member.name[0]?.toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-1 truncate">
                                    {member.name}
                                    {member.role === "admin" && (
                                      <Crown className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-600 truncate">
                                    {member.email}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Invitations Tab */}
            <TabsContent value="invitations" className="space-y-4">
              {pendingInvitations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending invitations
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 bg-purple-50 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold">{invitation.groupName}</div>
                        <div className="text-sm text-gray-600">
                          Invited by {invitation.fromUserName}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleAcceptInvitation(invitation.id!)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeclineInvitation(invitation.id!)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Create Group Tab */}
            <TabsContent value="create" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Group Name *
                  </label>
                  <Input
                    placeholder="e.g., Roommates, Travel Squad"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Description (Optional)
                  </label>
                  <Input
                    placeholder="What's this group for?"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleCreateGroup}
                  disabled={loading || !newGroupName.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> After creating a group, you can invite
                    friends to join. As the creator, you'll be the group admin.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Member to {selectedGroup?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="friend@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            {friends.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Or select from friends:
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {friends.map((friend) => (
                    <button
                      key={friend.friendId}
                      onClick={() => setInviteEmail(friend.friendEmail)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      {friend.friendName} ({friend.friendEmail})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowInviteDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInviteMember}
                disabled={loading || !inviteEmail.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Group Confirmation */}
      <AlertDialog
        open={!!groupToLeave}
        onOpenChange={(open) => !open && setGroupToLeave(null)}
      >
        <AlertDialogContent className="sm:max-w-md bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Group?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to leave{" "}
            <span className="font-semibold text-purple-700">
              {groupToLeave?.name}
            </span>
            ? You'll need to be invited again to rejoin.
          </AlertDialogDescription>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => groupToLeave && handleLeaveGroup(groupToLeave.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Leave Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
