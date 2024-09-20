// FeaturesDetails.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";

export default function FeaturesDetails() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center mb-5">
      <div className="text-3xl font-bold text-black">Features We Have</div>
      <div className="grid gap-y-8 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Expense Tracking Feature */}
        <Card className="w-80">
          <CardHeader className="flex flex-col items-center">
            <span className="text-5xl">📊</span>
            <CardTitle className="text-xl">Expense Tracking</CardTitle>
            <CardDescription>Daily, Monthly & Yearly</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-justify">
              Easily track your expenses by inputting details. Monitor your
              spending daily, monthly, and yearly, and filter your data for
              better insights.
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-gray-400">Stay on top of your finances</p>
          </CardFooter>
        </Card>

        {/* Friend Expenses Feature */}
        <Card className="w-80">
          <CardHeader className="flex flex-col items-center">
            <span className="text-5xl">👥</span>
            <CardTitle className="text-xl">Friend Expenses</CardTitle>
            <CardDescription>Track Who Owes Who</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-justify">
              Keep track of expenses with friends. Know how much money you owe
              or how much they owe you effortlessly.
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-gray-400">Easier group financial management</p>
          </CardFooter>
        </Card>

        {/* Group Expenses Feature */}
        <Card className="w-80">
          <CardHeader className="flex flex-col items-center">
            <span className="text-5xl">💸</span>
            <CardTitle className="text-xl">Group Expenses</CardTitle>
            <CardDescription>Track Trip Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-justify">
              Manage group expenses effectively. Split costs during trips and
              track who owes whom, ensuring clarity and fairness in shared
              expenses.
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-gray-400">
              Enjoy your trips without financial stress
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
