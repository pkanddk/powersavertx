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
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthStateChange = async (event: string, session: any) => {
      console.log("Auth state change event:", event);
      console.log("Session state:", session);
      
      if (event === "SIGNED_IN") {
        console.log("User signed in successfully");
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
      } else if (event === "USER_UPDATED") {
        console.log("User updated");
      } else if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery initiated");
      }

      // Handle authentication errors
      if (session?.error) {
        console.error("Authentication error details:", {
          message: session.error.message,
          status: session.error.status,
          name: session.error.name,
          stack: session.error.stack
        });
        
        let errorMessage = "An unexpected error occurred";
        
        if (session.error instanceof AuthError) {
          const errorBody = session.error.message;
          console.log("Error details:", errorBody);
          
          if (errorBody.includes('failed to call url')) {
            errorMessage = "Unable to connect to the authentication service. Please check if you have a stable internet connection and try again. If the issue persists, the service might be temporarily unavailable.";
          } else if (errorBody.includes('Invalid login credentials')) {
            errorMessage = "Invalid email or password. Please check your credentials and try again.";
          } else if (errorBody.includes('Email not confirmed')) {
            errorMessage = "Please verify your email address before signing in.";
          } else if (errorBody.includes('Password should be at least 6 characters')) {
            errorMessage = "Password must be at least 6 characters long.";
          } else if (errorBody.includes('Invalid email')) {
            errorMessage = "Please enter a valid email address.";
          } else {
            errorMessage = session.error.message;
          }
        }
        
        console.log("Setting error message:", errorMessage);
        setAuthError(errorMessage);
        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    // Test Supabase connection
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase connection error:", error);
          const errorMessage = "Unable to connect to authentication service. Please try again later.";
          setAuthError(errorMessage);
          toast({
            title: "Connection Error",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          console.log("Supabase connection successful:", data);
        }
      } catch (err) {
        console.error("Failed to test Supabase connection:", err);
        const errorMessage = "Unable to establish connection with authentication service.";
        setAuthError(errorMessage);
        toast({
          title: "Connection Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    testConnection();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
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
          Password must be at least 6 characters long
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