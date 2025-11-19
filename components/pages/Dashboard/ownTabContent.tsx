"use client";

import React, { useState } from "react";
import { Card, Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import RenderIcon from "@/components/RenderIcon";
import ImageModal from "./ImageModal";

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
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

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
      <div className="space-y-6">
        {sortedDates.map((date, index) => {
          const items = groupedData[date];
          const dayTotal = calculateTotal(items);

          return (
            <div key={index} className="group">
              <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden bg-white">
                {/* Date Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                  <div className="flex justify-between items-center gap-2 px-4 sm:px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                        {date}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="hidden sm:inline text-xs sm:text-sm text-gray-600 font-medium">
                        Day Total:
                      </span>
                      <span
                        className={`font-bold text-sm sm:text-base lg:text-lg px-2 sm:px-3 py-1 rounded-full ${
                          dayTotal >= 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        ${Math.abs(dayTotal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction Items */}
                <div className="divide-y divide-gray-100">
                  {items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200"
                    >
                      {/* Left: Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
                          <RenderIcon category={item.icon} type={item.type} />
                        </div>
                      </div>

                      {/* Middle: Title, Description, Tag, Image */}
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        {/* Title and Price Row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-sm sm:text-base text-gray-900 flex-1">
                            {item.title}
                          </div>
                          <div
                            className={`text-right font-bold text-base sm:text-lg lg:text-xl flex-shrink-0 px-2 sm:px-3 py-1 rounded-lg ${
                              item.type === "income"
                                ? "text-green-600 bg-green-50"
                                : "text-red-600 bg-red-50"
                            }`}
                          >
                            {item.type === "income" ? "+" : "-"}$
                            {item.price.toFixed(2)}
                          </div>
                        </div>

                        {/* Description (if exists) */}
                        {item.description && (
                          <div className="text-gray-600 text-xs sm:text-sm line-clamp-2 pr-2">
                            {item.description}
                          </div>
                        )}

                        {/* Tag */}
                        <div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              item.type === "income"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.type === "income" ? "Income" : "Expense"}
                          </span>
                        </div>

                        {/* Image */}
                        {item.imageUrl && (
                          <div className="mt-1">
                            <Avatar
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-indigo-100 shadow-md hover:scale-105 hover:border-indigo-300 transition-all duration-200 cursor-pointer"
                              onClick={() =>
                                setSelectedImage({
                                  url: item.imageUrl || "",
                                  title: item.title,
                                })
                              }
                            >
                              <AvatarImage
                                src={item.imageUrl}
                                alt="Transaction"
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 font-semibold">
                                IMG
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Image Modal */}
      <ImageModal
        imageUrl={selectedImage?.url || ""}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.title}
      />
    </>
  );
};

export default OwnTabContent;
