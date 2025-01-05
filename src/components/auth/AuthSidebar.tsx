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
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(initialSession);
      } catch (error: any) {
        console.error("[AuthSidebar] Error getting initial session:", error);
        await supabase.auth.signOut();
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("[AuthSidebar] Auth state changed:", _event, session?.user?.email);
      
      if (_event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else if (_event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      } else if (_event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password recovery email sent",
          description: "Please check your email for password reset instructions.",
        });
      }
      
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

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