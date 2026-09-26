import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import TemplatesPage from './pages/TemplatesPage';
import TemplatePreviewPage from './pages/TemplatePreviewPage';
import DashboardPage from './pages/DashboardPage';
import CreatePage from './pages/CreatePage';
import EditorPage from './pages/EditorPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import AdminTemplatesPage from './pages/AdminTemplatesPage';
import AdminTemplateNewPage from './pages/AdminTemplateNewPage';
import AdminTemplateEditPage from './pages/AdminTemplateEditPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import PricingPage from './pages/PricingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';
import CookieConsent from './components/common/CookieConsent';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CookieConsent />
        <Analytics />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/templates/:id" element={<TemplatePreviewPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-in" element={<LoginPage />} />

          {/* Product */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/editor/:projectId" element={<EditorPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/templates" element={<AdminTemplatesPage />} />
          <Route path="/admin/templates/new" element={<AdminTemplateNewPage />} />
          <Route path="/admin/templates/:id" element={<AdminTemplateEditPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />

          {/* Fallback Custom 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
