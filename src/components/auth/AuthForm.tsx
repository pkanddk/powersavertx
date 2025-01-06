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

    // Handle auth errors before they propagate
    const handleAuthError = (error: any) => {
      console.error("[AuthForm] Auth error:", error);
      
      let userMessage = "";
      
      try {
        // First try to parse the error.message if it's JSON
        if (typeof error.message === 'string' && error.message.includes('{')) {
          const parsedError = JSON.parse(error.message);
          console.log("[AuthForm] Parsed error:", parsedError);
          
          if (parsedError.message === "Invalid login credentials") {
            userMessage = "The email or password you entered is incorrect. Please double-check and try again.";
          }
        } else if (error instanceof AuthError) {
          // Handle AuthError instances
          if (error.message.includes("Invalid login credentials")) {
            userMessage = "The email or password you entered is incorrect. Please double-check and try again.";
          } else if (error.message.includes("Email not confirmed")) {
            userMessage = "Please verify your email address. Check your inbox for a verification link.";
          } else if (error.message.includes("rate limit")) {
            userMessage = "Too many attempts. Please wait a moment before trying again.";
          } else if (error.message.includes("registered")) {
            userMessage = "This email is already registered. Please sign in instead.";
          } else if (error.message.includes("Password")) {
            userMessage = "Password must be at least 6 characters long.";
          }
        } else if (error.status === 400) {
          // Handle HTTP 400 errors
          try {
            const errorBody = JSON.parse(error.body);
            if (errorBody.code === "invalid_credentials") {
              userMessage = "The email or password you entered is incorrect. Please double-check and try again.";
            }
          } catch {
            userMessage = "Invalid login attempt. Please check your credentials.";
          }
        }
      } catch (parseError) {
        console.error("[AuthForm] Error parsing error message:", parseError);
      }

      // If no specific message was set, use a fallback
      if (!userMessage) {
        if (error.message?.includes("body stream already read")) {
          userMessage = "Please refresh the page and try again. This error occurs when the page has been open too long.";
        } else {
          userMessage = "Authentication failed. Please check your credentials and try again. If this persists, try refreshing the page.";
        }
      }
      
      console.log("[AuthForm] Setting error message:", userMessage);
      setAuthError(userMessage);
      toast({
        variant: "destructive",
        title: "Sign In Error",
        description: userMessage,
      });
    };

    // Listen for auth errors
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