"use client";

import React, { useEffect, useState } from "react";
import { Card, Avatar, AvatarFallback, AvatarImage, Badge } from "@/components/ui";
import RenderIcon from "@/components/RenderIcon";
import ImageModal from "./ImageModal";
import { Users, Edit2, Trash2 } from "lucide-react";

interface GroupTabContentProps {
  groupedData: Record<string, Item[]>;
  sortedDates: string[];
  onTotalChange: (total: number) => void;
  currentUserId: string;
  selectedGroupId?: string;
}

const GroupTabContent: React.FC<GroupTabContentProps> = ({
  groupedData,
  sortedDates,
  onTotalChange,
  currentUserId,
  selectedGroupId,
}) => {
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const calculateTotal = (items: Item[]): number => {
    return items.reduce((total, item) => {
      // Calculate based on user's share if available, otherwise use full price
      const amount = item.yourShare !== undefined ? item.yourShare : item.price;
      return item.type === "income" ? total + amount : total - amount;
    }, 0);
  };

  const total = sortedDates.reduce((acc, date) => {
    return acc + calculateTotal(groupedData[date]);
  }, 0);

  useEffect(() => {
    onTotalChange(total);
  }, [total, onTotalChange]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-orange-100 text-orange-700 border-orange-300",
      Transport: "bg-blue-100 text-blue-700 border-blue-300",
      Entertainment: "bg-purple-100 text-purple-700 border-purple-300",
      Shopping: "bg-pink-100 text-pink-700 border-pink-300",
      Bills: "bg-red-100 text-red-700 border-red-300",
      Health: "bg-green-100 text-green-700 border-green-300",
      Other: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return colors[category] || colors.Other;
  };

  return (
    <>
      <div className="space-y-6">
        {sortedDates.map((date) => {
          const items = groupedData[date];
          const dayTotal = calculateTotal(items);

          return (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 py-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <span className="text-sm font-semibold text-purple-600">
                    Your share: ${Math.abs(dayTotal).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Transaction Items */}
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-purple-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Side: Details */}
                      <div className="flex-1 min-w-0">
                        {/* Badges Row */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge
                            className={`${getCategoryColor(
                              item.icon
                            )} border font-medium text-xs px-2 py-1`}
                          >
                            {item.icon}
                          </Badge>
                          {item.groupName && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              {item.groupName}
                            </Badge>
                          )}
                          <Badge
                            className={`${
                              item.type === "income"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-red-100 text-red-700 border-red-300"
                            } border text-xs px-2 py-1`}
                          >
                            {item.type === "income" ? "Income" : "Expense"}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h4 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                          {item.title}
                        </h4>

                        {/* Description */}
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        {/* Split Info */}
                        {item.splitWith && item.splitWith.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-xs text-gray-600">
                              Split with {item.splitWith.length} member
                              {item.splitWith.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        )}

                        {/* Image */}
                        {item.imageUrl && (
                          <div className="mt-2">
                            <Avatar
                              className="w-20 h-20 rounded-xl overflow-hidden border-2 border-purple-100 shadow-md hover:scale-105 hover:border-purple-300 transition-all duration-200 cursor-pointer"
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
                              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 font-semibold">
                                IMG
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>

                      {/* Right Side: Price and Actions */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          {/* Total Amount */}
                          <div className="text-sm text-gray-600 mb-1">
                            Total: ${item.price.toFixed(2)}
                          </div>
                          {/* User's Share */}
                          <div
                            className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                              item.type === "income"
                                ? "text-green-600 bg-green-50"
                                : "text-purple-600 bg-purple-50"
                            }`}
                          >
                            {item.type === "income" ? "+" : "-"}$
                            {item.yourShare !== undefined
                              ? item.yourShare.toFixed(2)
                              : item.price.toFixed(2)}
                          </div>
                          {item.yourShare !== undefined &&
                            item.yourShare !== item.price && (
                              <div className="text-xs text-gray-500 mt-1">
                                Your share
                              </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-purple-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {sortedDates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-5xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No group expenses yet
            </h3>
            <p className="text-gray-500 text-sm">
              {selectedGroupId
                ? "This group has no expenses yet"
                : "Create or join a group to start splitting expenses"}
            </p>
          </div>
        )}
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

export default GroupTabContent;
