import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { useRef, useState } from "react";
import { FaPhotoVideo, FaChevronRight } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import Image from "next/image";

interface SelectPhotoProps {
  onSelectImage: (imageUrl: string) => void; // Callback prop to pass selected image URL
}

export default function SelectPhoto({ onSelectImage }: SelectPhotoProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const cloudinaryUpload = async (imageData: string) => {
    const data = new FormData();
    data.append("file", imageData);
    data.append("upload_preset", "r8nahj4h"); // Use the Unsigned preset name
    data.append("api_key", "597726494159232");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dhkuamrcj/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      console.log(result.secure_url);

      return result.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageDataUrl = canvasRef.current.toDataURL("image/png");
        setSelectedImage(imageDataUrl);
        setPhotoTaken(true);
        videoRef.current.srcObject = null;
        setIsCameraActive(false);

        // Upload to Cloudinary
        const imageUrl = await cloudinaryUpload(imageDataUrl);
        if (imageUrl) {
          onSelectImage(imageUrl); // Pass the Cloudinary URL to the parent
        }
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageDataUrl = event.target?.result as string;
        setSelectedImage(imageDataUrl);

        // Upload to Cloudinary
        const imageUrl = await cloudinaryUpload(imageDataUrl);
        if (imageUrl) {
          onSelectImage(imageUrl); // Pass the Cloudinary URL to the parent
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="hover:bg-slate-200 rounded-xl">
        <div className="flex justify-between cursor-pointer px-4 py-2 items-center rounded-xl">
          <div className="flex space-x-3 items-center">
            <FaPhotoVideo color="#4CBB9B" size={45} />
            <div>Select Photo</div>
          </div>
          <div>
            <FaChevronRight color="#4CBB9B" size={30} className="mr-8" />
          </div>
        </div>

        {selectedImage && (
          <Image
            alt="Selected"
            src={selectedImage}
            className="mx-auto mb-2"
            width={100}
            height={100}
          />
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Photo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-5 items-center justify-center">
          {!isCameraActive && !photoTaken && (
            <>
              <div className="flex flex-col items-center text-black">
                <MdAddPhotoAlternate
                  className="cursor-pointer"
                  size={160}
                  color="black"
                  onClick={handleFileSelect}
                />
                <div>Select Picture from device</div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </>
          )}

          {isCameraActive && (
            <>
              <video ref={videoRef} className="w-80 h-80 bg-black" />
              <Button onClick={capturePhoto}>Capture Photo</Button>
            </>
          )}

          {selectedImage && (
            <div className="flex flex-col items-center space-y-4">
              <Image
                src={selectedImage}
                alt="Selected"
                width={80}
                height={80}
              />
              <Button onClick={() => setSelectedImage(null)}>Remove</Button>
            </div>
          )}

          {photoTaken && (
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className="w-80 h-80"
              style={{ display: "none" }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
