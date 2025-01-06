import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { AuthError } from '@supabase/supabase-js';

interface AuthFormProps {
  error: string | null;
}

export function AuthForm({ error }: AuthFormProps) {
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(error);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthForm] Auth state change event:", event);
      
      if (event === 'SIGNED_IN') {
        if (session) {
          console.log("[AuthForm] User signed in successfully");
          setAuthError(null);
        }
      } else if (event === 'USER_UPDATED') {
        console.log("[AuthForm] User updated");
      }
    });

    // Create a custom error handler for Supabase auth errors
    const handleAuthError = (error: AuthError) => {
      console.error("[AuthForm] Auth error:", error);
      
      // Map technical error messages to user-friendly ones
      let userMessage = "An error occurred during sign in. Please try again.";
      
      if (error.message?.includes("invalid_credentials") || error.message?.includes("Invalid login credentials")) {
        userMessage = "The email or password you entered is incorrect. Please try again.";
      } else if (error.message?.includes("Email not confirmed")) {
        userMessage = "Please verify your email address before signing in.";
      } else if (error.message?.includes("rate limit")) {
        userMessage = "Too many sign in attempts. Please wait a moment and try again.";
      } else if (error.message?.includes("User already registered")) {
        userMessage = "An account with this email already exists. Please sign in instead.";
      } else if (error.message?.includes("Password should be at least 6 characters")) {
        userMessage = "Your password must be at least 6 characters long.";
      }
      
      setAuthError(userMessage);
      toast({
        variant: "destructive",
        title: "Sign In Error",
        description: userMessage,
      });
    };

    // Listen for auth errors through custom events
    const handleAuthEvent = (event: CustomEvent<{ error: AuthError }>) => {
      if (event.detail?.error) {
        handleAuthError(event.detail.error);
      }
    };

    window.addEventListener('supabase.auth.error', handleAuthEvent as EventListener);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('supabase.auth.error', handleAuthEvent as EventListener);
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