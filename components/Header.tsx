import Image from "next/image";
export default function Header() {
  return (
    <div className="bg-primary-background h-60 flex justify-center items-center">
      <div className="flex flex-col items-center space-y-3">
        <Image src={"/Logo.png"} alt="logo" width={100} height={100} />
        <div className=" text-2xl font-bold">SplitTrack</div>
      </div>
    </div>
  );
}
