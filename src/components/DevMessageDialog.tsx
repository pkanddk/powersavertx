import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { MessageSquare, Sparkles } from "lucide-react";

export function DevMessageDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Message from the Devs
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-b from-blue-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Welcome to Power Saver TX! 
            <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed space-y-4 pt-4">
            <p className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
              You&apos;ve discovered us a bit early, but we&apos;re excited to have you here. We&apos;re currently in the process of building and testing our app to ensure the best possible experience for our users.
            </p>
            <p className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-green-100 shadow-sm">
              As an early visitor, you have the unique opportunity to explore our app and provide valuable feedback. While you may encounter some bugs or quirks, your contributions will help shape the future while saving you money!
            </p>
            <p className="bg-gradient-to-r from-green-50 to-yellow-50 p-4 rounded-lg border border-yellow-100 shadow-sm">
              Feel free to dive in, test out the features, and let us know your thoughts. If you like what you see, don&apos;t forget to bookmark our site for the official launch, coming soon! We&apos;re working tirelessly to bring you the most user-friendly and efficient way to save on your power bills.
            </p>
            <p className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-orange-100 shadow-sm">
              Thank you for being a part of our journey. Together, we&apos;re revolutionizing the way people manage their energy costs.
            </p>
            <p className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-red-100 shadow-sm">
              Stay tuned for updates and get ready to experience the future of energy savings!
            </p>
            <p className="font-semibold text-primary text-center">
              The Power Saving Dev Team
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}