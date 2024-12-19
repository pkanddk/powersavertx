import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import { ComparePage } from "@/pages/Compare";
import { useState } from "react";
import { Plan } from "./lib/api";

const queryClient = new QueryClient();

function App() {
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);

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

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Index 
                comparedPlans={comparedPlans} 
                onCompare={handleCompare} 
                estimatedUse="1000"
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
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;