import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from '@supabase/supabase-js';

export function useAuthState() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error && error.message !== "Auth session missing!") {
          throw error;
        }
        console.log("useAuthState - Current user:", user);
        setUser(user);
      } catch (error) {
        if (error instanceof AuthError && error.message !== "Auth session missing!") {
          console.error('Error checking user:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("useAuthState - Auth state change:", event, session);
      
      switch (event) {
        case 'SIGNED_IN':
          setUser(session?.user ?? null);
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
          break;
        case 'SIGNED_OUT':
          setUser(null);
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
          break;
        case 'USER_UPDATED':
          setUser(session?.user ?? null);
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return { user, isLoading, setUser };
}