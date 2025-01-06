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
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session) {
            console.log("User signed in successfully");
            setAuthError(null);
          }
          break;
        case 'USER_DELETED':
        case 'SIGNED_OUT':
          console.log("Auth event:", event);
          break;
        case 'PASSWORD_RECOVERY':
          console.log("Password recovery initiated");
          break;
      }
    });

    // Set up error handling for auth events
    const handleAuthError = (error: Error) => {
      console.log("Auth error:", error);
      let errorMessage = "An error occurred during authentication";
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Please confirm your email address";
      } else if (error.message.includes('Password should be')) {
        errorMessage = "Password should be at least 6 characters long";
      } else if (error.message.includes('User already registered')) {
        errorMessage = "This email is already registered";
      }
      
      setAuthError(errorMessage);
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    // Subscribe to auth errors
    const authErrorSubscription = supabase.auth.onError(handleAuthError);

    return () => {
      subscription.unsubscribe();
      authErrorSubscription.unsubscribe();
    };
  }, [toast]);

  return (
    <>
      {(error || authError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="font-medium">
            {error || authError}
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