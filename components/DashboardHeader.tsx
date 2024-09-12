// DashboardHeader.tsx
interface DashboardHeaderProps {
  total: number;
}

export default function DashboardHeader({ total }: DashboardHeaderProps) {
  return (
    <div className="bg-primary-background h-60 flex justify-center items-center rounded-b-[50px]">
      <div className="flex flex-col items-center space-y-3">
        <div className=" text-2xl font-bold">SplitTrack</div>
        <div className="bg-white rounded-2xl py-5 px-36 text-xl text-red-600">
          {total >= 0 ? `MYR ${total}` : `-MYR ${Math.abs(total)}`}
        </div>
      </div>
    </div>
  );
}
