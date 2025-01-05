import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Compare from "./pages/Compare";
import Alerts from "./pages/Alerts";
import FAQ from "./pages/FAQ";
import { useState } from "react";
import { Plan } from "./lib/api";
import { Toaster } from "./components/ui/toaster";
import { AuthSidebar } from "./components/auth/AuthSidebar";
import { Footer } from "./components/Footer";
import Pricing from "./pages/Pricing";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuthState } from "./hooks/useAuthState";

function App() {
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);
  const [estimatedUse, setEstimatedUse] = useState("500"); // Default to 500 kWh
  const { isLoading } = useAuthState();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <AuthSidebar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Index onSearch={handleSearch} />} />
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
                <ProtectedRoute>
                  <Compare
                    plans={comparedPlans}
                    onRemove={handleCompare}
                    estimatedUse={estimatedUse}
                  />
                </ProtectedRoute>
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