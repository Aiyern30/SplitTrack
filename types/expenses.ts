interface Item {
  type: "expenses" | "income" | null;
  icon: string;
  title: string;
  description: string | null;
  price: number;
  imageUrl?: string;
  to?: string; // Friend ID
  groupId?: string; // Group ID for group expenses
  groupName?: string; // Group name for display
  splitWith?: string[]; // Array of user IDs who are splitting
  paidBy?: string; // User ID who paid
  yourShare?: number; // User's share of the expense
}

interface DataItem {
  date: string;
  items: Item[];
}
