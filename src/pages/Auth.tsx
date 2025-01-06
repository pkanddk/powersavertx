import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthError } from '@supabase/supabase-js';

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error && error.message !== "Auth session missing!") {
          throw error;
        }
        
        if (user) {
          console.log("User already logged in, redirecting to home");
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        if (error instanceof AuthError) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Form submission handler for password validation
    const handleFormSubmit = async (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (!form || !form.matches('form')) return;
      
      const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
      if (!passwordInput) return;

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

    document.addEventListener('submit', handleFormSubmit, true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in, redirecting to home");
        navigate("/");
      }
    });

    // Listen for Supabase auth errors
    const handleAuthError = (event: CustomEvent) => {
      const error = event.detail?.error;
      if (!error) return;
      
      console.error("Auth error:", error);
      
      if (error?.message?.includes("Invalid login credentials")) {
        setError("Invalid email or password");
        toast({
          title: "Authentication Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
      } else if (error?.message?.includes("User already registered")) {
        setError("An account with this email already exists");
        toast({
          title: "Authentication Error",
          description: "An account with this email already exists",
          variant: "destructive",
        });
      } else if (error?.message) {
        setError(error.message);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    window.addEventListener('supabase.auth.error', handleAuthError as EventListener);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('submit', handleFormSubmit, true);
      window.removeEventListener('supabase.auth.error', handleAuthError as EventListener);
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <AuthContainer>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <AuthForm error={error} />
    </AuthContainer>
  );
}