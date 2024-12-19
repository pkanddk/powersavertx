import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Compare from "./pages/Compare";
import Alerts from "./pages/Alerts";
import { useState } from "react";
import { Plan } from "./lib/api";
import { Toaster } from "./components/ui/toaster";
import { AuthSidebar } from "./components/auth/AuthSidebar";

function App() {
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);
  const [estimatedUse, setEstimatedUse] = useState("1000");

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
    setSearch({ zipCode, estimatedUse });
    setEstimatedUse(estimatedUse);
  };

  return (
    <Router>
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
              estimatedUse={estimatedUse}
            />
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
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;