import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import { ComparePage } from "@/pages/Compare";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Plan } from "./lib/api";

const queryClient = new QueryClient();

function App() {
  console.log("[App] Component rendering");
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);

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
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Index is the default landing page */}
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
              {/* Protected compare route - shows auth UI inline when needed */}
              <Route 
                path="/compare" 
                element={
                  <RequireAuth>
                    <ComparePage 
                      plans={comparedPlans} 
                      onRemove={handleCompare} 
                    />
                  </RequireAuth>
                } 
              />
            </Routes>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;