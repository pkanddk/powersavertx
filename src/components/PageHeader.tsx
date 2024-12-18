export function PageHeader({ lastUpdated }: { lastUpdated?: string }) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">Find the Best Energy Plan</h1>
      <p className="text-xl text-muted-foreground">
        Compare energy plans and prices in your area
      </p>
      {lastUpdated && (
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: {format(new Date(lastUpdated), 'PPpp')}
        </p>
      )}
    </div>
  );
}