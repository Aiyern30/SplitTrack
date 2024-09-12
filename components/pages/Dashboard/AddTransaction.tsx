"use client";

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
  Button, // Import Button if you plan to use it for submitting
} from "@/components/ui";
import { IoIosAddCircle } from "react-icons/io";
import { IoCalendarSharp } from "react-icons/io5";
import { GiNotebook } from "react-icons/gi";
import { MdLabel } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import Category from "./Category";
import { useEffect, useRef, useState } from "react";
import SelectPhoto from "./SelectPhoto";
import { format } from "date-fns"; // Add date formatting
import { addExpenseToFirestore } from "@/lib/firestoreService"; // Import addExpenseToFirestore

export default function AddTransaction() {
  const [addAmount, setAddAmount] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [addNote, setAddNote] = useState(false);
  const [noteText, setNoteText] = useState("Write a note ...");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  const noteRef = useRef<HTMLDivElement | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (noteRef.current && !noteRef.current.contains(e.target as Node)) {
      setAddNote(false);
    }

    if (amountRef.current && !amountRef.current.contains(e.target as Node)) {
      setAddAmount(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const labels = ["Chicken Rice", "Kolo Mee", "Coffee", "Pan Mee", "Expense"];

  // Function to handle form submission
  const handleSubmit = async () => {
    if (date && amount > 0 && selectedLabel) {
      const items = [
        {
          icon: "Food", // Update according to your icon logic
          title: selectedLabel,
          description: noteText,
          price: amount,
        },
      ];

      try {
        await addExpenseToFirestore(format(date, "yyyy-MM-dd"), items);
        alert("Expense added successfully!");
        // Optionally reset the form
        setAmount(0);
        setNoteText("Write a note ...");
        setSelectedLabel(null);
        setDate(null);
      } catch (error) {
        console.error("Error adding expense: ", error);
        alert("Failed to add expense.");
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger>
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
                onChange={(e) => setAmount(Number(e.target.value))}
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
                  <div>{date ? format(date, "PPP") : "Today"}</div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Input
                type="date"
                value={date ? format(date, "yyyy-MM-dd") : ""}
                onChange={(e) => setDate(new Date(e.target.value))}
              />
            </PopoverContent>
          </Popover>

          <div className="flex justify-between hover:bg-slate-200 cursor-pointer px-4 py-2 items-center rounded-xl">
            <div
              className="flex space-x-3 items-center w-full"
              onClick={(e) => {
                e.preventDefault();
                setAddNote(true);
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
                  />
                </div>
              ) : (
                <div>{noteText}</div>
              )}
            </div>
          </div>

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
                    Other:
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

          <SelectPhoto />

          <div className="mx-auto">
            <Category />
          </div>

          {/* Add a submit button */}
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
