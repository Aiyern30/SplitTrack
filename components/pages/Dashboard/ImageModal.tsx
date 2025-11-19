"use client";

import React from "react";
import { X } from "lucide-react";

interface ImageModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  isOpen,
  onClose,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {title && (
        <div className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white font-semibold z-10">
          {title}
        </div>
      )}

      <div className="relative max-w-7xl max-h-[90vh] w-full h-full p-4 flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Full screen view"
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
        Click anywhere to close
      </div>
    </div>
  );
};

export default ImageModal;
