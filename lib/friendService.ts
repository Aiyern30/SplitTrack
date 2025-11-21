import { db, auth } from "./firebase";
import { toast } from "sonner";
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
  or,
} from "firebase/firestore";

// Export interfaces for use in other components
export interface FriendRequest {
  id?: string;
  fromUserId: string;
  fromUserName: string;
  fromUserEmail: string;
  toUserId: string;
  toUserEmail: string;
  status: "pending" | "accepted" | "declined";
  createdAt: any;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendEmail: string;
  addedAt: any;
}

// Send a friend request
export const sendFriendRequest = async (
  toUserEmail: string
): Promise<{ success: boolean; message: string }> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return { success: false, message: "You must be logged in" };
  }

  try {
    // Find the user by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", toUserEmail.toLowerCase()));
    const userSnapshot = await getDocs(q);

    if (userSnapshot.empty) {
      return { success: false, message: "User not found with this email" };
    }

    const toUser = userSnapshot.docs[0];
    const toUserId = toUser.data().uid;

    // Check if user is trying to add themselves
    if (toUserId === currentUser.uid) {
      return { success: false, message: "You cannot add yourself as a friend" };
    }

    // Check if already friends
    const friendsRef = collection(db, "friends");
    const existingFriendship = query(
      friendsRef,
      where("userId", "==", currentUser.uid),
      where("friendId", "==", toUserId)
    );
    const friendshipSnapshot = await getDocs(existingFriendship);

    if (!friendshipSnapshot.empty) {
      return { success: false, message: "Already friends with this user" };
    }

    // Check if request already exists
    const requestsRef = collection(db, "friendRequests");
    const existingRequest = query(
      requestsRef,
      where("fromUserId", "==", currentUser.uid),
      where("toUserId", "==", toUserId),
      where("status", "==", "pending")
    );
    const requestSnapshot = await getDocs(existingRequest);

    if (!requestSnapshot.empty) {
      return { success: false, message: "Friend request already sent" };
    }

    // Create friend request
    await addDoc(collection(db, "friendRequests"), {
      fromUserId: currentUser.uid,
      fromUserName: currentUser.displayName || "Unknown",
      fromUserEmail: currentUser.email || "",
      toUserId: toUserId,
      toUserEmail: toUserEmail,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return { success: true, message: "Friend request sent successfully" };
  } catch (error: any) {
    console.error("Error sending friend request:", error);
    return { success: false, message: error.message || "Failed to send friend request" };
  }
};

// Get pending friend requests (received)
export const getPendingFriendRequests = async (): Promise<FriendRequest[]> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  try {
    const requestsRef = collection(db, "friendRequests");
    const q = query(
      requestsRef,
      where("toUserId", "==", currentUser.uid),
      where("status", "==", "pending")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FriendRequest[];
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return [];
  }
};

// Get sent friend requests
export const getSentFriendRequests = async (): Promise<FriendRequest[]> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  try {
    const requestsRef = collection(db, "friendRequests");
    const q = query(
      requestsRef,
      where("fromUserId", "==", currentUser.uid),
      where("status", "==", "pending")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FriendRequest[];
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    return [];
  }
};

// Accept friend request
export const acceptFriendRequest = async (
  requestId: string
): Promise<{ success: boolean; message: string }> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { success: false, message: "You must be logged in" };
  }

  try {
    const requestRef = doc(db, "friendRequests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      return { success: false, message: "Friend request not found" };
    }

    const requestData = requestSnap.data() as FriendRequest;

    // Create friendship for both users
    const friendsRef = collection(db, "friends");

    // Add friend for current user
    await addDoc(friendsRef, {
      userId: currentUser.uid,
      friendId: requestData.fromUserId,
      friendName: requestData.fromUserName,
      friendEmail: requestData.fromUserEmail,
      addedAt: serverTimestamp(),
    });

    // Add friend for the requester
    await addDoc(friendsRef, {
      userId: requestData.fromUserId,
      friendId: currentUser.uid,
      friendName: currentUser.displayName || "Unknown",
      friendEmail: currentUser.email || "",
      addedAt: serverTimestamp(),
    });

    // Update request status
    await updateDoc(requestRef, {
      status: "accepted",
    });

    return { success: true, message: "Friend request accepted" };
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return { success: false, message: "Failed to accept friend request" };
  }
};

// Decline friend request
export const declineFriendRequest = async (
  requestId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const requestRef = doc(db, "friendRequests", requestId);
    await updateDoc(requestRef, {
      status: "declined",
    });

    return { success: true, message: "Friend request declined" };
  } catch (error) {
    console.error("Error declining friend request:", error);
    return { success: false, message: "Failed to decline friend request" };
  }
};

// Remove friend
export const removeFriend = async (
  friendId: string
): Promise<{ success: boolean; message: string }> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { success: false, message: "You must be logged in" };
  }

  try {
    const friendsRef = collection(db, "friends");

    // Remove from current user's friends
    const q1 = query(
      friendsRef,
      where("userId", "==", currentUser.uid),
      where("friendId", "==", friendId)
    );
    const snapshot1 = await getDocs(q1);
    snapshot1.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Remove from friend's friends list
    const q2 = query(
      friendsRef,
      where("userId", "==", friendId),
      where("friendId", "==", currentUser.uid)
    );
    const snapshot2 = await getDocs(q2);
    snapshot2.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    return { success: true, message: "Friend removed successfully" };
  } catch (error) {
    console.error("Error removing friend:", error);
    return { success: false, message: "Failed to remove friend" };
  }
};

// Get all friends
export const getFriends = async (): Promise<Friend[]> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  try {
    const friendsRef = collection(db, "friends");
    const q = query(friendsRef, where("userId", "==", currentUser.uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Friend[];
  } catch (error) {
    console.error("Error fetching friends:", error);
    return [];
  }
};

// Search friends by name or email
export const searchFriends = async (searchTerm: string): Promise<Friend[]> => {
  const friends = await getFriends();

  if (!searchTerm) return friends;

  const term = searchTerm.toLowerCase();
  return friends.filter(
    (friend) =>
      friend.friendName.toLowerCase().includes(term) ||
      friend.friendEmail.toLowerCase().includes(term)
  );
};
