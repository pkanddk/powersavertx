import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { ProfileForm } from "./ProfileForm";

const MAX_LOGIN_ATTEMPTS = 3;
const LOGIN_ATTEMPT_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

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
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
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
        <SheetHeader>
          <SheetTitle className="text-left">
            <div className="flex items-center gap-2">
              <img
                src="/lovable-uploads/744a7305-260a-491c-bf1a-b65c96416fdf.png"
                alt="Power Saver TX Logo"
                className="h-10 w-10"
              />
              <span>Power Saver TX</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Beta
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          {session ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Profile Settings
                </h2>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
              <ProfileForm />
            </div>
          ) : (
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
                className: {
                  message: 'text-red-500',
                  button: 'bg-primary hover:bg-primary/90',
                  container: 'space-y-4',
                  label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                  input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
              magicLink={true}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Email',
                    password_label: 'Password',
                    email_input_placeholder: 'Your email address',
                    password_input_placeholder: 'Your password',
                    button_label: 'Sign In',
                    loading_button_label: 'Signing in...',
                    social_provider_text: 'Sign in with {{provider}}',
                    link_text: "Don't have an account? Sign up",
                  },
                  sign_up: {
                    email_label: 'Email',
                    password_label: 'Password',
                    email_input_placeholder: 'Your email address',
                    password_input_placeholder: 'Create a strong password',
                    button_label: 'Sign Up',
                    loading_button_label: 'Signing up...',
                    social_provider_text: 'Sign up with {{provider}}',
                    link_text: "Already have an account? Sign in",
                    confirmation_text: 'Check your email for the confirmation link',
                  },
                },
              }}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}