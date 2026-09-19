import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

const LoginRegister = () => {
  const { login, register, showToast } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('demo@postwise.ai');
    setPassword('demo123456');
    if (!isLogin) setName('Demo Creator');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          background: 'rgba(15, 23, 42, 0.85)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 0 24px rgba(99, 102, 241, 0.5)',
            }}
          >
            <Sparkles size={30} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            PostWise<span style={{ color: '#ec4899' }}>.AI</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            {isLogin ? 'Sign in to manage your AI content calendars' : 'Create an account to start generating AI social posts'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="creator@brand.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem' }}
            disabled={loading}
          >
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Login Quick Fill */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={fillDemoAccount}
            style={{
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px dashed rgba(99, 102, 241, 0.4)',
              color: '#818cf8',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            ⚡ Auto-fill Demo Credentials
          </button>
        </div>

        {/* Toggle Mode */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: '#94a3b8' }}>
          {isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', color: '#ec4899', fontWeight: 700, marginLeft: '0.3rem' }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
