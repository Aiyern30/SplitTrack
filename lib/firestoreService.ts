// src/lib/firestoreService.ts

import { initializeFirebase } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface Item {
  icon: string;
  title: string;
  description: string | null;
  price: number;
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

export { addExpenseToFirestore };
