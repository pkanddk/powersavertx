interface PlanTitleProps {
  planName: string;
  companyName: string;
  companyTduName?: string | null;
}

export function PlanTitle({ planName, companyName, companyTduName }: PlanTitleProps) {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold">{planName}</h3>
      <p className="text-sm text-muted-foreground">{companyName}</p>
      {companyTduName && (
        <p className="text-xs text-muted-foreground">TDU: {companyTduName}</p>
      )}
    </div>
  );
}