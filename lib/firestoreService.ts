import { initializeFirebase } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

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

export { addExpenseToFirestore, fetchExpensesFromFirestore };
