import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Alerts from './pages/Alerts';
import { ProfileFormContent } from './components/auth/profile/ProfileFormContent';
import { ProfileFormProvider } from './components/auth/profile/ProfileFormProvider';
import Auth from './pages/Auth';
import Index from './pages/Index';
import Compare from './pages/Compare';
import FAQ from './pages/FAQ';
import { useForm } from 'react-hook-form';
import { ProfileFormData } from './components/auth/types';
import { useState } from 'react';
import { Plan } from './lib/api';
import { Footer } from './components/Footer';

const queryClient = new QueryClient();

export default function App() {
  const form = useForm<ProfileFormData>();
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [estimatedUse, setEstimatedUse] = useState('1000');

  const handleSearch = (zipCode: string, usage: string) => {
    setEstimatedUse(usage);
    // Implement search logic here
  };

  const handleRemovePlan = (plan: Plan) => {
    setSelectedPlans(prev => prev.filter(p => p.id !== plan.id));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <header className="bg-gray-800 text-white p-4">
            <h1 className="text-xl">Power Saver TX</h1>
          </header>
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index onSearch={handleSearch} />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/alerts" 
                element={
                  <ProtectedRoute>
                    <Alerts />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfileFormProvider form={form}>
                      <ProfileFormContent form={form} />
                    </ProfileFormProvider>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/compare" 
                element={
                  <Compare 
                    plans={selectedPlans}
                    onRemove={handleRemovePlan}
                    estimatedUse={estimatedUse}
                  />
                } 
              />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}