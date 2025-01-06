import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/");
      }
    };

    checkUser();

    // Single form submission handler for password validation
    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (!form || !form.matches('form')) return;
      
      const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
      if (!passwordInput) return;

      console.log("Form submit handler - Password length:", passwordInput.value.length);

      if (passwordInput.value.length < 6) {
        event.preventDefault();
        event.stopPropagation();
        
        passwordInput.value = '';
        passwordInput.focus();
        
        const message = "Password must be at least 6 characters long";
        setError(message);
        toast({
          title: "Invalid Password",
          description: message,
          variant: "destructive",
        });
        
        return false;
      }
      
      setError(null);
    };

    // Add form submit handler
    document.addEventListener('submit', handleFormSubmit, true);

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'SIGNED_IN') {
        navigate("/");
      } else if (event === 'PASSWORD_RECOVERY') {
        setError("Please check your email to reset your password.");
      } else if (event === 'USER_UPDATED' || event === 'SIGNED_OUT') {
        setError(null);
      } else if (event === 'USER_DELETED') {
        setError(null);
      }

      // Handle authentication errors
      if (event === 'SIGNED_UP' && !session) {
        const message = "This email is already registered. Please sign in instead.";
        setError(message);
        toast({
          title: "Account Exists",
          description: message,
          variant: "destructive",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('submit', handleFormSubmit, true);
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Power Saver TX
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access premium features and price alerts
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-700">
            Password must be at least 6 characters long
          </AlertDescription>
        </Alert>

        <SupabaseAuth
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
              button: {
                borderRadius: '0.375rem',
              },
              input: {
                borderRadius: '0.375rem',
              },
              message: {
                color: 'rgb(239 68 68)',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
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
      </Card>
    </div>
  );
}