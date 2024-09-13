import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "@/components/ui";
import { IoIosAddCircle } from "react-icons/io";
import { IoCalendarSharp } from "react-icons/io5";
import { GiNotebook } from "react-icons/gi";
import { MdLabel } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
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
  const [addAmount, setAddAmount] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | string>(""); // Change type to allow empty string
  const [addNote, setAddNote] = useState(false);
  const [noteText, setNoteText] = useState("Write a note ...");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const noteRef = useRef<HTMLDivElement | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (noteRef.current && !noteRef.current.contains(e.target as Node)) {
        // Check if noteText is empty and reset to default if necessary
        if (noteText.trim() === "") {
          setNoteText("Write a note ...");
        }
        setAddNote(false);
      }

      if (amountRef.current && !amountRef.current.contains(e.target as Node)) {
        setAddAmount(false);
      }
    },
    [noteText]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const labels = ["Chicken Rice", "Kolo Mee", "Coffee", "Pan Mee", "Expense"];

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
      console.log("File available at", downloadURL);
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

    const expenseLabel = selectedLabel || "No Label";
    const expenseNote = noteText === "Write a note ..." ? null : noteText;

    if (!selectedLabel) {
      alert("Please select a label.");
      return;
    }

    if (date && amount) {
      const amountValue = Number(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        alert("Please provide a valid amount.");
        return;
      }

      const items = [
        {
          icon: "Food",
          title: expenseLabel,
          description: expenseNote,
          price: amountValue,
          imageUrl: "", // Initialize as empty
          // userId: user.uid,
        },
      ];

      try {
        if (selectedImage) {
          const uploadedImageUrl = await handleImageSelect(selectedImage);
          items[0].imageUrl = uploadedImageUrl || ""; // Use the uploaded URL
        }

        await addExpenseToFirestore(format(date, "yyyy-MM-dd"), items);
        alert("Expense added successfully!");
        setAmount("");
        setNoteText("Write a note ...");
        setSelectedLabel(null);
        setDate(new Date());
        setSelectedImage(null);
        handleDrawerClose();

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error("Error adding expense: ", error);
        alert("Failed to add expense.");
      }
    } else {
      alert("Please provide a valid amount and date.");
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger onClick={handleDrawerOpen}>
        <IoIosAddCircle color="#4CBB9B" />
      </DrawerTrigger>
      <DrawerContent className="h-4/6">
        <DrawerHeader className="px-8 h-48">
          <DrawerTitle className="text-center">Add Transaction</DrawerTitle>
          <div className="flex items-center justify-between">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {addAmount ? (
              <Input
                ref={amountRef}
                type="number"
                placeholder="Enter Amount"
                onChange={(e) => setAmount(e.target.value)}
                className="w-96"
                value={amount}
              />
            ) : (
              <div
                className="text-xl cursor-pointer"
                onClick={() => setAddAmount(true)}
              >
                MYR {amount}
              </div>
            )}
          </div>
        </DrawerHeader>
        <div className="p-4 bg-white h-full flex flex-col space-y-5 text-black">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex justify-between hover:bg-slate-200 cursor-pointer px-4 py-2 items-center rounded-xl">
                <div className="flex space-x-3 items-center">
                  <IoCalendarSharp color="#4CBB9B" size={45} />
                  <div>
                    {date ? format(date, "PPP") : format(new Date(), "PPP")}
                  </div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Input
                type="date"
                value={
                  date
                    ? format(date, "yyyy-MM-dd")
                    : format(new Date(), "yyyy-MM-dd")
                }
                onChange={(e) => setDate(new Date(e.target.value))}
              />
            </PopoverContent>
          </Popover>

          <Dialog>
            <DialogTrigger>
              <div className="flex justify-between hover:bg-slate-200 cursor-pointer px-4 py-2 items-center rounded-xl">
                <div className="flex space-x-3 items-center">
                  <MdLabel color="#4CBB9B" size={45} />
                  <div>{selectedLabel ? selectedLabel : "Labels"}</div>
                </div>
                <div>
                  <FaChevronRight color="#4CBB9B" size={30} className="mr-8" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select a Label</DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap space-x-2 space-y-2 items-center justify-center">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="Other" className="text-black">
                    Label: <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter Label"
                    onChange={(e) => setSelectedLabel(String(e.target.value))}
                    className="w-96"
                    value={selectedLabel || ""}
                  />
                </div>
                {labels.map((label) => (
                  <Badge
                    key={label}
                    className="cursor-pointer"
                    onClick={() => setSelectedLabel(label)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex justify-between hover:bg-slate-200 cursor-pointer px-4 py-2 items-center rounded-xl">
            <div
              className="flex space-x-3 items-center w-full"
              onClick={(e) => {
                e.preventDefault();
                setAddNote(true);
                setNoteText("");
              }}
            >
              <GiNotebook color="#4CBB9B" size={45} />
              {addNote ? (
                <div ref={noteRef} className="flex items-center w-full">
                  <Input
                    type="text"
                    placeholder="Write a note"
                    className="text-black w-full"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onBlur={() => {
                      if (noteText.trim() === "") {
                        setNoteText("Write a note ...");
                      }
                      setAddNote(false);
                    }}
                  />
                </div>
              ) : (
                <div>{noteText}</div>
              )}
            </div>
          </div>

          <SelectPhoto onSelectImage={setSelectedImage} />

          <div className="mx-auto">
            <Category />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} className="bg-blue-500 text-white">
              Add Expense
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
