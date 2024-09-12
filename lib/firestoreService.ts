import { initializeFirebase } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Define the Item interface
interface Item {
  icon: string;
  title: string;
  description: string | null;
  price: number;
}

// Define the DataItem interface
interface DataItem {
  date: string;
  item: Item[];
}

const addExpenseToFirestore = async (date: string, items: Item[]) => {
  const { firestore } = initializeFirebase();

  try {
    await addDoc(collection(firestore, "ownExpenses"), {
      date,
      items,
    });
    console.log("Expense added!");
  } catch (error) {
    console.error("Error adding expense: ", error);
  }
};

const fetchExpensesFromFirestore = async (): Promise<DataItem[]> => {
  const { firestore } = initializeFirebase();
  const expensesCollection = collection(firestore, "ownExpenses");
  const expenseDocs = await getDocs(expensesCollection);

  const expenses: DataItem[] = expenseDocs.docs.map((doc) => ({
    date: doc.data().date,
    item: doc.data().items,
  }));

  return expenses;
};

export { addExpenseToFirestore, fetchExpensesFromFirestore };
