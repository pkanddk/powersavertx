import { Card } from "@/components/ui/card";

interface AuthContainerProps {
  children: React.ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Power Saver TX
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access premium features and price alerts
          </p>
        </div>
        {children}
      </Card>
    </div>
  );
}