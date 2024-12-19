interface PlanDetailsProps {
  details: string;
  timeofuse?: boolean;
  pricingDetails?: string | null;
  tduProvider?: string | null;
}

export function PlanDetails({ details, timeofuse, pricingDetails, tduProvider }: PlanDetailsProps) {
  return (
    <div className="space-y-2 text-sm">
      {timeofuse && (
        <div className="font-medium text-blue-600">
          Time of Use Plan
        </div>
      )}
      {details && (
        <p className="text-muted-foreground">
          {details}
        </p>
      )}
      {pricingDetails && (
        <p className="text-muted-foreground">
          {pricingDetails}
        </p>
      )}
      {tduProvider && (
        <p className="text-xs text-muted-foreground">
          TDU Provider: {tduProvider}
        </p>
      )}
    </div>
  );
}