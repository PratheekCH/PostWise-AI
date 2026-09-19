import React from 'react';
import { LayoutDashboard, Building2, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ currentPage, onNavigate }) => {
  const { activeBrand } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'brands', label: 'Brand Profile', icon: <Building2 size={20} /> },
    { id: 'calendar', label: 'Content Calendar', icon: <Calendar size={20} /> },
  ];

  return (
    <aside
      style={{
        width: '240px',
        background: 'rgba(15, 23, 42, 0.65)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 'calc(100vh - 65px)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Navigation
        </div>

        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.15))' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ color: isActive ? '#6366f1' : '#94a3b8' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Brand Card in Sidebar */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Sparkles size={16} color="#ec4899" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase' }}>
            Active Brand Context
          </span>
        </div>
        {activeBrand ? (
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{activeBrand.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.1rem' }}>Tone: {activeBrand.tone}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
              {(activeBrand.platforms || []).map((p) => (
                <span
                  key={p}
                  style={{
                    fontSize: '0.68rem',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#cbd5e1',
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            No brand selected. Click Brand Profile to configure.
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
