import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthError, AuthChangeEvent } from '@supabase/supabase-js';

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Current user:", user);
        if (user) {
          console.log("User already logged in, redirecting to home");
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Form submission handler for password validation
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in, redirecting to home");
        navigate("/");
      } else if (event === 'PASSWORD_RECOVERY') {
        setError("Please check your email to reset your password.");
      } else if (event === 'USER_UPDATED' || event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    // Handle auth errors through a separate listener
    const handleAuthError = async (error: AuthError) => {
      console.error("Auth error:", error);
      
      if (error.message.includes("already registered")) {
        const message = "This email is already registered. Please sign in instead.";
        setError(message);
        toast({
          title: "Account Exists",
          description: message,
          variant: "destructive",
        });
      } else if (error.message.includes("Invalid login credentials")) {
        const message = "Invalid email or password. Please try again.";
        setError(message);
        toast({
          title: "Login Failed",
          description: message,
          variant: "destructive",
        });
      } else {
        setError(error.message);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('submit', handleFormSubmit, true);
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