import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useState } from "react";
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
import { useAuthState } from "@/hooks/useAuthState";

function App() {
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);
  const [estimatedUse, setEstimatedUse] = useState("500");
  const { user, isLoading } = useAuthState();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to sign out. Please try again.",
          variant: "destructive",
        });
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
              <Link to="/">
                <Button variant="link">Home</Button>
              </Link>
              <Link to="/faq">
                <Button variant="link">FAQ</Button>
              </Link>
              {user && (
                <Link to="/alerts">
                  <Button variant="link">Alerts</Button>
                </Link>
              )}
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
                <Link to="/auth">
                  <Button variant="default" size="sm">
                    Sign in
                  </Button>
                </Link>
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