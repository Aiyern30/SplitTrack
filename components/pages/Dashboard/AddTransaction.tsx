import * as React from "react";
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Label,
  Button,
} from "@/components/ui";
import { IoIosAddCircle } from "react-icons/io";
import {
  Calendar,
  Image as ImageIcon,
  Tag,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Category from "./Category";
import { useCallback, useEffect, useRef, useState } from "react";
import SelectPhoto from "./SelectPhoto";
import { format } from "date-fns";
import { addExpenseToFirestore } from "@/lib/firestoreService";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface AddTransactionProps {
  onSuccess: () => void;
}

export default function AddTransaction({ onSuccess }: AddTransactionProps) {
  const [amount, setAmount] = useState<number | string>("");
  const [noteText, setNoteText] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [categoryIcon, setCategoryIcon] = useState<JSX.Element | null>(null);
  const [categoryType, setCategoryType] = useState<
    "expenses" | "income" | null
  >(null);
  const [showLabelDialog, setShowLabelDialog] = useState(false);

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const handleCategorySelect = (
    category: string,
    icon: JSX.Element,
    type: "expenses" | "income"
  ) => {
    setCategory(category);
    setCategoryIcon(icon);
    setCategoryType(type);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const labels = [
    "Chicken Rice",
    "Kolo Mee",
    "Coffee",
    "Pan Mee",
    "Groceries",
    "Transport",
  ];

  const handleImageSelect = async (
    imageUrl: string
  ): Promise<string | null> => {
    const storage = getStorage();
    const user = getAuth().currentUser;

    if (!user) {
      alert("You must be logged in to add an expense.");
      return null;
    }

    const imageRef = ref(storage, `expenses/${user.uid}/${Date.now()}.png`);

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to add an expense.");
      return;
    }

    if (!amount || !selectedLabel || !category) {
      alert("Please fill in all required fields (Amount, Label, Category).");
      return;
    }

    const amountValue = Number(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Please provide a valid amount.");
      return;
    }

    const items = [
      {
        icon: category,
        type: categoryType || null,
        title: selectedLabel,
        description: noteText || null,
        // Apply sign based on type: income = positive, expenses = negative
        price:
          categoryType === "income"
            ? Math.abs(amountValue)
            : -Math.abs(amountValue),
        imageUrl: "",
        to: user.uid,
      },
    ];

    try {
      if (selectedImage) {
        const uploadedImageUrl = await handleImageSelect(selectedImage);
        items[0].imageUrl = uploadedImageUrl || "";
      }

      await addExpenseToFirestore(format(date, "yyyy-MM-dd"), items);

      // Reset form
      setAmount("");
      setNoteText("");
      setSelectedLabel("");
      setDate(new Date());
      setSelectedImage(null);
      setCategory(null);
      setCategoryIcon(null);
      setCategoryType(null);
      handleDrawerClose();

      if (onSuccess) {
        onSuccess();
      }

      alert("Transaction added successfully!");
    } catch (error) {
      console.error("Error adding expense: ", error);
      alert("Failed to add expense.");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (value === "" || (Number(value) >= 0 && !value.includes("-"))) {
      setAmount(value);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <button className="group relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 active:scale-95">
          <IoIosAddCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 py-4">
          <DrawerTitle className="text-center text-2xl font-bold text-gray-800">
            Add New Transaction
          </DrawerTitle>
        </DrawerHeader>

        <div className="overflow-y-auto p-6 space-y-6 pb-32">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              Amount <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold text-lg">
                MYR
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                min="0"
                step="0.01"
                className="pl-16 h-14 text-2xl font-bold border-2 border-gray-300 focus:border-indigo-500 rounded-xl text-gray-900 placeholder:text-gray-400"
              />
              {categoryType && (
                <div
                  className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 ${
                    categoryType === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {categoryType === "income" ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
              )}
            </div>
            {amount && categoryType && (
              <p
                className={`text-sm font-medium ${
                  categoryType === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {categoryType === "income" ? "+" : "-"}MYR{" "}
                {Number(amount).toFixed(2)}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              Category <span className="text-red-500">*</span>
              {categoryType && (
                <Badge
                  className={`ml-2 ${
                    categoryType === "income"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {categoryType === "income" ? "Income" : "Expense"}
                </Badge>
              )}
            </Label>
            {category && categoryIcon ? (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                  categoryType === "income"
                    ? "bg-green-50 border-green-300"
                    : "bg-red-50 border-red-300"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center">
                  {categoryIcon}
                </div>
                <span className="font-semibold text-gray-900">{category}</span>
                <button
                  onClick={() => {
                    setCategory(null);
                    setCategoryIcon(null);
                    setCategoryType(null);
                  }}
                  className="ml-auto text-xs text-red-600 hover:text-red-700 font-semibold px-3 py-1 bg-white rounded-lg hover:bg-red-50 transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="w-full p-4 border-2 border-dashed border-gray-400 rounded-xl bg-gray-50/50">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  Select a category for your transaction
                </p>
                <Category onSelectCategory={handleCategorySelect} />
              </div>
            )}
          </div>

          {/* Label Input */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600" />
              Label <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g., Lunch, Groceries, Coffee"
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e.target.value)}
              className="h-12 border-2 border-gray-300 focus:border-indigo-500 rounded-xl text-gray-900 placeholder:text-gray-400"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {labels.map((label) => (
                <Badge
                  key={label}
                  onClick={() => setSelectedLabel(label)}
                  className={`cursor-pointer text-sm font-medium transition-all px-3 py-1.5 ${
                    selectedLabel === label
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md border-2 border-indigo-600"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm"
                  }`}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Date
            </Label>
            <div
              className="relative cursor-pointer"
              onClick={() => dateInputRef.current?.showPicker?.()}
            >
              <Input
                ref={dateInputRef}
                type="date"
                value={format(date, "yyyy-MM-dd")}
                onChange={(e) => setDate(new Date(e.target.value))}
                max={format(new Date(), "yyyy-MM-dd")}
                className="h-12 border-2 border-gray-300 focus:border-indigo-500 rounded-xl text-gray-900 cursor-pointer pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 font-medium">
              Selected: {format(date, "MMMM dd, yyyy")}
            </p>
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Note (Optional)
            </Label>
            <textarea
              placeholder="Add a note about this transaction..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full h-24 px-4 py-3 border-2 border-gray-300 focus:border-indigo-500 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              Attach Photo (Optional)
            </Label>
            <SelectPhoto onSelectImage={setSelectedImage} />
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-4 flex gap-3 shadow-lg">
          <Button
            onClick={handleDrawerClose}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-2 border-gray-400 hover:bg-gray-100 hover:border-gray-500 text-gray-800 font-semibold transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!amount || !selectedLabel || !category}
            className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Add Transaction
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
