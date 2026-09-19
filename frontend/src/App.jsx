import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CalendarProvider } from './context/CalendarContext';
import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import ContentCalendar from './pages/ContentCalendar';
import BrandProfile from './pages/BrandProfile';
import AiGeneratorPage from './pages/AiGeneratorPage';
import Analytics from './pages/Analytics';

// Protected Workspace wrapper
const ProtectedWorkspace = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-sm font-semibold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <span>Loading PostWise-AI Workspace...</span>
        </div>
      </div>
    );
  }

  // If not logged in, we still permit demo access or redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
};

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <AuthProvider>
          <CalendarProvider>
            <Routes>
              {/* Public Marketing & Auth Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginRegister />} />
              <Route path="/register" element={<LoginRegister />} />

              {/* Authenticated Workspace App Layout */}
              <Route element={<ProtectedWorkspace />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calendar" element={<ContentCalendar />} />
                <Route path="/generate" element={<AiGeneratorPage />} />
                <Route path="/brand" element={<BrandProfile />} />
                <Route path="/analytics" element={<Analytics />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CalendarProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
