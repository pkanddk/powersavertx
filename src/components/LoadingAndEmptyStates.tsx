export function LoadingState() {
  return (
    <div className="text-center py-12">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
    </div>
  );
}

export function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-muted-foreground">
        {hasSearch 
          ? "No plans found for this ZIP code. Please try another ZIP code."
          : "Enter your ZIP code to find available plans in your area."}
      </p>
    </div>
  );
}