import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function AuthSidebar() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setOpen(false);
      navigate("/");
    }
  };

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
        <SheetHeader>
          <SheetTitle className="text-left">
            <div className="flex items-center gap-2">
              <img
                src="/lovable-uploads/f5d9d82f-2512-4bcd-96fe-aeca04160865.png"
                alt="Logo"
                className="h-8 w-8"
              />
              <span>Energy Price Comparator</span>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(147, 51, 234)',
                    brandAccent: 'rgb(126, 34, 206)',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}