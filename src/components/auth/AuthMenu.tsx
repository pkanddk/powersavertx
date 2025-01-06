import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";

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

  if (isLoading) {
    return (
      <Button variant="outline" className="bg-white/20 backdrop-blur-sm text-white border-white/30" disabled>
        <User className="h-4 w-4 animate-pulse" />
      </Button>
    );
  }

  if (user) {
    return (
      <Button 
        variant="outline" 
        className="bg-white/20 backdrop-blur-sm text-white border-white/30"
        onClick={() => navigate("/alerts")}
      >
        <User className="h-4 w-4 mr-2" />
        My Account
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/20 backdrop-blur-sm text-white border-white/30"
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