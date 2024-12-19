import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import { ComparePage } from "@/pages/Compare";
import { useState, useEffect } from "react";
import { Plan } from "./lib/api";
import { AuthSidebar } from "./components/auth/AuthSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient();

function App() {
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);
  const { toast } = useToast();

  // Effect to load user profile when session changes
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log("[App] User is logged in, fetching profile");
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('zip_code, current_kwh_usage')
            .eq('user_id', session.user.id)
            .single();

          if (error) throw error;

          if (profile?.zip_code || profile?.current_kwh_usage) {
            console.log("[App] Found user profile:", profile);
            setSearch({
              zipCode: profile.zip_code || '',
              estimatedUse: profile.current_kwh_usage || '1000'
            });
          }
        }
      } catch (error: any) {
        console.error("[App] Error loading user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile settings",
          variant: "destructive",
        });
      }
    };

    loadUserProfile();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[App] Auth state changed:", event);
      if (event === 'SIGNED_OUT') {
        // Clear search state when user signs out
        setSearch(null);
      } else if (event === 'SIGNED_IN' && session) {
        // Load profile when user signs in
        loadUserProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleCompare = (plan: Plan) => {
    setComparedPlans(prevPlans => {
      const isPlanCompared = prevPlans.some(p => p.company_id === plan.company_id);
      return isPlanCompared
        ? prevPlans.filter(p => p.company_id !== plan.company_id)
        : prevPlans.length < 3
        ? [...prevPlans, plan]
        : prevPlans;
    });
  };

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[App] Setting search:", { zipCode, estimatedUse });
    setSearch({ zipCode, estimatedUse });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthSidebar />
        <Routes>
          <Route 
            path="/" 
            element={
              <Index 
                comparedPlans={comparedPlans} 
                onCompare={handleCompare}
                search={search}
                onSearch={handleSearch}
                estimatedUse={search?.estimatedUse || "1000"}
              />
            } 
          />
          <Route 
            path="/compare" 
            element={
              <ComparePage 
                plans={comparedPlans} 
                onRemove={handleCompare} 
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;