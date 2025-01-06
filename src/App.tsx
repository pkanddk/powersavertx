import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Plan } from "./lib/api";
import { Toaster } from "./components/ui/toaster";
import { Footer } from "./components/Footer";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Compare from "./pages/Compare";
import Alerts from "./pages/Alerts";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import { Button } from "./components/ui/button";
import { useToast } from "./hooks/use-toast";
import { LogOut, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthError } from '@supabase/supabase-js';

function App() {
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);
  const [estimatedUse, setEstimatedUse] = useState("500");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error checking user:', error);
          if (error instanceof AuthError) {
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }
        console.log("App - Current user:", user);
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
        if (error instanceof AuthError) {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "System Error",
            description: "Failed to check authentication status",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("App - Auth state change:", event, session);
      
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
      } else if (event === 'AUTH_ERROR') {
        toast({
          title: "Authentication Error",
          description: "Please check your credentials and try again",
          variant: "destructive",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        if (error instanceof AuthError) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to sign out. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  const handleCompare = (plan: Plan) => {
    setComparedPlans((prev) => {
      const exists = prev.some((p) => p.plan_name === plan.plan_name && p.company_name === plan.company_name);
      if (exists) {
        return prev.filter((p) => p.plan_name !== plan.plan_name || p.company_name !== plan.company_name);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), plan];
      }
      return [...prev, plan];
    });
  };

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    try {
      console.log("[App] Handling search:", { zipCode, estimatedUse });
      setSearch({ zipCode, estimatedUse });
      setEstimatedUse(estimatedUse);
    } catch (error) {
      console.error("[App] Error in handleSearch:", error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <nav className="flex items-center space-x-4">
              <Button variant="link" onClick={() => window.location.href = "/"}>
                Home
              </Button>
              <Button variant="link" onClick={() => window.location.href = "/faq"}>
                FAQ
              </Button>
              <Button variant="link" onClick={() => window.location.href = "/alerts"}>
                Alerts
              </Button>
            </nav>
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => window.location.href = "/auth"}
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Index onSearch={handleSearch} />} />
            <Route path="/auth" element={
              user ? <Navigate to="/" replace /> : <Auth />
            } />
            <Route
              path="/pricing"
              element={
                search ? (
                  <Pricing
                    comparedPlans={comparedPlans}
                    onCompare={handleCompare}
                    search={search}
                    onSearch={handleSearch}
                    estimatedUse={estimatedUse}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/compare"
              element={
                <Compare
                  plans={comparedPlans}
                  onRemove={handleCompare}
                  estimatedUse={estimatedUse}
                />
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              }
            />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </div>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;