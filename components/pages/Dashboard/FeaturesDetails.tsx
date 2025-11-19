// FeaturesDetails.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";

export default function FeaturesDetails() {
  const features = [
    {
      icon: "📊",
      title: "Expense Tracking",
      subtitle: "Daily, Monthly & Yearly",
      description:
        "Easily track your expenses by inputting details. Monitor your spending daily, monthly, and yearly, and filter your data for better insights.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "👥",
      title: "Friend Expenses",
      subtitle: "Track Who Owes Who",
      description:
        "Keep track of expenses with friends. Know how much money you owe or how much they owe you effortlessly.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "💸",
      title: "Group Expenses",
      subtitle: "Track Trip Expenses",
      description:
        "Manage group expenses effectively. Split costs during trips and track who owes whom, ensuring clarity and fairness in shared expenses.",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Everything You Need to Manage Money
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Powerful features designed to make expense tracking and bill splitting effortless
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden bg-white/80 backdrop-blur-sm"
          >
            <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              <CardDescription className="text-sm font-medium text-indigo-600">
                {feature.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
            <div className="px-6 pb-6">
              <button className="w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                Learn More →
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
