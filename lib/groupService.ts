import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface GroupMember {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "member";
  joinedAt: any;
}

export interface Group {
  id?: string;
  name: string;
  description?: string;
  createdBy: string;
  createdByName: string;
  members: GroupMember[];
  createdAt: any;
  updatedAt: any;
}

export interface GroupInvitation {
  id?: string;
  groupId: string;
  groupName: string;
  fromUserId: string;
  fromUserName: string;
  fromUserEmail: string;
  toUserId: string;
  toUserEmail: string;
  status: "pending" | "accepted" | "declined";
  createdAt: any;
}

// Get user's groups
export const getUserGroups = async (): Promise<Group[]> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  try {
    const groupsRef = collection(db, "groups");
    const snapshot = await getDocs(groupsRef);

    const groups = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((group: any) =>
        group.members.some((member: GroupMember) => member.userId === currentUser.uid)
      ) as Group[];

    return groups;
  } catch (error) {
    console.error("Error fetching groups:", error);
    return [];
  }
};

// Create a new group
export const createGroup = async (
  name: string,
  description?: string
): Promise<{ success: boolean; message: string; groupId?: string }> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { success: false, message: "You must be logged in" };
  }

  try {
    const groupData = {
      name,
      description: description || "",
      createdBy: currentUser.uid,
      createdByName: currentUser.displayName || "Unknown",
      members: [
        {
          userId: currentUser.uid,
          name: currentUser.displayName || "Unknown",
          email: currentUser.email || "",
          role: "admin",
          joinedAt: serverTimestamp(),
        },
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "groups"), groupData);

    return {
      success: true,
      message: "Group created successfully",
      groupId: docRef.id,
    };
  } catch (error: any) {
    console.error("Error creating group:", error);
    return {
      success: false,
      message: error.message || "Failed to create group",
    };
  }
};

// Get pending group invitations (received)
export const getPendingGroupInvitations = async (): Promise<GroupInvitation[]> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  try {
    const invitationsRef = collection(db, "groupInvitations");
    const q = query(
      invitationsRef,
      where("toUserId", "==", currentUser.uid),
      where("status", "==", "pending")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GroupInvitation[];
  } catch (error) {
    console.error("Error fetching group invitations:", error);
    return [];
  }
};

// Accept group invitation
export const acceptGroupInvitation = async (
  invitationId: string
): Promise<{ success: boolean; message: string }> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { success: false, message: "You must be logged in" };
  }

  try {
    const invitationRef = doc(db, "groupInvitations", invitationId);
    const invitationSnap = await getDoc(invitationRef);

    if (!invitationSnap.exists()) {
      return { success: false, message: "Invitation not found" };
    }

    const invitationData = invitationSnap.data() as GroupInvitation;

    // Get group
    const groupRef = doc(db, "groups", invitationData.groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      return { success: false, message: "Group not found" };
    }

    const groupData = groupSnap.data() as Group;

    // Add user to group members
    const newMember: GroupMember = {
      userId: currentUser.uid,
      name: currentUser.displayName || "Unknown",
      email: currentUser.email || "",
      role: "member",
      joinedAt: serverTimestamp(),
    };

    await updateDoc(groupRef, {
      members: [...groupData.members, newMember],
      updatedAt: serverTimestamp(),
    });

    // Update invitation status
    await updateDoc(invitationRef, {
      status: "accepted",
    });

    return { success: true, message: "Group invitation accepted" };
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return { success: false, message: "Failed to accept invitation" };
  }
};

// Decline group invitation
export const declineGroupInvitation = async (
  invitationId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const invitationRef = doc(db, "groupInvitations", invitationId);
    await updateDoc(invitationRef, {
      status: "declined",
    });

    return { success: true, message: "Group invitation declined" };
  } catch (error) {
    console.error("Error declining invitation:", error);
    return { success: false, message: "Failed to decline invitation" };
  }
};

// Send group invitation
export const sendGroupInvitation = async (
  groupId: string,
  toUserEmail: string
): Promise<{ success: boolean; message: string }> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { success: false, message: "You must be logged in" };
  }

  try {
    // Get group details
    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      return { success: false, message: "Group not found" };
    }

    const groupData = groupSnap.data() as Group;

    // Check if user is admin
    const isAdmin = groupData.members.some(
      (member) => member.userId === currentUser.uid && member.role === "admin"
    );

    if (!isAdmin) {
      return { success: false, message: "Only admins can invite members" };
    }

    // Find user by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", toUserEmail.toLowerCase()));
    const userSnapshot = await getDocs(q);

    if (userSnapshot.empty) {
      return { success: false, message: "User not found with this email" };
    }

    const toUser = userSnapshot.docs[0];
    const toUserId = toUser.data().uid;

    // Check if user is already a member
    const isMember = groupData.members.some(
      (member) => member.userId === toUserId
    );

    if (isMember) {
      return { success: false, message: "User is already a group member" };
    }

    // Create invitation
    await addDoc(collection(db, "groupInvitations"), {
      groupId,
      groupName: groupData.name,
      fromUserId: currentUser.uid,
      fromUserName: currentUser.displayName || "Unknown",
      fromUserEmail: currentUser.email || "",
      toUserId,
      toUserEmail,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return { success: true, message: "Group invitation sent successfully" };
  } catch (error: any) {
    console.error("Error sending group invitation:", error);
    return {
      success: false,
      message: error.message || "Failed to send invitation",
    };
  }
};

// Leave group
export const leaveGroup = async (
  groupId: string
): Promise<{ success: boolean; message: string }> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { success: false, message: "You must be logged in" };
  }

  try {
    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      return { success: false, message: "Group not found" };
    }

    const groupData = groupSnap.data() as Group;

    // If user is the only member, delete the group
    if (groupData.members.length === 1) {
      await deleteDoc(groupRef);
      return { success: true, message: "Group deleted successfully" };
    }

    // Remove user from group
    const updatedMembers = groupData.members.filter(
      (m) => m.userId !== currentUser.uid
    );

    await updateDoc(groupRef, {
      members: updatedMembers,
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: "Left group successfully" };
  } catch (error) {
    console.error("Error leaving group:", error);
    return { success: false, message: "Failed to leave group" };
  }
};
