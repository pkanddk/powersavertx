interface PlanTitleProps {
  planName: string;
  companyName: string;
}

export function PlanTitle({ planName, companyName }: PlanTitleProps) {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold">{planName}</h3>
      <p className="text-sm text-muted-foreground">{companyName}</p>
    </div>
  );
}