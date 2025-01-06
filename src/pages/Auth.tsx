import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthState } from "@/hooks/useAuthState";

interface AuthPageProps {
  mode: "sign_in" | "sign_up";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuthState();

  useEffect(() => {
    console.log("[Auth] Mode:", mode);
    console.log("[Auth] Current user:", user);

    // Only redirect if we have a valid authenticated user
    if (!isLoading && user) {
      console.log("[Auth] User already authenticated, redirecting to home");
      toast({
        title: "Already signed in",
        description: "You are already signed in to your account.",
      });
      navigate("/");
    }
  }, [user, isLoading, navigate, toast, mode]);

  // Don't render anything while checking auth state
  if (isLoading) {
    return (
      <AuthContainer>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthContainer>
    );
  }

  // Only render the form if user is not authenticated
  if (!user) {
    return (
      <AuthContainer>
        <AuthForm mode={mode} error={null} />
      </AuthContainer>
    );
  }

  return null;
}