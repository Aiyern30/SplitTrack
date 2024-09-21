import { initializeFirebase } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
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
  const { firestore } = initializeFirebase();
  console.log("firestore", firestore);

  const userRef = doc(firestore, "users", user.uid);
  console.log("userRef", userRef);

  // Check if the user document already exists
  const docSnapshot = await getDoc(userRef);
  if (!docSnapshot.exists()) {
    // Create a new user document if it doesn't exist
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || null, // Allow null if no name is provided
      email: user.email || null, // Allow null if no email is provided
      photoURL: user.photoURL || null, // Include imageUrl if available
    });
  }
};

const addExpenseToFirestore = async (
  date: string,
  items: Item[]
): Promise<void> => {
  const { firestore } = initializeFirebase();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    await addDoc(collection(firestore, "ownExpenses"), {
      date,
      items,
      userId: user.uid,
    });
    console.log("Expense successfully added!");
  } catch (error) {
    console.error("Error adding expense: ", error);
    throw error;
  }
};

const fetchExpensesFromFirestore = async (): Promise<DataItem[]> => {
  const { firestore } = initializeFirebase();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const expensesCollection = collection(firestore, "ownExpenses");
  const q = query(expensesCollection, where("userId", "==", user.uid));
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
  const { firestore } = initializeFirebase();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const userId = user.uid; // Current logged-in user
  const expensesCollection = collection(firestore, "ownExpenses");

  // Query for expenses where the current user created the expense
  const q = query(expensesCollection, where("userId", "==", userId));

  const expenseDocs = await getDocs(q);
  console.log("Fetched documents:", expenseDocs.docs.length); // Check how many documents were fetched

  const expensesWithFriends: DataItem[] = expenseDocs.docs
    .map((doc) => {
      const data = doc.data();
      return {
        date: data.date,
        items: data.items.filter((item: Item) => item.to !== userId), // Keep only items where the recipient is a friend
      };
    })
    .filter((expense) => expense.items.length > 0); // Remove expenses with no relevant items

  return expensesWithFriends;
};

export {
  addExpenseToFirestore,
  fetchExpensesFromFirestore,
  fetchExpensesWithFriends,
  createUserProfile,
};
