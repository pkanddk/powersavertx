import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("[Auth] User already logged in, redirecting to home");
        navigate("/");
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[Auth] Auth state changed:", event);
      if (session) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </div>

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Premium Features</h1>
          <p className="text-muted-foreground">
            Sign up to unlock premium features:
          </p>
          <ul className="text-left space-y-2 text-sm">
            <li className="flex items-center">
              ✓ Compare up to 3 plans side by side
            </li>
            <li className="flex items-center">
              ✓ Save your favorite plans
            </li>
            <li className="flex items-center">
              ✓ Get price alerts
            </li>
          </ul>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#6366f1',
                  brandAccent: '#4f46e5',
                }
              }
            },
            className: {
              container: 'space-y-4',
              button: 'w-full',
              input: 'rounded-md',
            }
          }}
          providers={[]}
          theme="light"
        />
      </Card>
    </div>
  );
}