import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function WelcomeDialog({ zipCode }: { zipCode?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show dialog when ZIP code is entered and dialog hasn't been shown before
    if (zipCode && zipCode.length === 5) {
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
      if (!hasSeenWelcome) {
        setIsOpen(true);
        localStorage.setItem("hasSeenWelcome", "true");
      }
    }
  }, [zipCode]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Power Saver TX! 👋</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            We're currently in beta, which means we're still building and testing things out. Feel free to poke around, try out the features, and let us know about any issues you encounter. Your feedback will be super helpful as we get ready for the official launch.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}