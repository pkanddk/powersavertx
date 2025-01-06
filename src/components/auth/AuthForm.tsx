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
      if (event === 'SIGNED_IN') {
        if (session) {
          console.log("User signed in successfully");
          setAuthError(null);
        }
      }
    });

    // Listen for auth errors
    const handleAuthError = (event: CustomEvent) => {
      const error = event.detail?.error;
      if (error?.message) {
        console.log("Auth error:", error.message);
        setAuthError(error.message);
      }
    };

    window.addEventListener('supabase.auth.error', handleAuthError as EventListener);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('supabase.auth.error', handleAuthError as EventListener);
    };
  }, []);

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
        onError={(error) => {
          console.log("Auth error in onError:", error);
          if (error instanceof AuthError) {
            setAuthError(error.message);
          } else if (error instanceof Error) {
            setAuthError(error.message);
          } else {
            setAuthError("An unexpected error occurred");
          }
        }}
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