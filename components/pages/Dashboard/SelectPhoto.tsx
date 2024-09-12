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

export default function SelectPhoto() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //   const handleTakePhoto = async () => {
  //     try {
  //       if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //         const stream = await navigator.mediaDevices.getUserMedia({
  //           video: true,
  //         });
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = stream;
  //           videoRef.current.play();
  //           setIsCameraActive(true);
  //         }
  //       } else {
  //         alert("Camera is not supported in this browser.");
  //       }
  //     } catch (err) {
  //       console.error("Error accessing camera:", err);
  //     }
  //   };

  const capturePhoto = () => {
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
        const imageUrl = canvasRef.current.toDataURL("image/png");
        setSelectedImage(imageUrl);
        setPhotoTaken(true);
        videoRef.current.srcObject = null;
        setIsCameraActive(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
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
              {/* <div className="flex flex-col items-center text-black">
                <FaCamera
                  size={120}
                  className="cursor-pointer"
                  color="black"
                  onClick={handleTakePhoto}
                />
                <div>Take photo</div>
              </div> */}
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
