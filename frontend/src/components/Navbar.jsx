import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Calendar, User, LogOut, ChevronDown, PlusCircle, Building2 } from 'lucide-react';

const Navbar = ({ onOpenAiGenerator, onNavigate }) => {
  const { user, logout, brands, activeBrand, selectActiveBrand } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.9rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <div
          onClick={() => onNavigate && onNavigate('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)',
            }}
          >
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              PostWise<span style={{ color: '#ec4899' }}>.AI</span>
            </h1>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>Social Content Generator</p>
          </div>
        </div>

        {/* Brand Selector Dropdown */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.5rem 0.9rem', gap: '0.5rem' }}
            >
              <Building2 size={16} color="#6366f1" />
              <span style={{ fontWeight: 600 }}>{activeBrand ? activeBrand.name : 'Select Brand Profile'}</span>
              <ChevronDown size={14} color="#94a3b8" />
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '240px',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '0.5rem',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                  zIndex: 200,
                }}
              >
                <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Your Brands
                </div>
                {brands.length === 0 ? (
                  <div style={{ padding: '0.6rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                    No brands created yet
                  </div>
                ) : (
                  brands.map((b) => (
                    <div
                      key={b._id}
                      onClick={() => {
                        selectActiveBrand(b);
                        setDropdownOpen(false);
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: activeBrand && activeBrand._id === b._id ? 700 : 500,
                        color: activeBrand && activeBrand._id === b._id ? '#6366f1' : '#f8fafc',
                        background: activeBrand && activeBrand._id === b._id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{b.name}</span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{b.industry}</span>
                    </div>
                  ))
                )}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onNavigate('brands');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      background: 'none',
                      color: '#ec4899',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <PlusCircle size={14} /> + Create New Brand Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <button onClick={onOpenAiGenerator} className="btn btn-gradient">
              <Sparkles size={16} />
              <span>Generate AI Calendar</span>
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.4rem 0.8rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #14b8a6, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#fff',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{user.name}</span>
              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'none',
                  color: '#94a3b8',
                  padding: '0.2rem',
                  marginLeft: '0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
