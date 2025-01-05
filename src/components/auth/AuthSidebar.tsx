import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthHeader } from "./AuthHeader";
import { AuthContent } from "./AuthContent";

export function AuthSidebar() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      console.log("[AuthSidebar] Initial session check:", session?.user?.email);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[AuthSidebar] Auth state changed:", event, session?.user?.email);
      setSession(session);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        setOpen(false); // Close sidebar after successful sign in
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
        navigate("/"); // Redirect to home page after sign out
      } else if (event === 'USER_UPDATED') {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setOpen(false);
      navigate("/");
      
    } catch (error: any) {
      console.error("[AuthSidebar] Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50"
        disabled
      >
        <Menu className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <AuthHeader />
        <div className="mt-8">
          <AuthContent session={session} handleSignOut={handleSignOut} />
        </div>
      </SheetContent>
    </Sheet>
  );
}