import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

interface Item {
  icon: string;
  type: "expenses" | "income" | null;
  title: string;
  description: string | null;
  price: number;
  imageUrl?: string;
  to: string;
}

interface DataItem {
  date: string;
  items: Item[];
}

interface User {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
}

const createUserProfile = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const docSnapshot = await getDoc(userRef);
  if (!docSnapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
    });
  }
};

const fetchUserNames = async (userIds: string[]) => {
  const userRefs = userIds.map((id) => doc(db, "users", id));

  const userSnapshots = await Promise.all(userRefs.map((ref) => getDoc(ref)));

  const userNames: { [key: string]: string | null } = {};

  userSnapshots.forEach((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      userNames[data.uid] = data.displayName || "Anonymous";
    } else {
      userNames[snapshot.id] = "Unknown";
    }
  });

  return userNames;
};

const addExpenseToFirestore = async (
  date: string,
  items: Item[]
): Promise<void> => {
  const currentUser = auth.currentUser;
  await addDoc(collection(db, "ownExpenses"), {
    date,
    items,
    userId: currentUser?.uid || "",
  });
};

const fetchExpensesFromFirestore = async (): Promise<DataItem[]> => {
  const currentUser = auth.currentUser;
  const expensesCollection = collection(db, "ownExpenses");
  const q = query(
    expensesCollection,
    where("userId", "==", currentUser?.uid || "")
  );
  const expenseDocs = await getDocs(q);

  const expenses: DataItem[] = expenseDocs.docs.map((doc) => ({
    date: doc.data().date,
    items: doc.data().items.map((item: Item) => ({
      ...item,
      imageUrl: item.imageUrl || "",
    })),
  }));

  return expenses;
};

const fetchExpensesWithFriends = async (): Promise<DataItem[]> => {
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid || "";
  const expensesCollection = collection(db, "ownExpenses");

  const q = query(expensesCollection, where("userId", "==", userId));
  const expenseDocs = await getDocs(q);

  const expensesWithFriends: DataItem[] = expenseDocs.docs
    .map((doc) => {
      const data = doc.data();
      return {
        date: data.date,
        items: data.items.filter((item: Item) => item.to !== userId),
      };
    })
    .filter((expense) => expense.items.length > 0);

  return expensesWithFriends;
};

export {
  addExpenseToFirestore,
  fetchExpensesFromFirestore,
  fetchExpensesWithFriends,
  createUserProfile,
  fetchUserNames,
};
