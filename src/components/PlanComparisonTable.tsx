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
import { ExternalLink } from "lucide-react";

interface PlanComparisonTableProps {
  plans: Plan[];
}

export function PlanComparisonTable({ plans }: PlanComparisonTableProps) {
  const [showAllFields, setShowAllFields] = useState(false);
  const [showPricing, setShowPricing] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showRatings, setShowRatings] = useState(true);
  const [showDocuments, setShowDocuments] = useState(false);

  const renderPricingSection = () => (
    <>
      <TableRow>
        <TableCell className="font-medium bg-muted">500 kWh Price</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-500`}>
            {formatPrice(plan.price_kwh500)}/kWh
            {plan.detail_kwh500 && (
              <div className="text-xs text-muted-foreground mt-1">
                {plan.detail_kwh500}
              </div>
            )}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell className="font-medium bg-muted">1000 kWh Price</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-1000`}>
            {formatPrice(plan.price_kwh1000)}/kWh
            {plan.detail_kwh1000 && (
              <div className="text-xs text-muted-foreground mt-1">
                {plan.detail_kwh1000}
              </div>
            )}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell className="font-medium bg-muted">2000 kWh Price</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-2000`}>
            {formatPrice(plan.price_kwh2000)}/kWh
            {plan.detail_kwh2000 && (
              <div className="text-xs text-muted-foreground mt-1">
                {plan.detail_kwh2000}
              </div>
            )}
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
      {showAllFields && (
        <TableRow>
          <TableCell className="font-medium bg-muted">Pricing Details</TableCell>
          {plans.map(plan => (
            <TableCell key={`${plan.company_id}-pricing-details`} className="whitespace-pre-wrap">
              {plan.pricing_details || 'No additional details'}
            </TableCell>
          ))}
        </TableRow>
      )}
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
        <TableCell className="font-medium bg-muted">Time of Use Plan</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-timeofuse`}>
            {plan.timeofuse ? 'Yes' : 'No'}
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
      <TableRow>
        <TableCell className="font-medium bg-muted">Renewable Percentage</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-renewable`}>
            {plan.renewable_percentage}%
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell className="font-medium bg-muted">TDU Provider</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-tdu`}>
            {plan.company_tdu_name || 'Not specified'}
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

  const renderDocumentsSection = () => (
    <>
      <TableRow>
        <TableCell className="font-medium bg-muted">Documents & Links</TableCell>
        {plans.map(plan => (
          <TableCell key={`${plan.company_id}-docs`} className="space-y-2">
            {plan.fact_sheet && (
              <a 
                href={plan.fact_sheet} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink size={14} />
                Fact Sheet
              </a>
            )}
            {plan.terms_of_service && (
              <a 
                href={plan.terms_of_service} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink size={14} />
                Terms of Service
              </a>
            )}
            {plan.yrac_url && (
              <a 
                href={plan.yrac_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink size={14} />
                Your Rights as a Customer
              </a>
            )}
            {plan.website && (
              <a 
                href={plan.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink size={14} />
                Provider Website
              </a>
            )}
            {plan.enroll_phone && (
              <div className="text-sm">
                Enrollment Phone: {plan.enroll_phone}
              </div>
            )}
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
          variant={showDocuments ? "default" : "outline"}
          size="sm"
          onClick={() => setShowDocuments(!showDocuments)}
        >
          Documents
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
          {showDocuments && renderDocumentsSection()}
        </TableBody>
      </Table>
    </div>
  );
}