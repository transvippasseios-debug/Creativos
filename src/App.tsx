import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthGuard } from './components/AuthGuard';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { ClientsPage } from './pages/ClientsPage';
import { ClientDetailsPage } from './pages/ClientDetailsPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CampaignDetailsPage } from './pages/CampaignDetailsPage';
import { Dashboard } from './pages/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <AuthGuard>
                <Layout>
                  <Dashboard />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/dashboard" element={
              <AuthGuard>
                <Layout>
                  <Dashboard />
                </Layout>
              </AuthGuard>
            } />

          <Route path="/clients" element={
            <AuthGuard allowedRoles={['super_admin', 'admin', 'operator']}>
              <Layout>
                <ClientsPage />
              </Layout>
            </AuthGuard>
          } />

          <Route path="/clients/:id" element={
            <AuthGuard allowedRoles={['super_admin', 'admin', 'operator']}>
              <Layout>
                <ClientDetailsPage />
              </Layout>
            </AuthGuard>
          } />

          <Route path="/campaigns" element={
            <AuthGuard>
              <Layout>
                <CampaignsPage />
              </Layout>
            </AuthGuard>
          } />

          <Route path="/campaigns/:id" element={
            <AuthGuard>
              <Layout>
                <CampaignDetailsPage />
              </Layout>
            </AuthGuard>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
  );
}
