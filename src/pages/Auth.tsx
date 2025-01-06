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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in, redirecting to home");
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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