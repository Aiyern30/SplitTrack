"use client";

import React from "react";
import { Card, Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import RenderIcon from "@/components/RenderIcon";

interface friendTabContentProps {
  groupedData: Record<string, Item[]>;
  sortedDates: string[];
  onTotalChange: (total: number) => void;
}

const FriendTabContent: React.FC<friendTabContentProps> = ({
  groupedData,
  sortedDates,
  onTotalChange,
}) => {
  const chunkItems = (items: Item[]): Item[][] => {
    const result: Item[][] = [];
    for (let i = 0; i < items.length; i += 2) {
      result.push(items.slice(i, i + 2));
    }
    return result;
  };

  const calculateTotal = (items: Item[]): number => {
    return items.reduce((total, item) => {
      return item.type === "income" ? total + item.price : total - item.price;
    }, 0);
  };

  // Calculate total for all OWN items and pass it to the parent
  const total = sortedDates.reduce((acc, date) => {
    return acc + calculateTotal(groupedData[date]);
  }, 0);

  // Call the onTotalChange function to pass the total to DashboardHeader
  React.useEffect(() => {
    onTotalChange(total);
  }, [total, onTotalChange]);

  return (
    <>
      {sortedDates.map((date, index) => {
        const items = groupedData[date];
        return (
          <div key={index} className="mb-8">
            <Card className="mb-4">
              <div className="flex justify-between mb-4 bg-[#D9D9D9] px-4 py-2 rounded-t-xl">
                <div className="font-semibold text-lg">{date}</div>
                <div
                  className={`font-bold ${
                    calculateTotal(items) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  Total: {calculateTotal(items).toFixed(2)}
                </div>
              </div>
              {chunkItems(items).map((itemPair, pairIndex) => (
                <div key={pairIndex} className="px-4 py-2">
                  {itemPair.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between mb-4 last:mb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <RenderIcon category={item.icon} type={item.type} />
                        <div className="flex flex-col">
                          <div className="font-semibold">{item.title}</div>
                          {item.description && (
                            <div className="text-gray-600">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {item.imageUrl && (
                          <Avatar className="w-16 h-16 rounded-full overflow-hidden">
                            <AvatarImage
                              src={item.imageUrl}
                              alt="Transaction Image"
                            />
                            <AvatarFallback>Image</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div
                        className={`text-right font-bold ${
                          item.type === "income"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.type === "income"
                          ? `+${item.price}`
                          : `-${item.price}`}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          </div>
        );
      })}
    </>
  );
};

export default FriendTabContent;
