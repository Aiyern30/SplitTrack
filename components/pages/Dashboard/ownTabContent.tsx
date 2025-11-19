"use client";

import React from "react";
import { Card, Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import RenderIcon from "@/components/RenderIcon";

interface OwnTabContentProps {
  groupedData: Record<string, Item[]>;
  sortedDates: string[];
  onTotalChange: (total: number) => void;
}

const OwnTabContent: React.FC<OwnTabContentProps> = ({
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
          <div key={index} className="mb-6">
            <Card className="mb-4 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-[#D9D9D9] px-4 py-3 rounded-t-xl">
                <div className="font-semibold text-base sm:text-lg">{date}</div>
                <div
                  className={`font-bold text-sm sm:text-base ${
                    calculateTotal(items) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  Total: {calculateTotal(items).toFixed(2)}
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <RenderIcon category={item.icon} type={item.type} />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="font-semibold text-sm sm:text-base truncate">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.imageUrl && (
                        <div className="flex-shrink-0">
                          <Avatar className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                            <AvatarImage
                              src={item.imageUrl}
                              alt="Transaction"
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gray-100">
                              IMG
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                    <div
                      className={`text-right font-bold text-base sm:text-lg flex-shrink-0 ${
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
            </Card>
          </div>
        );
      })}
    </>
  );
};

export default OwnTabContent;
