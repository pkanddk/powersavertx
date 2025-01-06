import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthError } from '@supabase/supabase-js';

interface AuthPageProps {
  mode: "sign_in" | "sign_up";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("[Auth] Mode:", mode);
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        // Only redirect if we have a valid user object
        if (user && user.id) {
          console.log("[Auth] User already logged in, redirecting to home");
          navigate("/");
        }
      } catch (error) {
        console.error("[Auth] Error checking user:", error);
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
      console.log("[Auth] Auth state change event:", event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("[Auth] User signed in, redirecting to home");
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
      <AuthForm mode={mode} error={error} />
    </AuthContainer>
  );
}