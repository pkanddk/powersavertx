import { Button } from "@/components/ui/button";
import { PlanComparisonTable } from "@/components/PlanComparisonTable";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Plan } from "@/lib/api";

interface ComparePageProps {
  plans: Plan[];
  onRemove: (plan: Plan) => void;
  estimatedUse: string;
}

export default function ComparePage({ plans, onRemove, estimatedUse }: ComparePageProps) {
  const navigate = useNavigate();

  if (plans.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold">
                Comparing {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'}
              </h1>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm animate-fade-in">
            <PlanComparisonTable plans={plans} />
          </div>
        </div>
      </main>
    </div>
  );
}