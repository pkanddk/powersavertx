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
    // For debugging
    console.log("[WelcomeDialog] ZIP code changed:", zipCode);
    
    // Show dialog when ZIP code is entered
    if (zipCode && zipCode.length === 5) {
      console.log("[WelcomeDialog] Valid ZIP code entered, checking if dialog should show");
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
      console.log("[WelcomeDialog] Has seen welcome:", hasSeenWelcome);
      
      if (!hasSeenWelcome) {
        console.log("[WelcomeDialog] Showing dialog");
        setIsOpen(true);
        localStorage.setItem("hasSeenWelcome", "true");
      }
    }
  }, [zipCode]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-red-50">
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