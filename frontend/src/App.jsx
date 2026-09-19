import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import BrandProfile from './pages/BrandProfile';
import ContentCalendar from './pages/ContentCalendar';

import AiGenerateModal from './components/AiGenerateModal';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: '1.1rem',
          fontWeight: 600,
        }}
      >
        Initializing PostWise-AI...
      </div>
    );
  }

  if (!user) {
    return <LoginRegister />;
  }

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleSelectCalendar = (cal) => {
    setSelectedCalendarId(cal._id);
    setCurrentPage('calendar');
  };

  const handleCalendarGenerated = (calendar, posts) => {
    setSelectedCalendarId(calendar._id);
    setCurrentPage('calendar');
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar
          onOpenAiGenerator={() => setIsAiModalOpen(true)}
          onNavigate={handleNavigate}
        />

        <main style={{ flex: 1 }}>
          {currentPage === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              onOpenAiGenerator={() => setIsAiModalOpen(true)}
              onSelectCalendar={handleSelectCalendar}
            />
          )}

          {currentPage === 'brands' && <BrandProfile />}

          {currentPage === 'calendar' && (
            <ContentCalendar
              selectedCalendarId={selectedCalendarId}
              onOpenAiGenerator={() => setIsAiModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* AI Generator Modal Wizard */}
      <AiGenerateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerated={handleCalendarGenerated}
      />

      {/* Global Toast Alerts */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
