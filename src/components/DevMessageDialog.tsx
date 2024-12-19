import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

export function DevMessageDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Message from the Devs
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-b from-blue-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Welcome to Power Saver TX!</DialogTitle>
          <DialogDescription className="text-base leading-relaxed space-y-4 pt-4">
            <p>
              You&apos;ve discovered us a bit early, but we&apos;re excited to have you here. We&apos;re currently in the process of building and testing our app to ensure the best possible experience for our users.
            </p>
            <p>
              As an early visitor, you have the unique opportunity to explore our app and provide valuable feedback. While you may encounter some bugs or quirks, your contributions will help shape the future while saving you money!
            </p>
            <p>
              Feel free to dive in, test out the features, and let us know your thoughts. If you like what you see, don&apos;t forget to bookmark our site for the official launch, coming soon! We&apos;re working tirelessly to bring you the most user-friendly and efficient way to save on your power bills.
            </p>
            <p>
              Thank you for being a part of our journey. Together, we&apos;re revolutionizing the way people manage their energy costs.
            </p>
            <p className="font-medium">
              Stay tuned for updates and get ready to experience the future of energy savings!
            </p>
            <p className="font-semibold text-primary">
              The Power Saving Dev Team
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}