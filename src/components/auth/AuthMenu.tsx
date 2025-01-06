import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";

export function AuthMenu() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuthState();
  const [isOpen, setIsOpen] = useState(false);

  const handleAuth = (path: string) => {
    console.log("[AuthMenu] Navigating to:", path);
    setIsOpen(false);
    navigate(path);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error("[AuthMenu] Sign out error:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="bg-white/20 text-white border-white/30" disabled>
        <User className="h-4 w-4 animate-pulse" />
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white/20 text-white border-white/30"
          >
            <User className="h-4 w-4 mr-2" />
            My Account
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleAuth("/alerts")}>
            <User className="h-4 w-4 mr-2" />
            Manage Alerts
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/20 text-white border-white/30"
        >
          <User className="h-4 w-4 mr-2" />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleAuth("/login")}>
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAuth("/signup")}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}