import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Alerts from '@/pages/Alerts';
import ProfileFormContent from '@/components/auth/profile/ProfileFormContent';
import ProfileFormProvider from '@/components/auth/profile/ProfileFormProvider';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Compare from '@/pages/Compare';
import FAQ from '@/pages/FAQ';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <header className="bg-gray-800 text-white p-4">
            <h1 className="text-xl">My App</h1>
          </header>
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
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
              <Route path="/compare" element={<Compare />} />
            </Routes>
          </main>
          
          <footer className="bg-gray-800 text-white p-4">
            <p>&copy; 2023 My App</p>
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
