interface DashboardHeaderProps {
  total: number;
}

export default function DashboardHeader({ total }: DashboardHeaderProps) {
  // Determine the color and sign based on the total
  const isNegative = total < 0;
  const formattedTotal = isNegative
    ? `-MYR ${Math.abs(total)}`
    : `MYR ${total.toFixed(2)}`;

  return (
    <div className="bg-primary-background h-60 flex justify-center items-center rounded-b-[50px]">
      <div className="flex flex-col items-center space-y-3">
        <div className="text-2xl font-bold">SplitTrack</div>
        <div
          className={`bg-white rounded-2xl py-5 px-36 text-xl sm:text-3xl md:text-5xl ${
            isNegative ? "text-red-600" : "text-green-600 "
          }`}
        >
          {formattedTotal}
        </div>
      </div>
    </div>
  );
}
