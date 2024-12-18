import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plan } from "@/lib/api";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface PlanComparisonTableProps {
  plans: Plan[];
}

export function PlanComparisonTable({ plans }: PlanComparisonTableProps) {
  const [showAllFields, setShowAllFields] = useState(false);
  const [showPricing, setShowPricing] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showRatings, setShowRatings] = useState(true);

  const renderPricingSection = () => (
    <>
      <TableRow>
        <TableCell className="font-medium bg-muted">500 kWh Price</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-500`}>
            {formatPrice(plan.price_kwh500)}/kWh
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell className="font-medium bg-muted">1000 kWh Price</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-1000`}>
            {formatPrice(plan.price_kwh1000)}/kWh
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell className="font-medium bg-muted">2000 kWh Price</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-2000`}>
            {formatPrice(plan.price_kwh2000)}/kWh
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell className="font-medium bg-muted">Base Charge</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-base`}>
            {plan.base_charge ? `$${plan.base_charge}/month` : 'None'}
          </TableCell>
        ))}
      </TableRow>
    </>
  );

  const renderFeaturesSection = () => (
    <>
      <TableRow>
        <TableCell className="font-medium bg-muted">Contract Length</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-length`}>
            {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell className="font-medium bg-muted">Plan Type</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-type`}>
            {plan.plan_type_name}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell className="font-medium bg-muted">Minimum Usage</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-min-usage`}>
            {plan.minimum_usage ? 'Yes' : 'No'}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell className="font-medium bg-muted">New Customers Only</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-new-customer`}>
            {plan.new_customer ? 'Yes' : 'No'}
          </TableCell>
        ))}
      </TableRow>
      {showAllFields && (
        <TableRow>
          <TableCell className="font-medium bg-muted">Plan Details</TableCell>
          {plans.map(plan => (
            <TableCell key={`${plan.company_id}-details`} className="whitespace-pre-wrap">
              {plan.plan_details || 'No additional details'}
            </TableCell>
          ))}
        </TableRow>
      )}
    </>
  );

  const renderRatingsSection = () => (
    <>
      <TableRow>
        <TableCell className="font-medium bg-muted">JD Power Rating</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-rating`}>
            {plan.jdp_rating ? (
              <span>
                {plan.jdp_rating}/5 
                {plan.jdp_rating_year && ` (${plan.jdp_rating_year})`}
              </span>
            ) : 'Not rated'}
          </TableCell>
        ))}
      </TableRow>
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={showPricing ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPricing(!showPricing)}
        >
          Pricing Details
        </Button>
        <Button
          variant={showFeatures ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFeatures(!showFeatures)}
        >
          Plan Features
        </Button>
        <Button
          variant={showRatings ? "default" : "outline"}
          size="sm"
          onClick={() => setShowRatings(!showRatings)}
        >
          Ratings
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllFields(!showAllFields)}
        >
          {showAllFields ? "Show Less" : "Show More Details"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Feature</TableHead>
            {plans.map(plan => (
              <TableHead key={plan.company_id}>
                <div className="space-y-1">
                  <div>{plan.plan_name}</div>
                  <Badge variant="outline">{plan.company_name}</Badge>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {showPricing && renderPricingSection()}
          {showFeatures && renderFeaturesSection()}
          {showRatings && renderRatingsSection()}
        </TableBody>
      </Table>
    </div>
  );
}