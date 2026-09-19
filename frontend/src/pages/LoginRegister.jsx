import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const LoginRegister = () => {
  const { login, register, loginAsDemo, showToast } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

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
      navigate('/dashboard');
    } catch (err) {
      // Toast already shown in context
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginAsDemo();
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 animate-scale-in">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 font-bold text-xl">
              P
            </div>
            <span className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
              PostWise<span className="text-indigo-600">.ai</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {isLogin ? 'Welcome Back!' : 'Start Your Free 30-Day Plan'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isLogin
              ? 'Enter your credentials to access your social calendars'
              : 'Generate platform-tailored posts with smart AI'}
          </p>
        </div>

        {/* 1-Click Demo Login Highlight for Judges */}
        <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-900 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Instant Hackathon Demo
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200/60 text-indigo-800 font-bold">
              1-Click
            </span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Demo as Alex Morgan (EcoGlow)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none shadow-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@ecoglow.io"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In to Workspace' : 'Create Free Account'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
            ← Back to Product Overview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
