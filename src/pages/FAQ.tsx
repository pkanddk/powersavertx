import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FAQ() {
  const sections = [
    {
      title: "What is Power Saver TX?",
      items: [
        "It's like a helper that finds the best electricity deals in Texas",
        "Just like comparing prices at different stores, but for electricity!"
      ]
    },
    {
      title: "How does it work?",
      items: [
        "You tell it your ZIP code (where you live)",
        "You tell it how much electricity you use (like small, medium, or large house)",
        "It shows you all the best deals it can find!"
      ]
    },
    {
      title: "Cool Features",
      items: [
        "You can compare up to 3 plans side by side",
        "It shows you which plans are eco-friendly (good for the Earth!)",
        "You can get alerts when prices drop (like when your favorite toy goes on sale!)",
        "It's super easy to use on your phone or computer"
      ]
    },
    {
      title: "Special Tools",
      items: [
        "Search: Find plans in your area",
        "Filters: Sort plans by what's important to you",
        "Compare: Look at different plans next to each other",
        "Alerts: Get notified about good deals"
      ]
    },
    {
      title: "Why It's Helpful",
      items: [
        "Saves you money on electricity bills",
        "Makes it easy to understand complicated electricity plans",
        "Helps you pick the best plan for your home",
        "Shows you which companies are trustworthy"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-6 pb-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">{section.title}</h2>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}