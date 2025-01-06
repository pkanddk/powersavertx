import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Plan } from "@/lib/api";
import Pricing from "@/pages/Pricing";
import Compare from "@/pages/Compare";
import Auth from "@/pages/Auth";
import FAQ from "@/pages/FAQ";
import ManageAlerts from "@/pages/ManageAlerts";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Footer } from "@/components/Footer";
import { AuthMenu } from "@/components/auth/AuthMenu";

export default function App() {
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [searchParams, setSearchParams] = useState<{
    zipCode: string;
    estimatedUse: string;
  } | null>(null);

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[App] Handling search with:", { zipCode, estimatedUse });
    setSearchParams({ zipCode, estimatedUse });
  };

  const handleAddPlan = (plan: Plan) => {
    setSelectedPlans(prev => [...prev, plan]);
  };

  const handleRemovePlan = (plan: Plan) => {
    setSelectedPlans(prev => prev.filter(p => p.company_id !== plan.company_id));
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="absolute top-4 right-4 z-50">
          <AuthMenu />
        </div>
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={
                <Pricing 
                  onSearch={handleSearch}
                  onCompare={handleAddPlan}
                  comparedPlans={selectedPlans}
                  search={searchParams}
                  estimatedUse={searchParams?.estimatedUse || "1000"}
                />
              } 
            />
            <Route 
              path="/pricing" 
              element={
                <Navigate to="/" replace />
              }
            />
            <Route 
              path="/compare" 
              element={
                <Compare 
                  plans={selectedPlans}
                  onRemove={handleRemovePlan}
                  estimatedUse={searchParams?.estimatedUse || "1000"}
                />
              } 
            />
            <Route path="/login" element={<Auth mode="sign_in" />} />
            <Route path="/signup" element={<Auth mode="sign_up" />} />
            <Route path="/faq" element={<FAQ />} />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <ManageAlerts />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Router>
  );
}