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

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);
  const [estimatedUse, setEstimatedUse] = useState("500");

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
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Index onSearch={handleSearch} />} />
            <Route path="/auth" element={<Auth />} />
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