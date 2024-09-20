interface Item {
  type: "expenses" | "income" | null;
  icon: string;
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
