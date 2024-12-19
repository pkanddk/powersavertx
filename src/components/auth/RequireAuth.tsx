import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Sign in Required</h1>
            <p className="text-muted-foreground">
              Please sign in to access premium features:
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

  return <>{children}</>;
}