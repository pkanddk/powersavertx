import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface AuthFormProps {
  error: string | null;
}

export function AuthForm({ error }: AuthFormProps) {
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(error);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log("[AuthForm] User signed in successfully");
        setAuthError(null);
      }
    });

    const handleAuthError = (error: any) => {
      console.log("[AuthForm] Handling auth error:", error);
      
      let errorMessage = "Please check your email and password.";
      
      if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please check your email and click the verification link to sign in.";
      }
      else if (error.message?.includes("rate limit")) {
        errorMessage = "Please wait a few minutes before trying again.";
      }
      else if (error.message?.includes("already registered")) {
        errorMessage = "This email is already registered. Please sign in instead.";
      }
      else if (error.message?.includes("Password")) {
        errorMessage = "Password must be at least 6 characters.";
      }
      else if (error.message?.includes("body stream") || 
               error.message?.includes("json")) {
        errorMessage = "Please refresh the page and try again.";
      }
      else if (error.message?.includes("Invalid login credentials") || 
               error.status === 400) {
        errorMessage = "Incorrect email or password.";
      }
      
      console.log("[AuthForm] Setting user-friendly error:", errorMessage);
      setAuthError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Unable to sign in",
        description: errorMessage,
      });
    };

    window.addEventListener('supabase.auth.error', (event: any) => {
      if (event.detail?.error) {
        handleAuthError(event.detail.error);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('supabase.auth.error', handleAuthError);
    };
  }, [toast]);

  return (
    <>
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="font-medium">
            {authError}
          </AlertDescription>
        </Alert>
      )}

      <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-700 font-medium">
          Enter your email and password to sign in
        </AlertDescription>
      </Alert>

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#7C3AED',
                brandAccent: '#6D28D9',
              }
            }
          },
          style: {
            button: { borderRadius: '0.375rem' },
            input: { borderRadius: '0.375rem' },
            message: {
              color: 'rgb(239 68 68)',
              fontSize: '0.875rem',
              marginTop: '0.5rem',
              fontWeight: '500'
            }
          }
        }}
        providers={[]}
        redirectTo={window.location.origin}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              email_input_placeholder: 'Your email address',
              password_input_placeholder: 'Your password',
              button_label: 'Sign in',
              loading_button_label: 'Signing in ...',
              social_provider_text: 'Sign in with {{provider}}',
              link_text: 'Already have an account? Sign in',
            },
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              email_input_placeholder: 'Your email address',
              password_input_placeholder: 'Your password (min 6 characters)',
              button_label: 'Sign up',
              loading_button_label: 'Signing up ...',
              social_provider_text: 'Sign up with {{provider}}',
              link_text: "Don't have an account? Sign up",
              confirmation_text: 'Check your email for the confirmation link',
            },
          },
        }}
      />
    </>
  );
}